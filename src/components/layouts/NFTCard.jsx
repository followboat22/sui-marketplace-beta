import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { listingDisplayPrice, listingPriceName } from "../../utils/formats";
import Countdown from "react-countdown";
import WishlistButton from "../button/WishlistButton";
import Avatar from "../layouts/Avatar";
import { useSelector } from "react-redux";
import LazyLoadImage from "./LazyLoadImage";
import CreatedBy from "../utils/CreatedBy";

const NFTCard = ({ buttonText, item, checkWon, setModalShow, alwaysShowButton }) => {
  const [finished, setFinished] = useState(false);
  const [started, setStarted] = useState(false);
  const { _id, creator, nft, auction, bid, sale_type, tags, collection } = item;
  const user = useSelector((state) => state.user);
  const isCurrentBidder = bid && auction && user?._id == auction.bidder;
  const won = checkWon && finished && isCurrentBidder;
  const priceClass =
    auction && checkWon ? (isCurrentBidder ? "winning-bid" : "losing-bid") : "";

  useEffect(() => {
    if (auction) {
      const now = Date.now();
      const start = new Date(auction.start_date);
      const end = new Date(auction.end_date);
      if (now > start) {
        setStarted(true);
      }
    }
  }, []);

  if (!buttonText) {
    buttonText = sale_type !== "auction" ? "Buy" : "Bid";
  }

  const finishRenderer = ({ formatted, completed }) => {
    const { days, hours, minutes, seconds } = formatted;
    if (completed) {
      if (!finished) {
        setFinished(true);
      }
      return "Auction Finished";
    }
    return <div>Ends in: {`${days}:${hours}:${minutes}:${seconds}`}</div>;
  };

  const startRenderer = ({ formatted, completed }) => {
    const { days, hours, minutes, seconds } = formatted;
    if (completed) {
      return <Countdown date={auction?.end_date} renderer={finishRenderer} />;
    }
    return <div>Starts in: {`${days}:${hours}:${minutes}:${seconds}`}</div>;
  };

  return (
    <div className="sc-card-product">
      <div className={`card-media${alwaysShowButton ? ` active` : ``}`}>
        <Link to={`/item-details/${_id}`}>
          <LazyLoadImage src={nft.image} className="image-skeleton" />
        </Link>

        <WishlistButton nft={nft} />
        {auction && (
          <div className="featured-countdown">
            <Countdown
              className="start"
              date={auction?.start_date}
              renderer={startRenderer}
            />
          </div>
        )}
        {setModalShow && (
          <div className="button-place-bid">
            <button
              onClick={() => setModalShow(item)}
              disabled={auction && ((finished && !won) || !started)}
              data-toggle="modal"
              data-target="#popup_bid"
              className="sc-button style-place-bid style bag fl-button pri-3 fullWidth"
            >
              <span>{buttonText}</span>
            </button>
          </div>
        )}
      </div>
      <div className="card-title">
        <div className="flex flex-column fullWidth">
          <Link to={`/item-details/${_id}`}>
            <h3>{nft?.name}</h3>
          </Link>
          <Link to={`/collection-details/${collection?._id}`}>
            <h5>{collection?.name}</h5>
          </Link>
        </div>
        <div className="tags">{tags ?? "SUI"}</div>
      </div>
      <div className="meta-info">
        <div className="author">
          <div className="avatar">
            <Avatar creator={creator} size={50} />
          </div>
          <div className="info">
            <span>Created by</span>
            <h6>
              <CreatedBy creator={creator} />
            </h6>
          </div>
        </div>
        <div className="price">
          <span>{listingPriceName(item)}</span>
          <h5 className={priceClass}>{listingDisplayPrice(item)} SUI</h5>
        </div>
      </div>
    </div>
  );
};

export default NFTCard;
