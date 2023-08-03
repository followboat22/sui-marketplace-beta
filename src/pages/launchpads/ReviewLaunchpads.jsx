import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { SubmissionError } from "redux-form";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import PageHeader from "../../components/layouts/PageHeader";
import "react-tabs/style/react-tabs.css";
import { getAllLaunchpads, searchLaunchpads, updateLaunchpad } from "../../utils/api";
import LaunchpadCard from "../../components/layouts/launchpad/LaunchpadCard";
import ReviewModal from "../../components/layouts/collections/ReviewModal";
import { initFormVals } from "../../redux/state/initialValues";
import { formName } from "../../components/layouts/collections/ReviewModal";

const ReviewLaunchpads = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const [launchpads, setLaunchpads] = useState([]);
  const [launchpadIndex, setLaunchpadIndex] = useState(-1);
  const [page, setPage] = useState(1);

  useEffect(() => {
    // if (user._id) {
    fetchLaunchpads();
    // }
  }, [user, page]);

  const fetchLaunchpads = async () => {
    // if (user._id) {
    const res = await searchLaunchpads({
      // review_status: ["awaiting review", "under review"],
      page: page > 0 ? page : 1,
    });
    setLaunchpads(res.data.results);
    // }
  };

  const submit = async (values) => {
    const updatedLaunchpad = await updateLaunchpad(values._id, values);
    if (updatedLaunchpad.data) {
      const newLaunchpads = launchpads;
      newLaunchpads[launchpadIndex] = updatedLaunchpad.data.launchpad;
      setLaunchpadIndex(-1);
      setLaunchpads(newLaunchpads);

      // TODO: show "success" popup?
    }
  };

  return (
    <div className="your-items">
      <Header />
      <PageHeader />
      <section className="tf-section">
        <div className="themesflat-container">
          <h2 className="mg-bt-21">Mintpads</h2>
          <div>
            {launchpads.length > 0 && (
              <div className="row">
                {launchpads.map((item, index) => (
                  <div key={item._id} className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                    <LaunchpadCard
                      item={item}
                      owned
                      onClick={() => {
                        setLaunchpadIndex(index);
                        dispatch(initFormVals(formName, launchpads[index]));
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
            {launchpads.length === 0 && (
              <div>
                <br />
                <h4>You have no mintpads to review...</h4>
                <br />
              </div>
            )}
          </div>
        </div>
        <ReviewModal
          onSubmit={submit}
          onHide={() => setLaunchpadIndex(-1)}
          launchpad={launchpads[launchpadIndex]}
        />
      </section>
      <Footer />
    </div>
  );
};

export default ReviewLaunchpads;
