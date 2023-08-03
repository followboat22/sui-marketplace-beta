import { Link, useSearchParams } from "react-router-dom";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import LoadingSpinner from "../../components/utils/LoadingSpinner";
import PageHeader from "../../components/layouts/PageHeader";
import { Field, reduxForm } from "redux-form";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { useSelector } from "react-redux";
import {
  asValidObjectID,
  getObjectInfo,
  isValidObjectId,
  makeNftListing,
  makeNftAuction,
  getObjectsByType,
} from "../../web3/sui";
import {
  createListing,
  searchCollections,
  getMyLaunchpads,
  getMyCollections,
} from "../../utils/api";
import { renderFormV2 } from "../../utils/form";
import AsyncCreatableSelect from "react-select/async-creatable";
import { useState } from "react";
import { getNftType, ipfsConvert, mystToSui, padHex } from "../../utils/formats";
import { useNavigate } from "react-router-dom";
import Avatar from "../../components/layouts/Avatar";
import { useEffect } from "react";
import { searchbarThemeStyles } from "../../components/layouts/AutocompleteSearchBar";
import { sleep } from "../../utils/time";
import LoadingButton from "../../components/button/LoadingButton";
import Tooltip from "../../components/utils/Tooltip";

//import { useMemo } from "react";

const formName = "list-nft";

const validate = (values /*, dispatch */) => {
  const errors = {};
  if (!isValidObjectId(values.object_id)) {
    errors.object_id = "Invalid Sui Object ID";
  }
  return errors;
};

const ListItem = (props) => {
  const [searchParams] = useSearchParams();
  const nftParam = searchParams.get("id");
  const navigate = useNavigate();
  const { handleSubmit, pristine, submitting } = props;
  const form = useSelector((state) => state.form[formName]);
  const values = form?.values || {};
  const [collections, setCollections] = useState([]);
  const [launchpads, setLaunchpads] = useState([]);
  const [nft, setnft] = useState(false);
  const [loadingUseNFTs, setLoadingUseNFTs] = useState(true);
  const [detectedNFTs, setdetectedNFTs] = useState([]);
  const [loadingNft, setLoadingNft] = useState(false);
  const [contract, setContract] = useState(false);
  const [notOwnerError, setNotOwnerError] = useState(false);
  const user = useSelector((state) => state.user);
  const settings = useSelector((state) => state.settings);
  const sui = useSelector((state) => state.sui);
  const [getTab, setTab] = useState(0);
  const collection = collections[values.collection];
  const launchpad = launchpads[values.launchpad];
  const collectionLaunchpads = launchpads.filter(
    (pad) => pad.collection?._id === collection?._id
  );

  const tiers = [1, 2, 3]; //placeholder

  useEffect(async () => {
    if (sui.account) {
      const userStuff = await getObjectsByType("nft::Nft");
      setdetectedNFTs(userStuff);
      setLoadingUseNFTs(false);
    }
  }, [sui.account]);

  useEffect(() => {
    if (nftParam && settings.nft_package_id) {
      fetchNFT(nftParam);
    }
  }, [nftParam, settings]);

  useEffect(() => {
    if (user._id) {
      fetchCollections();
      fetchLaunchpads();
    }
  }, [user]);

  const fetchCollections = async () => {
    const req = await getMyCollections();
    setCollections(req.data.results);
  };

  const fetchLaunchpads = async () => {
    const req = await getMyLaunchpads();
    setLaunchpads(req.data.results);
  };

  const fetchNFT = async (id) => {
    if (isValidObjectId(id)) {
      setLoadingNft(true);
      let info = await getObjectInfo(id);

      // if (info.type.includes(`${settings.nft_package_id.slice(8)}::nft::Nft`)) {
      //   const otherInfo = await getNFTInfo(id, settings.nft_package_id);
      //   if (otherInfo) {
      //     info.data.url = otherInfo.data.url;
      //     info.data.name = otherInfo.data.name;
      //   }
      // }

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

  const submit = async (values) => {
    let promise = false;
    switch (getTab) {
      default:
      case 0:
        promise = makeNftListing(nft, values.price);
        break;
      case 1:
        promise = makeNftAuction(nft, values);
        break;
    }
    let info = await promise;
    await sleep();
    if (info.effects.created) {
      const listingObject = info.effects.created.find(
        (item) => item.owner.ObjectOwner !== settings.market_address
      );
      const apiResponse = await createListing({
        listing_id: listingObject.reference.objectId,
      });
      if (apiResponse.data.success) {
        navigate(`/item-details/${apiResponse.data.listing._id}`);
      }
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
                  <h4 className="title-list-item">Select method</h4>
                  <form onSubmit={handleSubmit(submit)}>
                    <Tabs onSelect={setTab}>
                      <TabList>
                        <Tab>
                          <span className="icon-fl-tag"></span>Fixed Price
                        </Tab>
                        <Tab>
                          <span className="icon-fl-clock"></span>Time Auctions
                        </Tab>
                        <Tab>
                          <span className="icon-fl-clock"></span>Add To Mintpad
                        </Tab>
                      </TabList>
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
                          // openMenuOnFocus={!!form.values?.object_id}
                          // openMenuOnClick={!!form.values?.object_id}
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
                      <TabPanel>
                        <Field
                          type="number"
                          name="price"
                          placeholder="Enter price for one NFT (SUI)"
                          props={{
                            min: mystToSui(settings.min_bid_increment),
                            step: "any",
                          }}
                          required
                          component={renderFormV2}
                        />
                      </TabPanel>
                      <TabPanel>
                        <Field
                          type="number"
                          name="price"
                          title="Minimum bid"
                          placeholder="Enter minimum bid"
                          props={{
                            min: mystToSui(settings.min_bid_increment),
                            step: "any",
                          }}
                          required
                          component={renderFormV2}
                        />
                        <Field
                          type="number"
                          name="min_bid_increment"
                          title="Minimum bid Increment"
                          placeholder="Enter minimum bid"
                          props={{
                            step: "any",
                          }}
                          required
                          appendTitle={
                            <Tooltip>
                              <p>
                                e.g. if the current bid is 1 SUI and the bid increment is
                                0.1, the next bid must be &ge; 1.1 Sui. This is to avoid
                                someone bidding 1.0000000000000001 SUI
                              </p>
                              <a data-tip data-for="lockedTier">
                                <i className="fas fa-info-circle" />
                              </a>
                            </Tooltip>
                          }
                          component={renderFormV2}
                        />
                        <div className="row">
                          <div className="col-md-6">
                            <Field
                              type="datetime-local"
                              name="starts"
                              title="Starting date"
                              props={{ min: "2022-01-01 00:00" }}
                              required
                              component={renderFormV2}
                            />
                          </div>
                          <div className="col-md-6">
                            <Field
                              type="datetime-local"
                              name="expires"
                              title="Expiration date"
                              required
                              component={renderFormV2}
                            />
                          </div>
                        </div>
                      </TabPanel>
                      <TabPanel>
                        {!!collection && (
                          <Field
                            type="select"
                            name="launchpad"
                            title="Mintpad"
                            required={true}
                            disabled={collectionLaunchpads.length === 0}
                            component={renderFormV2}
                          >
                            <option key="placeholder" value="" hidden>
                              {collectionLaunchpads.length > 0
                                ? "Select a mintpad"
                                : "No mintpads available for collection"}
                            </option>
                            {collectionLaunchpads.map((col, index) => (
                              <option key={col._id} value={index}>
                                {col.collection.name}
                              </option>
                            ))}
                          </Field>
                        )}
                        {!!launchpad && (
                          <Field
                            type="select"
                            name="tier"
                            required={true}
                            component={renderFormV2}
                          >
                            <option key="placeholder" value="" hidden>
                              Select a tier
                            </option>
                            {tiers.map((tier) => (
                              <option key={tier} value={tier}>
                                {tier}
                              </option>
                            ))}
                          </Field>
                        )}
                      </TabPanel>
                    </Tabs>
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
                      loading={loadingNft}
                      disabled={pristine || submitting || loadingNft}
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

export default reduxForm({ form: formName, validate, enableReinitialize: true })(
  ListItem
);
