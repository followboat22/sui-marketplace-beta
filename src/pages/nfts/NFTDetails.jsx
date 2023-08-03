import { useState } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import PageHeader from "../../components/layouts/PageHeader";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import liveAuctionData from "../../assets/images/arcade-panda.6d45b60f713a1bdfd905.png";
import LiveAuction from "../../components/layouts/LiveAuction";
import img1 from "../../assets/images/arcade-panda.6d45b60f713a1bdfd905.png";
import { useEffect } from "react";
import { getNFT } from "../../utils/api";
import { getObjectInfo } from "../../web3/sui";
import { shortenString } from "../../utils/formats";
import LoadingSpinner from "../../components/utils/LoadingSpinner";
import Avatar from "../../components/layouts/Avatar";
import WishlistButton from "../../components/button/WishlistButton";

const ItemDetails = () => {
  const navigate = useNavigate();
  const params = useParams();
  if (!params.id) navigate("/explore");

  const [nft, setNFT] = useState(false);

  const fetchListing = () => {
    getNFT(params.id)
      .then(({ data }) => {
        // TODO: check if nft exists on blockchain, then if it doesn't, request nft update.
        getObjectInfo(data.object_id).then((res) => {
          if (res) {
            // TODO: update auction price, if it's changed.
            setNFT(data);
          } else if (data.active) {
            setNFT({ ...data, ...{ active: false } });
          } else {
            setNFT(data);
          }
        });
      })
      .catch(() => {
        // navigate("/explore");
      });
  };

  useEffect(() => {
    fetchListing();
  }, []);

  const shortDescription = (cutoff, maxLength) => {
    if (nft.description) {
      return shortenString(nft.description, cutoff, maxLength);
    } else if (nft.nft_collection?.description) {
      return shortenString(nft.nft_collection?.description, cutoff, maxLength);
    } else {
      return "No description available";
    }
  };

  return (
    <div className="item-details">
      <Header />
      <PageHeader />
      <div className="tf-section tf-item-details">
        <div className="themesflat-container">
          <div className="row">
            <div className="col-xl-6 col-md-12">
              <div className="content-left">
                <div className="media">
                  {nft ? (
                    <img src={nft.image} />
                  ) : (
                    <LoadingSpinner size="xxlarge" absolute />
                  )}
                </div>
              </div>
            </div>
            <div className="col-xl-6 col-md-12">
              <div className="content-right">
                <div className="sc-item-details">
                  <Link to={`/collection-details/${nft?.nft_collection?._id}`}>
                    <h4>{nft?.nft_collection?.name || "Collection"}</h4>
                  </Link>
                  <br />
                  <h2 className="style2">“{nft?.name || "NFT Name"}”</h2>
                  <div>
                    <div className="left">
                      <div className="meta-item">
                        <span className="far fa-eye">225</span>
                      </div>
                      <WishlistButton nft={nft} />
                    </div>
                    <div className="right">
                      <Link to="#" className="share"></Link>
                      <Link to="#" className="option"></Link>
                    </div>
                  </div>
                  <div className="client-info sc-card-product">
                    <div className="meta-info">
                      <Link to={`/creators/${nft?.creator?._id}`}>
                        <div className="author">
                          <div className="avatar">
                            {nft ? (
                              <Avatar creator={nft.creator} size={50} />
                            ) : (
                              <LoadingSpinner size="small" absolute />
                            )}
                          </div>
                          <div className="info">
                            <span>Created By</span>
                            <h6>{nft?.creator?.display_name || "???"}</h6>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                  <p>{shortDescription(200, 220)}</p>
                  <div className="meta-item-details style2">
                    <div className={`item meta-price`}>
                      <div>
                        <div className="heading">Last Known Price</div>
                      </div>
                      <div className="price">
                        <div className="price-box">
                          {/**TODO: show last known price, show link to buy if there is a listing */}
                          <h5>0 SUI</h5>
                          <span>= $0</span>
                        </div>
                      </div>
                      {/* {nft.sale_type === "auction" && (
                      <div className="item count-down">
                        {auctionStatus === 0 && (
                          <>
                            <span className="heading style-2">Auction Starts in</span>
                            <Countdown
                              onComplete={() => updateAuction(1)}
                              date={nft.auction.start_date}
                            >
                              <></>
                            </Countdown>
                          </>
                        )}

                        {auctionStatus === 1 && (
                          <>
                            <span className="heading style-2">Auction Ends In:</span>
                            <Countdown
                              date={nft.auction.end_date}
                              onComplete={() => updateAuction(2)}
                            >
                              <></>
                            </Countdown>
                          </>
                        )}

                        {auctionStatus === 2 && (
                          <span className="heading style-2 center-margin">
                            Auction Has Finished
                          </span>
                        )}
                      </div>
                    )} */}
                    </div>
                    {/** TODO: make a sell button show up for the owner <button
                    onClick={() => handleSubmit()}
                    disabled={buyLoading || bought || !nft.active}
                    className="sc-button loadmore style bag fl-button pri-3"
                  >
                    {buyLoading ? (
                      <LoadingSpinner />
                    ) : nft.sale_type === "auction" ? (
                      "Bid"
                    ) : (
                      "Buy"
                    )}
                  </button> */}
                    <div className="flat-tabs themesflat-tabs">
                      <Tabs>
                        <TabList>
                          <Tab>Info</Tab>
                          <Tab>Provenance</Tab>
                        </TabList>
                        <TabPanel>
                          <ul className="bid-history-list">
                            <li>
                              <div className="content">
                                <div className="client">
                                  <div className="sc-author-box style-2">
                                    <div className="author-avatar">
                                      <Link to="#">
                                        <img src={img1} className="avatar" />
                                      </Link>
                                      <div className="badge"></div>
                                    </div>
                                    <div className="author-info">
                                      <div className="name">
                                        <h6>
                                          {" "}
                                          <Link to="/creator">Mason Woodward </Link>
                                        </h6>{" "}
                                        <span> placed a bid</span>
                                      </div>
                                      <span className="time">8 hours ago</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </TabPanel>
                        <TabPanel>
                          <div className="provenance">
                            <p>{shortDescription()}</p>
                          </div>
                        </TabPanel>
                      </Tabs>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <LiveAuction data={liveAuctionData} />
        <Footer />
      </div>
    </div>
  );
};

export default ItemDetails;
