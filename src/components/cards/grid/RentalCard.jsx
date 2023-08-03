import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { mystToSui, renderDuration } from "../../../utils/formats.js";
import Countdown from "react-countdown";
import WishlistButton from "../../button/WishlistButton";
import Avatar from "../../layouts/Avatar";
import LazyLoadImage from "../../../components/layouts/LazyLoadImage";
import CreatedBy from "../../../components/utils/CreatedBy";
import dayjs from "dayjs";
import styled from "styled-components";

const InfoLabel = styled.span`
  color: var(--primary-color9);
  font-size: 15px;
  line-height: 18px;
  text-transform: capitalize;
  font-weight: 700;
`;

const InfoValue = styled.span`
  font-size: 18px;
  line-height: 18px;
  font-weight: 700;
`;

const RentalInfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const RentalInfo = ({ label, value }) => (
  <RentalInfoContainer>
    <InfoLabel>{label}</InfoLabel>
    <InfoValue>{value}</InfoValue>
  </RentalInfoContainer>
);

const RentalCard = ({ item, setModalShow, alwaysShowButton }) => {
  const [finished, setFinished] = useState(false);
  const [started, setStarted] = useState(false);
  const [rented, setRented] = useState(false);
  const { _id, creator, nft, tags, collection } = item;

  useEffect(() => {
    const now = Date.now();
    const start = new Date(item.start_date);
    // const end = new Date(item.end_date);
    setStarted(now > start);
    if (item.loan_expiration) {
      const rentedOut = new Date(item.loan_expiration);
      if (rentedOut > now) {
        setRented(rentedOut);
      }
    }
  }, []);

  const finishRenderer = ({ formatted, completed }) => {
    const { days, hours, minutes, seconds } = formatted;
    if (completed) {
      if (!finished) {
        setFinished(true);
      }
      return <div>Renting Finished</div>;
    }
    return <div>Ends in: {`${days}:${hours}:${minutes}:${seconds}`}</div>;
  };

  const startRenderer = ({ formatted, completed }) => {
    const { days, hours, minutes, seconds } = formatted;
    if (completed) {
      return <Countdown date={item.end_date} renderer={finishRenderer} />;
    }
    return <div>Starts in: {`${days}:${hours}:${minutes}:${seconds}`}</div>;
  };

  return (
    <div className="sc-card-product rental-card">
      <div className={`card-media${alwaysShowButton ? ` active` : ``}`}>
        <Link to={`/rental-details/${_id}`}>
          <LazyLoadImage src={nft.image} className="image-skeleton" />
        </Link>

        <WishlistButton nft={nft} />
        <div className="featured-countdown">
          <Countdown className="start" date={item.start_date} renderer={startRenderer} />
        </div>
        {setModalShow && (
          <div className="button-place-bid">
            <button
              onClick={() => setModalShow(item)}
              disabled={finished || !started || rented}
              data-toggle="modal"
              data-target="#popup_bid"
              className="sc-button style-place-bid style bag fl-button pri-3 fullWidth"
            >
              <span>Rent</span>
            </button>
          </div>
        )}
      </div>
      <div className="card-title">
        <div className="flex flex-column fullWidth">
          <Link to={`/rental-details/${_id}`}>
            <h3>{nft?.name}</h3>
          </Link>
          <Link to={`/collection-details/${collection?._id}`}>
            <h5>{collection?.name}</h5>
          </Link>
        </div>
        <div className="tags">{tags ?? "SUI"}</div>
      </div>
      <div className="rental-info">
        <RentalInfo
          label="Rent Expires"
          value={rented ? dayjs(rented).format("MMM D hh:mmA") : "Not Rented"}
        />
        <RentalInfo
          label="Min Rent Duration"
          value={renderDuration(item.duration?.min)}
        />
        <RentalInfo
          label="Max Rent Duration"
          value={renderDuration(item.duration?.max)}
        />
        <RentalInfo
          label="Rental Ends"
          value={dayjs(item.end_date).format("MMM D h:mma")}
        />
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
          <span>Price Per Day</span>
          <h3>{mystToSui(item.ask_per_day)} SUI</h3>
        </div>
      </div>
    </div>
  );
};

export default RentalCard;
