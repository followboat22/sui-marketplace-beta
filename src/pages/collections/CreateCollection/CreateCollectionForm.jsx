import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { reduxForm, SubmissionError } from "redux-form";
import Header from "../../../components/header/Header";
import Footer from "../../../components/footer/Footer";
import PageHeader from "../../../components/layouts/PageHeader";
import ToastPopup from "../../../components/utils/ToastPopup";
import WizardForm from "../../../components/layouts/WizardForm";
import CreateCollectionImages from "./CreateCollectionImages";
import CreateCollectionDetails from "./CreateCollectionDetails";
import CreateCollectionSocials from "./CreateCollectionSocials";
import {
  createCollection as uploadCollection,
  searchCollections,
  uploadCollectionImage,
  logCollection,
} from "../../../utils/api";
import { getTxObjects, publish, createCollection, addToAllowList } from "../../../web3/sui";
import { sleep } from "../../../utils/time";
import CreateCollectionMetadata from "./CreateCollectionMetadata";
import { IS_PROD } from "../../../utils/environments";
import { tryAgain } from "../../../utils/performance";

const formName = "create-collection";

const validate = (values /*, dispatch */) => {
  const errors = {};

  if (values) {
    if (!values.logo_image && IS_PROD) {
      errors.logo_image = "Required";
    }
    if (!values.featured_image && IS_PROD) {
      errors.featured_image = "Required";
    }
  }
  return errors;
};

const CreateCollectionForm = (props) => {
  const navigate = useNavigate();
  const { handleSubmit, pristine, submitting, invalid } = props;
  const form = useSelector((state) => state.form[formName]);
  const values = form?.values;
  const [loadingCollection, setLoadingCollection] = useState(false);
  const [logoImage, setLogoImage] = useState(null);
  const [featuredImage, setFeaturedImage] = useState(null);
  const [steps, setSteps] = useState([]);
  const settings = useSelector((state) => state.settings);

  const onSubmit = async (values) => {
    setLoadingCollection(true);
    // check if collection can be created first
    const nameTaken = await searchCollections({ name: values.name }).then(
      (res) => res.data.results[0]
    );
    if (nameTaken) {
      setLoadingCollection(false);
      throw new SubmissionError({
        name: "Name taken",
        _error: "A collection with that name already exists",
      });
    }
    if (steps.length < 1) {
      try {
        const res = await publish();
        await sleep();
        if (res?.status === "success") {
          const created = res.effects.created;
          let packageObjectId = created.find((i) => i.owner == "Immutable").reference
            .objectId;
          let carrier = created.find((i) => i.owner.AddressOwner).reference.objectId;
          setSteps([
            { packageObjectId, carrier, creation_tx: res.effects.transactionDigest },
          ]);
        } else {
          // transaction failed
          setLoadingCollection(false);
        }
      } catch (e) {
        setLoadingCollection(false);
        console.log(e);
        throw new SubmissionError({
          _error: "Transaction failed, or was cancelled",
        });
      }
    } else {
      createCollectionObject();
    }
  };

  const createCollectionObject = async () => {
    let {
      name,
      symbol,
      fields,
      description,
      royalties,
      tags,
      twitter,
      discord,
      instagram,
      whitepaper,
      website,
    } = values;
    let { packageObjectId, creation_tx, carrier } = steps[0];
    let logId = await logCollection({
      packageObjectId,
      creation_tx,
      name,
      description,
      symbol,
      tags,
      fields,
      royalties,
      twitter,
      discord,
      instagram,
      whitepaper,
      website,
    });
    const filteredTags = tags
      ?.filter((a) => a)
      .map((tagId) => settings.tags.find((tagObject) => tagId === tagObject._id).name);
    /*packageObjectId,carrier,name,desc,symbol,tags,royalties,prices,whitelist,max_supply */
    let createTx = await createCollection(
      packageObjectId,
      carrier,
      name,
      description,
      symbol,
      filteredTags,
      royalties
    );
    await sleep();
    let newCollection = await uploadCollection({
      logId: logId.data,
      tx: createTx.effects.transactionDigest,
    });
    const [, createdObjects] = await tryAgain(() => getTxObjects(createTx), 5, 5000);
    console.log(createdObjects);
    const collectionControlCap = createdObjects.find((i) =>
      i.type?.includes("CollectionControlCap")
    );

    await addToAllowList(packageObjectId, collectionControlCap.id);

    if (newCollection) {
      const id = newCollection.data.collection._id;
      const token = newCollection.data.accessToken;
      if (values.featured_image) {
        await uploadCollectionImage(token, id, values.featured_image);
      }
      if (values.logo_image) {
        await uploadCollectionImage(token, id, values.logo_image, "logo");
      }
      navigate(`/profile/collections`);
    }
    setLoadingCollection(false);
  };

  useEffect(async () => {
    if (steps.length >= 1) {
      createCollectionObject();
    }
  }, [steps]);

  return (
    <div>
      <Header />
      <PageHeader />
      <div className="tf-list-item tf-section">
        <div className="themesflat-container">
          <div className="row">
            <div className="col-12">
              <div className="flat-form flat-form-wide">
                <div className="flat-tabs tab-list-item">
                  <WizardForm
                    onSubmit={onSubmit}
                    handleSubmit={handleSubmit}
                    pristine={pristine}
                    submitting={submitting}
                    invalid={invalid}
                    submitText="Create Collection"
                  >
                    <CreateCollectionImages
                      title="Uploads"
                      logoImage={logoImage}
                      setLogoImage={setLogoImage}
                      featuredImage={featuredImage}
                      setFeaturedImage={setFeaturedImage}
                    />
                    <CreateCollectionDetails title="Details" />
                    <CreateCollectionMetadata title="Metadata" />
                    <CreateCollectionSocials title="Socials" />
                  </WizardForm>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default reduxForm({
  form: formName,
  // destroyOnUnmount: false,
  // forceUnregisterOnUnmount: true,
  validate,
})(CreateCollectionForm);
