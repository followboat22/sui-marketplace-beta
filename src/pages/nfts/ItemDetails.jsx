import React, { useState, useEffect, useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import Countdown from "react-countdown";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import PageHeader from "../../components/layouts/PageHeader";
import LiveAuction from "../../components/layouts/LiveAuction";
import LoadingSpinner from "../../components/utils/LoadingSpinner";
import BuyModal from "../../components/layouts/modal/BuyModal";
import WinModal from "../../components/layouts/modal/WinModal";
import WishlistButton from "../../components/button/WishlistButton";
import Avatar from "../../components/layouts/Avatar";
import RequireAmountButton from "../../components/button/RequireAmountButton";
import { useTitle } from "../../components/utils/TitleProvider";
import LoadingButton from "../../components/button/LoadingButton";
import BidModal from "../../components/layouts/modal/BidModal";
import CreatedBy from "../../components/utils/CreatedBy";
import TimeTracker from "../../components/NotificationCenter/TimeTracker";
import {
  listingToken,
  listingDisplayPrice,
  mystToSui,
  shortenString,
} from "../../utils/formats";
import { SuiExplorer } from "../../utils/environments";
import { getListing, updateListing } from "../../utils/api";
import { winNFTAuction, getObjectInfo } from "../../web3/sui";
import { WIN_LISTING } from "../../redux/types";
import Accordion from "../../components/layouts/Accordion";

const RefreshTimerText = styled.span`
  color: var(--primary-color9);
  font-weight: 600;
  font-size: 16px;
  line-height: 26px;
`;

const PrimaryInfoContainer = styled.div`
  padding: 1.5rem 2rem;
  border-radius: 8px;
  border: 2px solid #353840;
  background: transparent !important;
  text-align: start;
  margin-bottom: 1rem;
`;

const SmallButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  white-space: nowrap;
`;
const Views = styled.span`
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  color: var(--primary-color2);
  background-color: transparent;
`;

const AttributesWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;

  @media screen and (min-width: 992px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

const AttributeContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: 2px solid #353840;
  border-radius: 1rem;
  padding: 1rem 1.5rem;
  align-items: center;
  width: auto;
  height: 100%;
  gap: 1rem;
  word-break: break-word;
`;

const AttributeName = styled.div`
  font-size: 14px;
  font-weight: 600;
  text-transform: Capitalize;
  color: var(--primary-color9);
`;

const AttributeValue = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: var(--primary-color2);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const PriceWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 40%;
  gap: 1rem;
`;

const AuctionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 40%;
  gap: 1rem;
`;

const InfoHeading = styled.div`
  font-weight: 600;
  font-size: 15px;
  line-height: 26px;
  color: var(--primary-color4);
`;

const ContentRightWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const RefreshWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const NameWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1rem;
  gap: 1rem;

  @media screen and (max-width: 575px) {
    flex-direction: column;
  }
`;

const ItemName = styled.h1`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media screen and (max-width: 575px) {
    font-size: 36px;
  }
`;

const Description = styled.div`
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 2.5rem;
`;

const DetailsFlex = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
`;

const DetailsName = styled.div`
  font-size: 14px;
  font-weight: 600;
  text-transform: capitalize;
`;

const DetailsValue = styled.div`
  font-size: 14px;
  color: var(--primary-color9);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const InnerDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const RefreshButton = ({ loading, refreshHandler }) => {
  return (
    <LoadingButton
      loading={loading}
      className="refresh-button small-refresh"
      onClick={refreshHandler}
    >
      <i className="fas fa-redo-alt" />
    </LoadingButton>
  );
};

const ItemDetails = () => {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const { setTitle } = useTitle();
  if (!params.id) navigate("/explore");
  const user = useSelector((state) => state.user);

  const [listing, setListing] = useState(false);
  const [buyLoading, setBuyLoading] = useState(false);
  const [listingLoading, setListingLoading] = useState(false);
  const [refreshTimer, setRefreshTimer] = useState(1);
  const [auctionStatus, setAuctionStatus] = useState(0);
  const [buyModal, showBuyModal] = useState(false);
  const [winModal, showWinModal] = useState(false);
  const nft = listing.nft || {};
  const history = listing.history || [];
  const favorited = useMemo(() => user.favorite_nfts?.includes(nft?._id), [user, nft]);

  const isAuction = listing?.sale_type === "auction";

  let buyText = useMemo(() => {
    if (listing.sale_type === "auction") {
      const now = Date.now();
      const end = new Date(listing.auction.end_date);
      return user._id === listing.auction?.bidder && now > end ? "Claim" : "Bid";
    } else {
      return "Buy";
    }
  }, [listing?.auction?.end_date, user?._id]);

  // If is loading, bought, or is auction that has ended, but the user can't claim it...
  let buttonDisabled =
    buyLoading ||
    !listing.active ||
    (listing.sale_type === "auction" && (listing.result || auctionStatus === 0));

  const updateAuction = (status) => {
    if (status > auctionStatus) {
      setAuctionStatus(status);
    }
  };

  const beforeSetListing = (listing) => {
    if (listing.auction) {
      const now = Date.now();
      const start = new Date(listing.auction.start_date);
      const end = new Date(listing.auction.end_date);
      if (now > start) {
        updateAuction(now > end ? 2 : 1);
      }
    }
    setListing(listing);
  };

  const resetTimer = () => {
    setRefreshTimer(Date.now() + 9000);
    setListingLoading(false);
  };

  const fetchListing = () => {
    if (listingLoading === true) return null;
    setListingLoading(true);
    getListing(params.id)
      .then(({ data }) => {
        setTitle(data.nft.name + " - NFT");
        getObjectInfo(data.listing_object_id).then((res) => {
          // check if listing exists on blockchain, then if it doesn't, request listing update.
          if (res) {
            // update auction price, if it's changed.
            if (data.sale_price > res.data.bid) {
              updateListing(data._id);
            }
            beforeSetListing(data);
          } else if (data.active) {
            beforeSetListing({ ...data, ...{ active: false } });
            updateListing(data._id);
          } else {
            data.active = false;
            beforeSetListing(data);
          }
        });
        setTimeout(() => resetTimer(), 500);
      })
      .catch(() => {
        navigate("/explore");
      });
  };

  // hacky fix for the favorites button not incrementing immediately.
  const favouriteHandler = () => {
    if (favorited) {
      nft.favorites = nft.favorites - 1;
    } else {
      nft.favorites = nft.favorites + 1;
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchListing();
    }
  }, [params.id]);

  const CurrentPrice = () => {
    return (
      <PriceWrapper>
        <InfoHeading>
          Current {listing.sale_type === "auction" ? "Bid" : "Price"}
        </InfoHeading>
        {!listing.active ? (
          <h2>{listing ? "Sold!" : "???"}</h2>
        ) : (
          <h2>{listingDisplayPrice(listing)} SUI</h2>
        )}
        {listing.sale_type === "auction" &&
          listing.sale_price < listing.auction.min_bid && (
            <InfoHeading>
              Minimum Bid: {mystToSui(listing.auction.min_bid)} SUI
            </InfoHeading>
          )}
      </PriceWrapper>
    );
  };

  const AuctionTimer = () => {
    return (
      <AuctionWrapper>
        {auctionStatus === 0 && (
          <>
            <InfoHeading>Auction Starts in</InfoHeading>
            <h2>
              <Countdown
                onComplete={() => updateAuction(1)}
                date={listing.auction.start_date}
              />
            </h2>
          </>
        )}

        {auctionStatus === 1 && (
          <>
            <InfoHeading>Auction Ends In:</InfoHeading>
            <h2>
              <Countdown
                date={listing.auction.end_date}
                onComplete={() => updateAuction(2)}
              />
            </h2>
          </>
        )}

        {auctionStatus === 2 && <InfoHeading>Auction Has Finished</InfoHeading>}
      </AuctionWrapper>
    );
  };

  const AutoRefreshTimer = () => {
    const renderer = ({ seconds, completed }) => {
      if (listingLoading) return <RefreshTimerText>...</RefreshTimerText>;
      if (completed) {
        fetchListing();
        return <RefreshTimerText>...</RefreshTimerText>;
      } else {
        return <RefreshTimerText>{seconds}s</RefreshTimerText>;
      }
    };

    return <Countdown date={refreshTimer} renderer={renderer} />;
  };

  const handleSubmit = async () => {
    setBuyLoading(true);
    if (listing.sale_type !== "auction") {
      showBuyModal(true);
    } else {
      if (auctionStatus == 2) {
        if (!winModal) {
          showWinModal(listing);
        } else {
          const res = await winNFTAuction(listing);
          if (res?.status === "success") {
            await updateListing(listing._id);
            dispatch({ type: WIN_LISTING, _id: listing._id });
            fetchListing();
            showWinModal(false);
          }
        }
      } else {
        showBuyModal(true);
      }
    }
    setBuyLoading(false);
  };

  const onBuy = async () => {
    showBuyModal(false);
  };

  const onBid = (item) => {
    updateListing(item._id);
  };

  return (
    <div className="item-details">
      <Header />
      <PageHeader />
      <div className="tf-section tf-item-details">
        <div className="themesflat-container">
          <div className="row">
            <div className="col-lg-6 col-md-12">
              <div className="content-left">
                <div className="media">
                  {listing ? (
                    <img src={listing.nft.image} />
                  ) : (
                    <LoadingSpinner size="xxlarge" absolute />
                  )}
                </div>
                {nft?.fields && (
                  <div>
                    <Accordion title="Attributes" defaultOpen>
                      <AttributesWrapper>
                        {Object.keys(nft.fields).map((name) => (
                          <AttributeContainer key={name}>
                            <AttributeName>{name}</AttributeName>
                            <AttributeValue>{nft.fields[name].toString()}</AttributeValue>
                          </AttributeContainer>
                        ))}
                      </AttributesWrapper>
                    </Accordion>
                  </div>
                )}
              </div>
            </div>
            <div className="col-lg-6 col-md-12">
              <div className="content-right">
                <ContentRightWrapper>
                  <div className="flex-space-between">
                    <Link to={`/collection-details/${listing?.nft_collection?._id}`}>
                      <h4>{listing?.nft_collection?.name || "Collection"}</h4>
                    </Link>
                    <a
                      className="heading"
                      href={`${SuiExplorer}/objects/${listing.listing_object_id}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <h5 className="tf-text fill">View on SuiExplorer</h5>
                    </a>
                  </div>
                  <NameWrapper>
                    <ItemName>{nft?.name || "NFT Name"}</ItemName>
                    <SmallButtonsWrapper>
                      <div className="meta-item">
                        <Views>
                          <span className="far fa-eye" />
                          <span>{nft?.views ?? "0"}</span>
                        </Views>
                      </div>
                      <WishlistButton nft={nft} onClick={() => favouriteHandler()} />
                    </SmallButtonsWrapper>
                  </NameWrapper>
                  <div className="client-info sc-card-product">
                    <span style={{ fontSize: "14px", fontWeight: 600 }}>
                      <span style={{ color: "var(--primary-color9)" }}>Owned By</span>{" "}
                      <CreatedBy creator={listing?.seller} />
                    </span>
                    <span style={{ fontSize: "14px", fontWeight: 600 }}>
                      <span style={{ color: "var(--primary-color9)" }}>Created By</span>{" "}
                      <CreatedBy creator={listing?.creator} />
                    </span>
                  </div>
                  <PrimaryInfoContainer>
                    <div className="meta-item-details">
                      <CurrentPrice />
                      {listing.sale_type === "auction" && <AuctionTimer />}
                      <div className="meta-item">
                        <RefreshWrapper>
                          <AutoRefreshTimer />
                          <RefreshButton
                            loading={listingLoading}
                            refreshHandler={() => fetchListing()}
                          />
                        </RefreshWrapper>
                      </div>
                    </div>
                    <RequireAmountButton
                      amount={listing.sale_price}
                      disabled={buttonDisabled}
                      className="fullWidth"
                      text={buyText}
                    >
                      <LoadingButton
                        onClick={() => handleSubmit()}
                        disabled={buttonDisabled}
                        loading={buyLoading}
                        className="fullWidth"
                      >
                        {buyText}
                      </LoadingButton>
                    </RequireAmountButton>
                  </PrimaryInfoContainer>
                  <div className="flat-tabs themesflat-tabs">
                    {nft?.description && (
                      <Accordion title="Details" defaultOpen>
                        <InnerDetails>
                          <Description>{nft.description}</Description>
                        </InnerDetails>
                      </Accordion>
                    )}
                    {listing.sale_type === "auction" && (
                      <Accordion title="Bid History">
                        <ul className="bid-history-list">
                          {listing.auction.bids
                            ?.filter((a) => a.listing === listing._id)
                            .sort((a, b) => b.bid - a.bid)
                            .map(({ bidder, bid, _id, updatedAt }) => (
                              <li key={_id}>
                                <div className="content">
                                  <div className="client">
                                    <div className="sc-author-box style-2">
                                      <div className="author-avatar">
                                        <Avatar creator={bidder} size={50} />
                                        <div className="badge"></div>
                                      </div>
                                      <div className="author-info">
                                        <div className="name">
                                          <CreatedBy creator={bidder} />
                                          <span>placed a bid</span>
                                        </div>
                                        <span className="time">
                                          <TimeTracker createdAt={updatedAt} />
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="price">
                                    <h5>{mystToSui(bid)}</h5>
                                    <span>
                                      = ${Math.round(mystToSui(bid) * 10000) / 100}
                                    </span>
                                  </div>
                                </div>
                              </li>
                            ))}
                        </ul>
                      </Accordion>
                    )}
                    <Accordion title="Sale History">
                      <ul className="bid-history-list">
                        {history.reverse().map((sale) => (
                          <li key={sale._id}>
                            <div className="content">
                              <div className="client">
                                <div className="sc-author-box style-2">
                                  <div className="author-avatar">
                                    <Avatar creator={sale.seller} size={50} />
                                    <div className="badge"></div>
                                  </div>
                                  <div className="author-info">
                                    <div className="name">
                                      <CreatedBy creator={sale.seller} />
                                      <span>
                                        sold it for {sale.sale_price} {listingToken(sale)}
                                      </span>
                                    </div>
                                    <span className="time">
                                      {new Date(sale.updatedAt).toLocaleString("en-US")}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </Accordion>
                    {listing?.nft_collection && (
                      <Accordion title="Market Info">
                        <InnerDetails>
                          <DetailsFlex key="object_id">
                            <DetailsName>NFT Object ID</DetailsName>
                            <DetailsValue>{nft.object_id}</DetailsValue>
                          </DetailsFlex>
                          <DetailsFlex key="collection_id">
                            <DetailsName>Collection Object ID</DetailsName>
                            <DetailsValue>
                              {listing?.nft_collection?.object_id}
                            </DetailsValue>
                          </DetailsFlex>
                          <DetailsFlex key="seller_fees">
                            <DetailsName>Seller Fees</DetailsName>
                            <DetailsValue>2.5%</DetailsValue>
                          </DetailsFlex>
                          {/* <DetailsFlex key="royalties">
                            <DetailsName>Royalties</DetailsName>
                            <DetailsValue>2.5%</DetailsValue>
                          </DetailsFlex> */}
                        </InnerDetails>
                      </Accordion>
                    )}
                  </div>
                </ContentRightWrapper>
              </div>
            </div>
          </div>
        </div>
      </div>
      <LiveAuction />
      <Footer />
      <BuyModal
        item={!isAuction && buyModal ? listing : false}
        beforeSetListing={beforeSetListing}
        onBuy={onBuy}
        onHide={() => showBuyModal(false)}
      />
      <BidModal
        item={isAuction && buyModal ? listing : false}
        beforeSetListing={beforeSetListing}
        onBid={onBid}
        onHide={() => showBuyModal(false)}
      />
      <WinModal
        handleSubmit={handleSubmit}
        item={winModal}
        onHide={() => showWinModal(false)}
      />
    </div>
  );
};

export default ItemDetails;
