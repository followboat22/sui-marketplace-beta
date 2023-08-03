import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import PageHeader from "../../components/layouts/PageHeader";
import { useState } from "react";
import { Field, reduxForm, SubmissionError } from "redux-form";
import "react-tabs/style/react-tabs.css";
import { useSelector } from "react-redux";
import { addCollection, searchCollections, uploadCollectionImage } from "../../utils/api";
import { renderFormV2 } from "../../utils/form";
import { useNavigate } from "react-router-dom";
import { isValidObjectId } from "../../web3/sui";
import ExampleSVG from "../../assets/images/arcade-panda.6d45b60f713a1bdfd905.png";
import { padHex } from "../../utils/formats";
import LoadingButton from "../../components/button/LoadingButton";

const formName = "add-collection";

const validate = (values) => {
  const errors = {};
  const collectionData = values.collection_id?.split("::");
  if (collectionData) {
    if (collectionData[0]) {
      collectionData[0] = padHex(collectionData[0], 40);
    }
    if (collectionData.length < 3) {
      errors.collection_id =
        "Invalid collection id. Expected 3 elements separated by '::'";
    } else if (!isValidObjectId(collectionData[0])) {
      errors.collection_id = "Invalid collection id. Should start with a valid Object ID";
    }
  }

  return errors;
};

const validateType = (val) => {
  const trimmed = val.trim();
  const collectionData = trimmed?.split("::");
  if (collectionData?.[0]) {
    collectionData[0] = padHex(collectionData[0], 40);
  }
  return collectionData.join("::");
};

const AddCollection = (props) => {
  const navigate = useNavigate();
  const { handleSubmit, pristine, submitting, error } = props;
  const form = useSelector((state) => state.form[formName]);
  const [loadingCollection, setLoadingCollection] = useState(false);

  const submit = async (values) => {
    setLoadingCollection(true);
    const nameTaken = await searchCollections({ name: values.name }).then(
      (res) => res.data.results[0]
    );
    if (nameTaken) {
      throw new SubmissionError({
        name: "Name taken",
        _error: "A collection with that name already exists",
      });
    }

    const newCollection = await addCollection(values);
    if (newCollection.data) {
      const id = newCollection.data.collection._id;
      const token = newCollection.data.accessToken;
      if (values.featured_image) {
        await uploadCollectionImage(token, id, values.featured_image);
      }
      if (values.logo_image) {
        await uploadCollectionImage(token, id, values.logo_image, "logo");
      }
      navigate(`/collection-details/${newCollection.data.collection._id}`);
    }
    setLoadingCollection(false);
  };

  return (
    <div>
      <Header />
      <PageHeader />
      <div className="tf-list-item tf-section">
        <div className="themesflat-container">
          <div className="row">
            <div className="col-12">
              <div className="flat-form">
                <div className="flat-tabs tab-list-item">
                  <form onSubmit={handleSubmit(submit)}>
                    <Field
                      name="featured_image"
                      type="file"
                      className="hideInput"
                      featuredImage={form?.values?.featured_image}
                      component={renderFormV2}
                    />
                    <Field
                      name="logo_image"
                      type="file"
                      className="hideInput"
                      labelClassName="square"
                      featuredImage={form?.values?.logo_image}
                      component={renderFormV2}
                    />
                    <img src={ExampleSVG} style={{ margin: "auto", display: "block" }} />
                    <Field
                      name="collection_id"
                      type="text"
                      props={{ minLength: 48 }}
                      component={renderFormV2}
                      placeholder="e.g. 0x8c7b25f7....6a::my_nft::MyNFT"
                      parse={validateType}
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
                      type="text"
                      name="name"
                      component={renderFormV2}
                      placeholder="Collection Name"
                      required
                    />
                    <Field
                      name="description"
                      type="textarea"
                      component={renderFormV2}
                      placeholder='e.g. "This is my collection!"'
                      required
                    />
                    <p className="error">{error}</p>
                    <LoadingButton
                      type="submit"
                      loading={loadingCollection}
                      disabled={pristine || submitting || loadingCollection}
                    >
                      Add Collection
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

export default reduxForm({ form: formName, validate })(AddCollection);
