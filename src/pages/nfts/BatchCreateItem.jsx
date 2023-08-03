import { Link } from "react-router-dom";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import PageHeader from "../../components/layouts/PageHeader";
import { Field, reduxForm, change } from "redux-form";
import "react-tabs/style/react-tabs.css";
import { useDispatch, useSelector } from "react-redux";
import {
  getTxObjects,
  makeNftListing,
  makeNftAuction,
  mintNFT,
  getObjectInfo,
} from "../../web3/sui";
import { renderFormV2 } from "../../utils/form";
import {
  createListing,
  getMyCollections,
  getMyLaunchpads,
  createNFT,
  announceNFT,
  updateLaunchpadListings,
} from "../../utils/api";
import { useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { mystToSui, numberShortFormat } from "../../utils/formats";
import Avatar from "../../components/layouts/Avatar";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { sleep } from "../../utils/time";
import ToastPopup from "../../components/utils/ToastPopup";
import { tryAgain } from "../../utils/performance";
import ExampleNFT from "../../assets/fake-data/ExampleNFT";

const formName = "batch-create-nft";

const validate = (/* values , dispatch */) => {
  const errors = {};
  // if (!values.collection) {
  //   errors.collection = "Please select a collection";
  // }
  return errors;
};

const BatchCreateItem = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { handleSubmit, pristine, submitting } = props;
  const form = useSelector((state) => state.form[formName]);
  const user = useSelector((state) => state.user);
  const settings = useSelector((state) => state.settings);
  const values = form?.values || {};
  const registeredFields = form?.registeredFields || {};
  const [collections, setCollections] = useState([]);
  const [launchpads, setLaunchpads] = useState([]);
  const [mintType, setMintType] = useState(0);
  const collection = collections[values.collection];
  const launchpad = launchpads[values.launchpad];
  const [tab, setTab] = useState(0);
  const collectionLaunchpads = launchpads.filter(
    (pad) => pad.launchpad_collection?._id === collection?._id
  );

  const tiers = [0]; //placeholder

  useEffect(() => {
    const oldValues = Object.keys(values).filter(
      (key) => !Object.keys(registeredFields).includes(key)
    );
    oldValues.forEach((field) => {
      dispatch(change(formName, field, undefined));
    });
  }, [registeredFields]);

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

  const submit = async (values) => {
    values.count = values.count || 1;

    const createReponse = await createNFT({
      ...values,
      ...{ collection: collection._id },
    });

    const launchpad_info = mintType === 0 && tab === 3 ? launchpad : false;
    const info = await mintNFT({
      ...values,
      ...{
        launchpad: launchpad_info,
        nft_colection: createReponse.data.nft.nft_collection,
      },
    });
    await sleep();

    const [, createdObjects] = await tryAgain(() => getTxObjects(info), 5, 5000);
    const nft = createdObjects.find((i) => i.type?.includes("Nft"));

    await tryAgain(
      () =>
        announceNFT(
          nft.objectId,
          createReponse.data.nft._id,
          info.effects.transactionDigest
        ),
      2
    );
    const nftInfo = await getObjectInfo(nft.objectId);

    if (mintType === 0) {
      let listingInfo;
      switch (tab) {
        case 0:
          listingInfo = await makeNftListing(nftInfo, values.price);
          break;
        case 1:
          listingInfo = await makeNftAuction(nftInfo, values);
          break;
        default:
          // Launchpad mint, already done.
          updateLaunchpadListings(launchpad._id, values.tier || 0);
          ToastPopup("Mintpad successfully updated.", "success");
          break;
      }
      if (listingInfo?.effects?.created) {
        const listingObject = listingInfo.effects.created.find(
          (item) => item.owner.ObjectOwner !== settings.market_address
        );
        await sleep();
        const apiResponse = await tryAgain(
          () =>
            createListing({
              listing_id: listingObject.reference.objectId,
            }),
          2
        );
        if (apiResponse.data.success) {
          navigate(`/item-details/${apiResponse.data.listing._id}`);
        }
      }
    } else {
      ToastPopup("Nft(s) minted successfully", "success");
      navigate(`/profile/owned-nfts`);
    }
  };

  return (
    <div className="list-item">
      <Header />
      <PageHeader />
      <div className="tf-list-item tf-section">
        <div className="themesflat-container">
          <div className="row justify-content-center">
            <div className="col-12 mg-bt-18">
              <Link to="/create-nft">
                <button className="batch-mint-button">Regular Minting Tool</button>
              </Link>
            </div>
            <div className="col-xl-3 col-lg-6 col-md-9 col-12">
              <h4 className="title-list-item">Preview NFT</h4>
              {/* {loadingNft && (
                <div className="sc-card-product">
                  <div className="card-media">
                    <LoadingSpinner>
                  </div>
                </div>
              )} */}
              <div className="sc-card-product">
                <div className="card-media">
                  <Field
                    type="file"
                    name="image"
                    className="hideInput"
                    containername="h-100"
                    hidename="true"
                    labelClassName="h-100"
                    featuredImage={values?.image}
                    component={renderFormV2}
                  />
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
                    <Link to="/item-details">&quot;{values?.name || "???"}&quot;</Link>
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
                        <Link to="#">{user.display_name || "???"}</Link>
                      </h6>
                    </div>
                  </div>
                  <div className="price">
                    <span>Price</span>
                    <h5>
                      {form?.values?.price ? numberShortFormat(form?.values?.price) : 0}{" "}
                      SUI
                    </h5>
                  </div>
                </div>
                <div className="card-bottom">
                  {/* <Link to="#" className="sc-button style bag fl-button pri-3">
                      <span>Place Bid</span>
                    </Link>
                    <Link to="#" className="view-history reload">
                      View History
                    </Link> */}
                </div>
              </div>
              <h4>Example JSON:</h4>
              {/* mintType, tab*/}
              <pre style={{ display: "block" }}>{ExampleNFT}</pre>
            </div>
            <div className="col-xl-9 col-lg-12 col-md-12 col-12">
              <div className="form-list-item">
                <div className="flat-tabs tab-list-item">
                  <form onSubmit={handleSubmit(submit)}>
                    {/* <h4 className="title-list-item">Select method</h4> */}
                    <Tabs onSelect={setMintType}>
                      <TabList className="react-tabs__tab-list two-tabs">
                        <Tab>
                          <span className="icon-fl-tag"></span>Mint and List Immediately
                        </Tab>
                        <Tab>
                          <span className="icon-fl-send"></span>Mint Only
                        </Tab>
                      </TabList>
                      <TabPanel>
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
                          <Field
                            type="file"
                            name="json"
                            component={renderFormV2}
                            className="hideInput"
                            containername="h-100"
                            labelClassName="h-100"
                            hint="JSON file"
                            hidename="true"
                          />
                          <TabPanel>
                            <Field
                              type="number"
                              name="price"
                              placeholder="Enter price for one NFT (SUI)"
                              props={{
                                min: mystToSui(settings.min_bid_increment).toString(),
                                step: "any",
                              }}
                              subtitle="Leave blank to use json data"
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
                                min: mystToSui(settings.min_bid_increment).toString(),
                                step: "any",
                              }}
                              required
                              component={renderFormV2}
                            />
                            <div className="row">
                              <div className="col-md-6">
                                <Field
                                  type="datetime-local"
                                  name="starts"
                                  title="Starting date"
                                  required
                                  props={{ min: "2022-01-01 00:00" }}
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
                            <Field
                              type="number"
                              title="Number of NFTs to mint"
                              name="count"
                              component={renderFormV2}
                              placeholder={1}
                            />
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
                                    {col.launchpad_collection.name}
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

                        <button
                          className="mt-md-4"
                          type="submit"
                          disabled={pristine || submitting}
                        >
                          Mint and List!
                        </button>
                      </TabPanel>
                      <TabPanel>
                        <Field
                          type="number"
                          title="Number of NFTs to mint"
                          name="count"
                          component={renderFormV2}
                          placeholder={1}
                        />
                        <Field
                          type="text"
                          name="recipient"
                          component={renderFormV2}
                          placeholder={user.account_address}
                        />
                        <button
                          className="mt-md-4"
                          type="submit"
                          disabled={pristine || submitting}
                        >
                          Mint Only!
                        </button>
                      </TabPanel>
                    </Tabs>
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
  initialValues: { count: 1, tier: 0 },
  validate,
})(BatchCreateItem);
