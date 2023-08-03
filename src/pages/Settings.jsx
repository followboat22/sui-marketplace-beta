import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch, connect } from "react-redux";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import bg1 from "../assets/images/arcade-panda.6d45b60f713a1bdfd905.png";
import bg2 from "../assets/images/arcade-panda.6d45b60f713a1bdfd905.png";
import bg3 from "../assets/images/arcade-panda.6d45b60f713a1bdfd905.png";
import bg4 from "../assets/images/arcade-panda.6d45b60f713a1bdfd905.png";
import PageHeader from "../components/layouts/PageHeader";
import { renderForm, renderFormV2 } from "../utils/form";
import { change, reduxForm, Field } from "redux-form";
import { FileInputHidden } from "../components/layouts/FileUploadHidden";
import { asyncValidateDuplicateField, uploadUserImage } from "../utils/api";
import { getUserImageURL, imageOnErrorHandler } from "../utils/formats";
import ToastPopup from "../components/utils/ToastPopup";
import { updateUserProfile } from "../redux/state/user";
import { getCurrentUser } from "../redux/state/user";
import LoadingButton from "../components/button/LoadingButton";

const formName = "settings";

export const isValidDisplayName = (values, displayName) => {
  return asyncValidateDuplicateField({ display_name: values.display_name }).then(
    (result) => {
      if (!!result.data && displayName !== result.data.display_name) {
        throw {
          display_name: "That display name is taken",
          _error: "display-name-exists",
        };
      }
    }
  );
};

const validate = (values) => {
  const errors = {};
  const requiredFields = ["display_name", "email_address"];
  requiredFields.forEach((field) => {
    if (!values[field]) {
      errors[field] = "Required";
    }
  });
  if (
    values.email_address &&
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email_address)
  ) {
    errors.email_address = "Invalid email address";
  }

  return errors;
};

const asyncValidate = (values, dispatch, props) => {
  const displayName = props.displayName;
  return isValidDisplayName(values, displayName);
};

const Settings = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { handleSubmit, pristine, submitting } = props;
  const form = useSelector((state) => state.form[formName]);
  const user = useSelector((state) => state.user);
  const [avatar, setAvatar] = useState(null);
  const [customBanner, setCustomBanner] = useState(null);
  const [selectedBanner, setSelectedBanner] = useState(user.banner);
  const [submitLoading, setSubmitLoading] = useState(false);
  const fallback = `https://gravatar.com/avatar/${user._id}?f=y&d=identicon&size=350`;
  const banners = [bg1, bg2, bg3, bg4];

  const bioCharactersRemaining = `${Math.max(
    160 - (form.values?.bio?.length || 0),
    0
  )} characters remaining`;

  const changeBanner = (index) => {
    setSelectedBanner(index);
    dispatch(change(formName, "banner", index));
  };

  const onAvatarChange = (data) => {
    setAvatar(data);
  };

  const onCustomBannerChange = (data) => {
    setCustomBanner(data);
    setSelectedBanner(undefined);
  };

  useEffect(() => {
    if (!user._id) {
      navigate("/", "replace");
      ToastPopup("Please connect your wallet to continue", "error");
    }
  }, [user]);

  const submit = (values) => {
    setSubmitLoading(true);
    let promises = [];
    if (!customBanner) {
      values.banner = selectedBanner;
    } else {
      values.banner = null;
    }
    dispatch(updateUserProfile(values))
      .then(async (res) => {
        dispatch(getCurrentUser());
        if (avatar)
          promises.push(uploadUserImage(res.data.accessToken, user._id, values.avatar));
        if (customBanner && selectedBanner === undefined)
          promises.push(
            uploadUserImage(res.data.accessToken, user._id, customBanner, "banner")
          );
        await Promise.all(promises).then(() => {
          ToastPopup("Profile successfully updated!", "success");
          promises = [];
        });
        setSubmitLoading(false);
      })
      .catch((e) => setSubmitLoading(false));
  };

  return (
    <div>
      <Header />
      <PageHeader />
      <div className="tf-list-item tf-section">
        <div className="themesflat-container" style={{ width: "700px" }}>
          <div className="row">
            <div className="col-12">
              <div className="form-upload-profile">
                <h4 className="title-list-item">Upload a Banner</h4>
                <p
                  style={{
                    fontSize: "16px",
                    fontWeight: 400,
                    color: "hsl(0, 0%, 50%)",
                    marginBottom: "1rem",
                    lineHeight: "18px",
                  }}
                >
                  Recommended size: 1920x300px, 2.5mb max file size
                </p>
                <div style={{ marginBottom: "24px" }}>
                  <form className="uploadBorder" action="#">
                    <label className="uploadFile">
                      {!customBanner && user.banner === null ? (
                        <img src={getUserImageURL(user._id, "banner")} />
                      ) : (
                        !!customBanner && <img src={URL.createObjectURL(customBanner)} />
                      )}
                      {renderForm(form, "banner", {
                        hidename: true,
                        name: "banner",
                        component: FileInputHidden,
                        onChange: onCustomBannerChange,
                      })}
                      <i className="fas fa-image"></i>
                    </label>
                  </form>
                </div>
                <h4 className="title-list-item">Default Banners</h4>
                <div className="option-profile">
                  {banners.map((banner, index) => (
                    <div
                      key={index}
                      name="banner"
                      className={`image ${selectedBanner === index ? "selected" : ""}`}
                      onClick={() => changeBanner(index)}
                    >
                      <img src={banner} />
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    marginBottom: "24px",
                    display: "flex",
                    alignItems: "center",
                    gap: "2rem",
                  }}
                >
                  <form className="uploadBorder" action="#">
                    <label className="uploadFile" style={{ width: "150px" }}>
                      <img
                        id="profileimg"
                        src={
                          (!!avatar && URL.createObjectURL(avatar)) ||
                          getUserImageURL(user._id, "avatar")
                        }
                        onError={(e) => imageOnErrorHandler(e, fallback)}
                      />
                      <i className="fal fa-camera-alt" />
                      {renderForm(form, "avatar", {
                        hidename: true,
                        name: "avatar",
                        component: FileInputHidden,
                        onChange: onAvatarChange,
                      })}
                    </label>
                  </form>
                  <div className="flex flex-column">
                    <h4 className="title-list-item">Avatar</h4>
                    <span
                      style={{
                        fontSize: "16px",
                        fontWeight: 400,
                        color: "hsl(0, 0%, 50%)",
                      }}
                    >
                      Recommended size: 200x200px, 2.5mb max file size
                    </span>
                  </div>
                </div>
                <form onSubmit={handleSubmit(submit)}>
                  <div className="form-info-profile">
                    <div className="info-account">
                      <h4 className="title-list-item">Account Info</h4>

                      <Field
                        name="display_name"
                        type="text"
                        placeholder="Trista Francis"
                        labelClass="title-info-account"
                        component={renderFormV2}
                        props={{ minLength: 3 }}
                        required
                      />
                      <Field
                        name="email_address"
                        type="text"
                        placeholder="Enter your email"
                        labelClass="title-info-account"
                        component={renderFormV2}
                        props={{ minLength: 3 }}
                        required
                      />
                      <Field
                        name="bio"
                        type="textarea"
                        labelClass="title-info-account"
                        component={renderFormV2}
                        props={{ maxLength: 160, rows: 5, tabIndex: 4 }}
                        subText={bioCharactersRemaining}
                        required
                      />
                    </div>
                    <div className="info-social">
                      <h4 className="title-list-item">Your Social Media</h4>
                      <fieldset>
                        <h4 className="title-info-account">Twitter</h4>
                        <input type="text" placeholder="Twitter username" disabled />
                        <Link to="#" className="connect">
                          <i className="fab fa-twitter"></i>Connect to Twitter
                        </Link>
                      </fieldset>
                      <fieldset>
                        <h4 className="title-info-account">SuiNS</h4>
                        <input type="text" placeholder={user.suiName} disabled />
                        <a
                          target="_blank"
                          href="https://www.suins.io/"
                          className="connect"
                          rel="noreferrer"
                        >
                          Get a .SUI Name
                        </a>
                      </fieldset>
                    </div>
                  </div>
                  <LoadingButton
                    loading={submitLoading}
                    className="tf-button-submit mg-t-15"
                    type="submit"
                    disabled={pristine || submitting || submitLoading}
                  >
                    Update Profile
                  </LoadingButton>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

const mapStateToProps = (state) => ({
  initialValues: {
    ...state.user,
  },
  displayName: state.user.display_name,
});

export default connect(mapStateToProps)(
  reduxForm({
    form: formName,
    enableReinitialize: true,
    validate,
    asyncValidate,
    asyncChangeFields: ["display_name"],
  })(Settings)
);
