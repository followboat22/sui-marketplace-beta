import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { reduxForm, change } from "redux-form";
import Header from "../../../components/header/Header";
import Footer from "../../../components/footer/Footer";
import PageHeader from "../../../components/layouts/PageHeader";
import WizardForm from "../../../components/layouts/WizardForm";
import CreateItemImages from "./CreateItemImages";
import CreateItemDetails from "./CreateItemDetails";
import {
  announceNFTs,
  createNFT,
  getMyCollections,
  getMyLaunchpads,
  updateLaunchpadListings,
  uploadNFTImage,
} from "../../../utils/api";
import CreateItemMintType from "./CreateItemMintType";
import { getNFTImageURL, suiToMyst } from "../../../utils/formats";
import { mintNFT } from "../../../web3/sui";
import { sleep } from "../../../utils/time";
import { tryAgain } from "../../../utils/performance";
import ToastPopup from "../../../components/utils/ToastPopup";

const formName = "create-nft";

const validate = (values /*, dispatch */) => {
  const errors = {};

  if (values) {
    if (values.start_date >= values.end_date) {
      errors.start_date = "Start date cannot be after end date";
    }
    if (!values.image) errors.image = "Required";
  }
  return errors;
};

const CreateItemForm = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { handleSubmit, pristine, submitting, invalid } = props;
  const form = useSelector((state) => state.form[formName]);
  const user = useSelector((state) => state.user);
  const values = form?.values;
  const registeredFields = form?.registeredFields || {};
  const [collections, setCollections] = useState([]);
  const [launchpads, setLaunchpads] = useState([]);
  const [nftImage, setNFTImage] = useState(null);
  const [mintType, setMintType] = useState(0);
  const collection = collections[values?.collection];
  const [tab, setTab] = useState(0);
  const collectionLaunchpads = launchpads.filter(
    (pad) => pad.launchpad_collection?._id === collection?._id
  );
  const launchpad = collectionLaunchpads[values?.launchpad];

  useEffect(() => {
    if (values) {
      const oldValues = Object.keys(values).filter(
        (key) => !Object.keys(registeredFields).includes(key)
      );
      oldValues.forEach((field) => {
        dispatch(change(formName, field, undefined));
      });
    }
  }, [collection]);

  const fetchCollections = async () => {
    const req = await getMyCollections();
    setCollections(req.data.results);
  };

  const fetchLaunchpads = async () => {
    const req = await getMyLaunchpads();
    setLaunchpads(req.data.results);
  };

  useEffect(() => {
    if (user._id) {
      fetchCollections();
      fetchLaunchpads();
    }
  }, [user]);

  const onSubmit = async (values) => {
    // upload iamage
    let image = URL.createObjectURL(values?.image);
    values.count = values.count || 1;

    const createReponse = await createNFT({
      ...values,
      ...{ image, collection: collection._id },
    });

    // if (values.image) {
    image = await uploadNFTImage(
      createReponse.data.accessToken,
      collection._id,
      createReponse.data.nft._id,
      values.image
    ).then(() => getNFTImageURL(collection._id, createReponse.data.nft._id));
    // }

    let type = false;
    if (mintType === 0) {
      switch (tab) {
        case 0:
          type = "list";
          break;
        case 1:
          type = "auction";
          break;
        case 2:
          type = "launchpad";
          break;
        default:
          break;
      }
    }
    const info = await mintNFT(
      {
        ...values,
        ...{
          launchpad,
          image,
          nft_colection: createReponse.data.nft.nft_collection,
          price: suiToMyst(values?.price),
        },
      },
      type
    );
    await sleep();

    const apiResponse = await tryAgain(
      () => announceNFTs(info.effects.transactionDigest),
      2
    );

    if (mintType === 0) {
      if (tab === 2) {
        updateLaunchpadListings(launchpad._id, values.tier || 0);
        ToastPopup("Mintpad successfully updated.", "success");
      } else {
        if (apiResponse.data?.listings) {
          navigate(`/item-details/${apiResponse.data.listings[0]._id}`);
        }
      }
    } else {
      if (apiResponse.data) {
        ToastPopup("Nft(s) minted successfully", "success");
        navigate(`/profile/owned-nfts`);
      }
    }
  };

  return (
    <div className="list-item">
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
                    submitText={mintType === 1 ? "Mint Only" : "Mint and List"}
                  >
                    <CreateItemImages
                      title="Uploads"
                      nftImage={nftImage}
                      setNFTImage={setNFTImage}
                    />
                    <CreateItemDetails
                      title="Details"
                      collections={collections}
                      collection={collection}
                    />
                    <CreateItemMintType
                      title="Mint Type"
                      setTab={setTab}
                      tab={tab}
                      setMintType={setMintType}
                      collection={collection}
                      launchpad={launchpad}
                      collectionLaunchpads={collectionLaunchpads}
                    />
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
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: false,
  validate,
})(CreateItemForm);
