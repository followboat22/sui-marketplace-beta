import { Link, useSearchParams } from "react-router-dom";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import LoadingSpinner from "../../components/utils/LoadingSpinner";
import PageHeader from "../../components/layouts/PageHeader";
import { Field, reduxForm } from "redux-form";
import "react-tabs/style/react-tabs.css";
import { connect, useDispatch, useSelector } from "react-redux";
import { lendNFT, asValidObjectID, getObjectInfo, isValidObjectId } from "../../web3/sui";
import { createListing, createLoanListing, searchCollections } from "../../utils/api";
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

//import { useMemo } from "react";

const formName = "list-nft";

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

const ListItem = (props) => {
  const [searchParams] = useSearchParams();
  const nftParam = searchParams.get("id");
  const navigate = useNavigate();
  const { handleSubmit, valid, submitting } = props;
  const form = useSelector((state) => state.form[formName]);
  const [nft, setnft] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [loadingUseNFTs, setLoadingUseNFTs] = useState(true);
  const [detectedNFTs, setdetectedNFTs] = useState([]);
  const [loadingNft, setLoadingNft] = useState(false);
  const [contract, setContract] = useState(false);
  const [notOwnerError, setNotOwnerError] = useState(false);
  const user = useSelector((state) => state.user);
  const settings = useSelector((state) => state.settings);
  const sui = useSelector((state) => state.sui);
  const connected = sui.connected;
  const contents = sui.contents;
  const dispatch = useDispatch();

  useEffect(async () => {
    if (sui.contents) {
      setdetectedNFTs(sui.contents.filter((a) => a.data?.url));
      setLoadingUseNFTs(false);
    }
  }, [sui.contents]);

  useEffect(() => {
    if (user._id && connected) {
      dispatch(getContents(contents))
        .then(() => {
          setLoadingUseNFTs(false);
        })
        .catch(() => setLoadingUseNFTs(false));
    }
  }, [user, connected]);

  useEffect(() => {
    if (nftParam && settings.nft_package_id) {
      fetchNFT(nftParam);
    }
  }, [nftParam, settings]);

  const fetchNFT = async (id) => {
    if (isValidObjectId(id)) {
      setLoadingNft(true);
      let info = await getObjectInfo(id);
      if (info) {
        setnft(info);

        if (!detectedNFTs.find((nft) => nft.id == id)) {
          let newNfts = detectedNFTs.slice();
          newNfts.push(info);
          setdetectedNFTs(newNfts);
        }
        if (info.owner?.toLowerCase() !== user.account_address) {
          setNotOwnerError(
            `NFT Owner is ${info.owner?.toLowerCase()}, your account is ${
              user.account_address
            }`
          );
        } else {
          setNotOwnerError(false);
        }
        const nftType = getNftType(info.type);
        const collectionTypes = nftType.split("::");
        const package_object_id = padHex(collectionTypes[0]);

        const hasContract = await searchCollections({
          object_id: package_object_id,
          module_name: collectionTypes[1],
          nft_name: collectionTypes[2],
        }).then((res) => res.data.results[0]);
        if (hasContract) {
          setContract(hasContract);
        } else {
          setContract(false);
        }
      }
      setLoadingNft(false);
    }
  };

  useEffect(() => {
    dispatch(
      initFormVals(formName, {
        min_duration: 1,
        start_date: formatDateForPicker(roundTime(new Date())),
      })
    );
  }, []);

  useEffect(() => {
    if (form.values) {
      let { start_date, end_date, max_duration } = form.values;
      if (start_date && end_date) {
        start_date = new Date(start_date);
        end_date = new Date(end_date);
        let hours = Math.abs(end_date - start_date) / 3600000;
        if (!max_duration || hours < max_duration) {
          dispatch(
            initFormVals(formName, { ...form.values, ...{ max_duration: hours } })
          );
        }
      }
    }
  }, [form?.values]);

  const submit = async (values) => {
    setFormLoading(true);
    try {
      let res = await lendNFT(nft, user.primary_safe, values);
      if (res?.status === "success") {
        await sleep();
        const created = await createLoanListing(res.effects.transactionDigest);
        if (created) {
          navigate(`/rental-details/${created.data.listings[0]._id}`);
        }
      }
      // todo, pass tx digest to server
    } catch (e) {
      setFormLoading(false);
      console.log(e);
    }
  };

  // TODD: check if they have a safe selected, if not redirect them to safe page
  return (
    <div className="list-item">
      <Header />
      <PageHeader />
      <div className="tf-list-item tf-section">
        <div className="themesflat-container">
          <div className="row justify-content-center">
            <div className="col-xl-3 col-lg-6 col-md-9 col-12">
              <h4 className="title-list-item">Preview NFT</h4>
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
                    <Link to="#" className="sc-button style bag fl-button pri-3">
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
                  <form onSubmit={handleSubmit(submit)}>
                    {/* <Field
                        type="text"
                        required={true}
                        props={{ minLength: 40 }}
                        parse={asValidObjectID}
                        component={renderFormV2}
                        onChange={(_, newValue) => fetchNFT(newValue)}
                      /> */}
                    <div className="field-container">
                      <h4 className="title-list-item">NFT</h4>
                      <AsyncCreatableSelect
                        name="object_id"
                        className="nft_select"
                        onChange={(e) => fetchNFT(e.value)}
                        styles={searchbarThemeStyles}
                        isLoading={loadingUseNFTs}
                        minLength={40}
                        placeholder="e.g. 0x8c7b25f7....6a"
                        openMenuOnFocus={!!form.values?.object_id}
                        openMenuOnClick={!!form.values?.object_id}
                        defaultOptions={detectedNFTs.map((nft) => ({
                          value: nft.id,
                          label: nft.id,
                          url: nft.data?.url,
                          id: nft.id,
                        }))}
                        onBlur={(e) => {
                          let value = asValidObjectID(e.target.value);
                          fetchNFT(value);
                        }}
                        value={{
                          value: nft.id,
                          label: nft.id,
                          url: nft.data?.url,
                          id: nft.id,
                        }}
                        isValidNewOption={(val) => isValidObjectId(val)}
                        allowCreateWhileLoading={true}
                        formatOptionLabel={(nft) => (
                          <div className="nft_option">
                            <img src={ipfsConvert(nft.url)} />
                            <span>{nft.label}</span>
                          </div>
                        )}
                        formatCreateLabel={(op) => <span>{op}</span>}
                      />
                    </div>
                    {notOwnerError && <div className="form-error">{notOwnerError}</div>}
                    <Field
                      type="number"
                      name="price"
                      title="Price Per Day"
                      props={{
                        min: mystToSui(settings.min_bid_increment),
                        step: "any",
                      }}
                      required
                      component={renderFormV2}
                    />
                    <div className="row">
                      <div className="col-md-6">
                        <Field
                          type="datetime-local"
                          name="start_date"
                          title="Starting date"
                          props={{ min: "2022-01-01 00:00", step: 3600 }}
                          parse={(val) => formatDateForPicker(roundTime(val, "hours"))}
                          required
                          component={renderFormV2}
                        />
                      </div>
                      <div className="col-md-6">
                        <Field
                          type="datetime-local"
                          name="end_date"
                          title="End date"
                          props={{ min: "2022-01-01 00:00", step: 3600 }}
                          parse={(val) => formatDateForPicker(roundTime(val, "hours"))}
                          required
                          component={renderFormV2}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <Field
                          type="number"
                          name="min_duration"
                          title="Minimum Rent Duration (Hours)"
                          props={{
                            min: 1,
                            step: "1",
                          }}
                          required
                          component={renderFormV2}
                        />
                      </div>
                      <div className="col-md-6">
                        <Field
                          type="number"
                          name="max_duration"
                          title="Maximum Rent Duration (Hours)"
                          props={{
                            min: 1,
                            step: "1",
                          }}
                          required
                          component={renderFormV2}
                        />
                      </div>
                    </div>
                    {contract && nft && (
                      <div>
                        <p>{/*TODO: show fee info for collection */}</p>
                      </div>
                    )}
                    {!contract && nft && (
                      <div>
                        <p className="error">
                          Contract is either not registered on Onyx or has not been
                          verified, did you mean to{" "}
                          <Link to="/add-collection">add it here?</Link>
                        </p>
                      </div>
                    )}
                    <LoadingButton
                      className="mt-4"
                      type="submit"
                      loading={loadingNft || formLoading}
                      disabled={!valid || submitting || loadingNft}
                    >
                      List it!
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
}))(reduxForm({ form: formName, enableReinitialize: true, validate })(ListItem));
