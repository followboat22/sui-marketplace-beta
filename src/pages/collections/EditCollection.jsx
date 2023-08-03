import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import PageHeader from "../../components/layouts/PageHeader";
import { Field, FieldArray, reduxForm, SubmissionError } from "redux-form";
import { Accordion } from "react-bootstrap-accordion";
import "react-tabs/style/react-tabs.css";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  createLaunchpad,
  createLaunchpadContract,
  getLaunchpadsForCollection,
  getMyCollection,
  searchCollections,
  updateCollection,
  uploadCollectionImage,
} from "../../utils/api";
import { renderForm, renderFormV2, renderSearchFields, renderSetTags } from "../../utils/form";
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FileInput } from "../../components/layouts/FileUpload";
import { useEffect } from "react";
import LoadingSpinner from "../../components/utils/LoadingSpinner";
import { initFormVals } from "../../redux/state/initialValues";
import { getCollectionImageURL, suiToMyst } from "../../utils/formats";
import ToastPopup from "../../components/utils/ToastPopup";
import RoyaltiesButtonGroup from "../../components/layouts/RoyaltiesButtonGroup";
import LoadingButton from "../../components/button/LoadingButton";
import { createLaunchpad as setupLaunchpad } from "../../web3/sui";
import { sleep } from "../../utils/time";

const formName = "edit-collection";

const validate = (values /*, dispatch */) => {
  const errors = {};

  const nameList = [];
  errors.fields = [];
  if (values.fields?.length > 1) {
    values.fields.forEach((element, index) => {
      if (nameList.includes(element.name)) {
        errors.fields[index] = { name: "Duplicate field name", values: [] };
      } else {
        nameList.push(element.name);
      }
      if (values.fields[index].values?.length > 1) {
        const subNameList = [];
        values.fields[index].values.forEach((subElement, subIndex) => {
          if (!errors.fields[index]) {
            errors.fields[index] = { values: [] };
          }
          if (subNameList.includes(subElement)) {
            errors.fields[index].values[subIndex] = "Duplicate value";
          } else {
            subNameList.push(subElement);
          }
        });
      }
    });
  }
  return errors;
};

const EditCollection = (props) => {
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const { handleSubmit, pristine, submitting, error, initialValues, initialized } = props;
  const user = useSelector((state) => state.user);
  const form = useSelector((state) => state.form[formName]);
  const values = form?.values;
  const [loadingCollection, setLoadingCollection] = useState(true);
  const [collection, setCollection] = useState(false);
  const [launchpad, setLaunchpad] = useState(false);
  const { id } = params;
  if (!id) navigate("/explore");

  useEffect(() => {
    getMyCollection(id).then((res) => {
      dispatch(initFormVals(formName, res.data));
      setCollection(res.data);
      setLoadingCollection(false);
      getLaunchpadsForCollection(id).then((res) => {
        setLaunchpad(res.data[0]);
      });
    });
    return () => {
      dispatch(initFormVals(formName));
    };
  }, []);

  const handleLaunchpad = async () => {
    if (!launchpad?.object_id) {
      const tx = await setupLaunchpad(collection, ["10000000"], [false], ["10000000"]);
      await sleep();
      // eslint-disable-next-line no-undef
      let res = await createLaunchpad(`/edit-mintpad/${ collection._id }`);
      await createLaunchpadContract(tx.effects.transactionDigest, res.data.launchpad._id);
      navigate(`/edit-mintpad/${res.data.launchpad._id}`);
    } else {
      navigate(`/edit-mintpad/${launchpad._id}`);
    }
  };

  const submit = async (values) => {
    const nameTaken = await searchCollections({ name: values.name }).then(
      (res) => res.data.results[0]
    );
    if (nameTaken && nameTaken._id !== id) {
      throw new SubmissionError({
        name: "Name taken",
        _error: "A collection with that name already exists",
      });
    }

    const updatedCollection = await updateCollection(id, values);
    if (updatedCollection.data) {
      const token = updatedCollection.data.accessToken;
      if (values.featured_image) {
        await uploadCollectionImage(token, id, values.featured_image);
      }
      if (values.logo_image) {
        await uploadCollectionImage(token, id, values.logo_image, "logo");
      }
      // TODO: show "success" popup?
      ToastPopup("Collection successfully updated.", "success");
    }
  };

  if (!collection || !form) {
    return <LoadingSpinner size="xxlarge" absolute />;
  }

  return (
    <div>
      <Header />
      <PageHeader title={`Edit “${collection.name}”`}>
        <p>
          <Link to={`/collection-details/${collection._id}`}>View Collection</Link>
        </p>
        {!!user.permissions?.launchpad_creator && (
          <button onClick={handleLaunchpad}>
            {launchpad ? "Edit Mintpad" : "Create Mintpad"}
          </button>
        )}
      </PageHeader>
      <div className="tf-list-item tf-section">
        <div className="themesflat-container">
          <div className="row">
            <div className="col-12">
              <div className="flat-form">
                <div className="flat-tabs tab-list-item">
                  <form onSubmit={handleSubmit(submit)}>
                    {renderForm(form, "logo_image", {
                      type: "file",
                      className: "hideInput",
                      labelClassName: "square",
                      component: FileInput,
                      featuredImage:
                        form?.values?.logo_image ||
                        getCollectionImageURL(collection._id, "logo"),
                    })}
                    {renderForm(form, "featured_image", {
                      type: "file",
                      className: "hideInput",
                      component: FileInput,
                      featuredImage:
                        form?.values?.featured_image ||
                        getCollectionImageURL(collection._id),
                    })}
                    <Field
                      name="name"
                      title="Collection Name"
                      type="text"
                      placeholder="Collection Name"
                      component={renderFormV2}
                      required
                    />
                    <Field
                      name="symbol"
                      title="Collection Symbol"
                      type="text"
                      placeholder="e.g. CAPY"
                      component={renderFormV2}
                      required
                    />
                    <Field
                      name="description"
                      type="textarea"
                      placeholder='e.g. "This is my collection!"'
                      component={renderFormV2}
                      required
                    />
                    {/* <Field
                      type="textarea"
                      name="project_details"
                      props={{
                        placeholder:
                          "Tell us about your project, it may help speed up the approval process.",
                      }}
                      required
                      component={renderFormV2}
                    /> */}
                    <Field
                      name="royalties"
                      label="Royalties"
                      component={RoyaltiesButtonGroup}
                    />
                    <h2 className="mg-bt-24 mg-t-40">Socials</h2>
                    <Field
                      name="twitter"
                      type="text"
                      placeholder="https://twitter.com/"
                      component={renderFormV2}
                    />
                    <Field
                      name="discord"
                      type="text"
                      placeholder="https://discord.gg/"
                      component={renderFormV2}
                    />
                    <Field
                      name="instagram"
                      type="text"
                      placeholder="https://instagram.com/"
                      component={renderFormV2}
                    />
                    <Field name="whitepaper" type="text" component={renderFormV2} />
                    <Field name="website" type="text" component={renderFormV2} />
                    <Accordion title="Tags" show={true}>
                      <FieldArray
                        name="tags"
                        title="Tags"
                        component={renderSetTags}
                        className="pt-24"
                      />
                    </Accordion>
                    <FieldArray
                      name="fields"
                      title="Metadata Information"
                      component={renderSearchFields}
                      rerenderOnEveryChange
                    />
                    <LoadingButton
                      type="submit"
                      loading={loadingCollection}
                      disabled={pristine || submitting || loadingCollection}
                    >
                      Update Collection
                    </LoadingButton>
                  </form>
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

export default connect((state) => ({
  initialValues: state.initialValues[formName], // pull initial values from account reducer
}))(reduxForm({ form: formName, enableReinitialize: true, validate })(EditCollection));
