import React, { useState } from "react";
import { Link } from "react-router-dom";
import { listingDisplayPrice, listingPriceName } from "../../../utils/formats.js";
import Countdown from "react-countdown";
import { useSelector } from "react-redux";
import WishlistButton from "../../../components/button/WishlistButton";
import Avatar from "../Avatar";

const ListItemCard = ({ item, checkWon, setModalShow }) => {
  const [finished, setFinished] = useState(false);
  const user = useSelector((state) => state.user);
  const { creator, nft, _id, bid, auction } = item;
  const isCurrentBidder = bid && auction && user?._id == auction.bidder;
  const won = checkWon && finished && isCurrentBidder;
  const priceClass =
    auction && checkWon ? (isCurrentBidder ? "winning-bid" : "losing-bid") : "";

  const finishRenderer = ({ formatted, completed }) => {
    const { days, hours, minutes, seconds } = formatted;
    if (completed) {
      if (!finished) {
        setFinished(true);
      }
      return "Auction Finished";
    }
    return <div>{`${days}:${hours}:${minutes}:${seconds}`}</div>;
  };

  const startRenderer = ({ formatted, completed }) => {
    const { days, hours, minutes, seconds } = formatted;
    if (completed) {
      return <Countdown date={auction?.end_date} renderer={finishRenderer} />;
    }
    return <div>Auction Starts in: {`${days}:${hours}:${minutes}:${seconds}`}</div>;
  };

  return (
    <div className="col-item">
      <div className="sc-card-product menu_card style-h7">
        <div className="wrap-media">
          <div className="card-media">
            <Link to={`/item-details/${_id}`}>
              <img src={nft?.image} />
            </Link>
          </div>
        </div>
        <div className="card-title">
          <p>Item Name</p>
          <h4>
            <Link to={`/item-details/${_id}`}>{nft?.name}</Link>
          </h4>
        </div>
        <div className="meta-info style">
          <p>Creator</p>
          <div className="author">
            <div className="avatar">
              <Avatar creator={creator} size={50} />
            </div>
            <div className="info">
              <h4>
                {" "}
                <Link to={`/creators/${creator._id}`}>{creator?.display_name}</Link>{" "}
              </h4>
            </div>
          </div>
        </div>
        {item.sale_type === "auction" && (
          <div className="countdown">
            <p>Countdown</p>
            <div className="featured-countdown">
              <Countdown
                className="start"
                date={auction.start_date}
                renderer={startRenderer}
              />
            </div>
          </div>
        )}
        <div className="wishlist">
          <p>Wishlist</p>
          <WishlistButton nft={nft} />
        </div>

        <div className="wrap-tag">
          <p>Tag</p>
          <div className="tags">{item.tags ?? "SUI"}</div>
        </div>
        <div className="meta-info">
          <div className="info price">
            <p>{listingPriceName(item)}</p>
            <p className={`pricing ${priceClass}`}>{listingDisplayPrice(item)} SUI</p>
          </div>
        </div>
        <div className="button-place-bid">
          <button
            onClick={() => setModalShow(item)}
            disabled={auction && finished && !won}
            data-toggle="modal"
            data-target="#popup_bid"
            className="sc-button style-place-bid style bag fl-button pri-3 fullWidth"
          >
            <span>{item.sale_type !== "auction" ? "Buy" : "Bid"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListItemCard;
