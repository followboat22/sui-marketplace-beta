import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { connect, useDispatch, useSelector } from "react-redux";
import { reduxForm } from "redux-form";
import { initFormVals } from "../../../redux/state/initialValues";
import { getLaunchpad, updateLaunchpad } from "../../../utils/api";
import Header from "../../../components/header/Header";
import Footer from "../../../components/footer/Footer";
import PageHeader from "../../../components/layouts/PageHeader";
import LoadingSpinner from "../../../components/utils/LoadingSpinner";
import ToastPopup from "../../../components/utils/ToastPopup";
import { formatDateForPicker } from "../../../utils/formats";
import EditLaunchpadDates from "./EditLaunchpadDates";
import EditLaunchpadRoadmap from "./EditLaunchpadRoadmap";
import EditLaunchpadTeam from "./EditLaunchpadTeam";
import EditLaunchpadFAQ from "./EditLaunchpadFAQ";
import WizardForm from "../../../components/layouts/WizardForm";
import EditLaunchpadListings from "./EditLaunchpadListings";

const formName = "edit-launchpad";

const validate = (values /*, dispatch */) => {
  const errors = {};

  if (values) {
    if (values.start_date >= values.end_date) {
      errors.start_date = "Start date cannot be after end date";
    }
  }
  return errors;
};

const EditLaunchpadForm = (props) => {
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();

  const { handleSubmit, pristine, submitting, invalid } = props;
  const form = useSelector((state) => state.form[formName]);
  const user = useSelector((state) => state.user);
  const [launchpad, setLaunchpad] = useState(false);

  const { id } = params;
  const admin = user?.role_id > 2;
  const collection = launchpad?.launchpad_collection;
  if (!id) navigate("/mintpad");

  useEffect(() => {
    getLaunchpad(id).then((res) => {
      if (!res.data.launchpad.object_id) navigate("/mintpad");
      setLaunchpad(res.data.launchpad);
      const initVals = res.data.launchpad;
      try {
        initVals.start_date = formatDateForPicker(res.data.launchpad.start_date);
        initVals.end_date = formatDateForPicker(res.data.launchpad.end_date);
      } catch {}
      dispatch(initFormVals(formName, initVals));
    });
    return () => {
      dispatch(initFormVals(formName));
    };
  }, []);

  const onSubmit = async (values) => {
    const updatedLaunchpad = await updateLaunchpad(id, values);
    if (updatedLaunchpad.data) {
      ToastPopup("Mintpad successfully updated.", "success");
      navigate(`/mintpad/${id}`);
    }
  };

  if (!launchpad || !form) {
    return <LoadingSpinner size="xxlarge" absolute />;
  }

  return (
    <div>
      <Header />
      <PageHeader title={`Edit Mintpad Details`}>
        <p>
          <Link to={`/mintpad/${launchpad._id}`}>
            <span className="fa fa-arrow-right"></span>View Mintpad
          </Link>
        </p>
      </PageHeader>
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
                    submitText="Save Changes"
                  >
                    <EditLaunchpadDates collection={collection} title="Dates" />
                    <EditLaunchpadTeam title="Team" />
                    <EditLaunchpadRoadmap title="Roadmap" />
                    <EditLaunchpadFAQ title="FAQ" />
                    <EditLaunchpadListings title="Listings" launchpad={launchpad} />
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

export default connect((state) => ({
  initialValues: state.initialValues[formName], // pull initial values from account reducer
}))(
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true,
    enableReinitialize: true,
    validate,
  })(EditLaunchpadForm)
);
