import { Link, useSearchParams } from "react-router-dom";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import LoadingSpinner from "../../components/utils/LoadingSpinner";
import PageHeader from "../../components/layouts/PageHeader";
import { Field, reduxForm } from "redux-form";
import "react-tabs/style/react-tabs.css";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  lendNFT,
  asValidObjectID,
  getObjectInfo,
  isValidObjectId,
  newSafe,
} from "../../web3/sui";
import {
  createListing,
  searchCollections,
  updateUserSafe,
} from "../../utils/api";
import { renderFormV2 } from "../../utils/form";
import AsyncCreatableSelect from "react-select/async-creatable";
import { useState } from "react";
import {
  getNftType,
  ipfsConvert,
  mystToSui,
  padHex,
  roundTime,
  formatDateForPicker,
} from "../../utils/formats";
import { useNavigate } from "react-router-dom";
import Avatar from "../../components/layouts/Avatar";
import { useEffect } from "react";
import { searchbarThemeStyles } from "../../components/layouts/AutocompleteSearchBar";
import { sleep } from "../../utils/time";
import { getContents } from "../../redux/state/sui";
import LoadingButton from "../../components/button/LoadingButton";
import { initFormVals } from "../../redux/state/initialValues";
import { getCurrentUser } from "../../redux/state/user";

//import { useMemo } from "react";

const formName = "safes";

const validate = (values /*, dispatch */) => {
  const errors = {};
  if (!isValidObjectId(values.object_id)) {
    errors.object_id = "Invalid Sui Object ID";
  }
  if (values) {
    if (values.start_date >= values.end_date) {
      errors.start_date = "Start date cannot be after end date";
    }
  }
  return errors;
};

const Safes = (props) => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  // const safeParam = searchParams.get("id");
  const { handleSubmit, valid, submitting } = props;
  const form = useSelector((state) => state.form[formName]);
  const [nft, setnft] = useState(false);
  const [loadingUseSafes, setLoadingUseSafes] = useState(true);
  const [detectedSafes, setdetectedSafes] = useState([]);
  const [loadingNft, setLoadingNft] = useState(false);
  const user = useSelector((state) => state.user);
  const sui = useSelector((state) => state.sui);
  const connected = sui.connected;
  const contents = sui.contents;
  const safes = contents.filter((a) => a.type.includes("safe::OwnerCap"));

  useEffect(async () => {
    if (sui.contents) {
      setdetectedSafes(sui.contents);
      setLoadingUseSafes(false);
    }
  }, [sui.contents]);

  useEffect(() => {
    if (user._id && connected) {
      dispatch(getContents(contents))
        .then(() => {
          setLoadingUseSafes(false);
        })
        .catch(() => setLoadingUseSafes(false));
    }
  }, [user, connected]);

  // useEffect(() => {
  //   if (safeParam && settings.nft_package_id) {
  //     fetchSafe(safeParam);
  //   }
  // }, [safeParam, settings]);

  useEffect(() => {
    if (form.values) {
      let { start_date, end_date, max_duration } = form.values;
      if (start_date && end_date) {
        start_date = new Date(start_date);
        end_date = new Date(end_date);
        let hours = Math.abs(end_date - start_date) / 3600000;
        if (!max_duration || hours < max_duration) {
          dispatch(
            initFormVals(formName, {
              ...form.values,
              ...{ max_duration: hours },
            })
          );
        }
      }
    }
  }, [form?.values]);

  const submit = async (values) => {
    // let info = await lendNFT(nft, safe, owner_cap, values);
    // await sleep();
    // if (info.effects.created) {
    //   const listingObject = info.effects.created.find(
    //     (item) => item.owner.ObjectOwner !== settings.market_address
    //   );
    //   const apiResponse = await createListing({
    //     listing_id: listingObject.reference.objectId,
    //   });
    //   if (apiResponse.data.success) {
    //     navigate(`/item-details/${apiResponse.data.listing._id}`);
    //   }
    // }
  };

  const setActive = async (safe) => {
    let res = await updateUserSafe({
      cap: safe.id,
      safe: safe.data.safe,
    });
    dispatch(getCurrentUser());
  };

  const createSafe = async () => {
    let res = await newSafe();
    if (res) {
      dispatch(getContents(contents));
    }
  };

  return (
    <div className="list-item">
      <Header />
      <PageHeader />
      <div className="tf-list-item tf-section">
        <div className="themesflat-container">
          <div className="row justify-content-center">
            <div className="col-xl-3 col-lg-6 col-md-9 col-12">
              <h4 className="title-list-item">Preview Safe</h4>
              {loadingNft && (
                <div className="sc-card-product">
                  <div className="card-media">
                    <LoadingSpinner />
                  </div>
                </div>
              )}
              {!loadingNft && nft.data && (
                <div className="sc-card-product">
                  <div className="card-media">
                    <Link to="#">
                      <img src={ipfsConvert(nft.data ? nft.data.url : false)} />
                    </Link>
                    {/* <Link to="/login" className="wishlist-button heart">
                    <span className="number-like"> 100</span>
                  </Link> */}
                    {/* <div className="featured-countdown">
                    <span className="slogan"></span>
                    <Countdown date={Date.now() + 500000000}>
                      <span>You are good to go!</span>
                    </Countdown>
                  </div> */}
                  </div>
                  <div className="card-title">
                    <h5>
                      <Link to="/item-details">
                        &quot;{nft.data ? nft.data.name : "???"}&quot;
                      </Link>
                    </h5>
                    <div className="tags">Sui</div>
                  </div>
                  <div className="meta-info">
                    <div className="author">
                      <div className="avatar">
                        <Avatar creator={user} size={50} />
                      </div>
                      <div className="info">
                        <span>Owned By</span>
                        <h6>
                          <Link to="#">
                            {nft.owner?.toLowerCase() == user.account_address
                              ? user.display_name
                              : "???"}
                          </Link>
                        </h6>
                      </div>
                    </div>
                    <div className="price">
                      <span>Price</span>
                      <h5>{form.values?.price ? form.values?.price : 0} SUI</h5>
                    </div>
                  </div>
                  <div className="card-bottom">
                    <Link
                      to="#"
                      className="sc-button style bag fl-button pri-3"
                    >
                      <span>Place Bid</span>
                    </Link>
                    <Link to="#" className="view-history reload">
                      View History
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <div className="col-xl-9 col-lg-12 col-md-12 col-12">
              <div className="form-list-item">
                <div className="flat-tabs tab-list-item">
                  {safes.length > 0 && (
                    <div className="content-item safeManager">
                      {safes.map((safe, index) => (
                        <div
                          key={safe.id}
                          className={`col-item safe${
                            user.primary_safe?.cap == safe.id ? " selected" : ""
                          }`}
                        >
                          <div>ID: {safe.data.safe}</div>
                          {/* <div>Balance: {mystToSui(item.balance)}</div> */}
                          <button onClick={() => setActive(safe)}>
                            Set Active
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <form onSubmit={handleSubmit(createSafe)}>
                    <LoadingButton
                      className="mt-4"
                      type="submit"
                      loading={loadingNft}
                      disabled={!valid || submitting || loadingNft}
                    >
                      Create a safe!
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

export default reduxForm({
  form: formName,
  enableReinitialize: true,
  validate,
})(Safes);
