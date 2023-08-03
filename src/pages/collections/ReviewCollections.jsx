import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { SubmissionError } from "redux-form";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import PageHeader from "../../components/layouts/PageHeader";
import "react-tabs/style/react-tabs.css";
import {
  getAllCollections,
  searchCollections,
  updateCollection,
  uploadCollectionImage,
} from "../../utils/api";
import CollectionCard from "../../components/layouts/CollectionCard";
import ReviewModal from "../../components/layouts/collections/ReviewModal";
import { initFormVals } from "../../redux/state/initialValues";
import { formName } from "../../components/layouts/collections/ReviewModal";

const CreateItem = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const [collections, setCollections] = useState([]);
  const [collectionIndex, setCollectionIndex] = useState(-1);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (user._id) {
      fetchCollections();
    }
  }, [user, page]);

  const fetchCollections = async () => {
    if (user._id) {
      const res = await getAllCollections({
        // review_status: ["awaiting review", "under review"],
        page: page > 0 ? page : 1,
      });
      setCollections(res.data.results);
    }
  };

  const submit = async (values) => {
    const nameTaken = await searchCollections({ name: values.name }).then(
      (res) => res.data.results[0]
    );
    if (nameTaken && nameTaken._id !== values._id) {
      throw new SubmissionError({
        name: "Name taken",
        _error: "A collection with that name already exists",
      });
    }

    const updatedCollection = await updateCollection(values._id, values);
    if (updatedCollection.data) {
      const token = updatedCollection.data.accessToken;
      if (values.featured_image) {
        await uploadCollectionImage(token, values._id, values.featured_image);
      }
      if (values.logo_image) {
        await uploadCollectionImage(token, values._id, values.logo_image, "logo");
      }
      const newCollections = collections;
      newCollections[collectionIndex] = updatedCollection.data.collection;
      setCollectionIndex(-1);
      setCollections(newCollections);

      // TODO: show "success" popup?
    }
  };

  return (
    <div className="your-items">
      <Header />
      <PageHeader />
      <section className="tf-section">
        <div className="themesflat-container">
          <h2 className="mg-bt-21">Collections</h2>
          <div>
            {collections.length > 0 && (
              <div className="row">
                {collections.map((collection, index) => (
                  <div
                    key={collection._id}
                    className="col-xl-3 col-lg-4 col-md-6 col-sm-6"
                  >
                    <CollectionCard
                      collection={collection}
                      owned
                      onClick={() => {
                        setCollectionIndex(index);
                        dispatch(initFormVals(formName, collections[index]));
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
            <div>
              <button onClick={() => setPage(page - 1)}>prev</button>
              <button onClick={() => setPage(page + 1)}>next</button>
            </div>
            {collections.length === 0 && (
              <div>
                <br />
                <h4>You have no collections to review...</h4>
                <br />
              </div>
            )}
          </div>
        </div>
        <ReviewModal
          onSubmit={submit}
          onHide={() => setCollectionIndex(-1)}
          collection={collections[collectionIndex]}
        />
      </section>
      <Footer />
    </div>
  );
};

export default CreateItem;
