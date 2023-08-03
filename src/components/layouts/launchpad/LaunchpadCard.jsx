import React from "react";
import { Link } from "react-router-dom";
import { getCollectionImageURL } from "../../../utils/formats";
import LazyLoadImage from "../LazyLoadImage";
import EditButtons from "./details/EditButtons";
import LaunchpadCardCountdown from "./details/LaunchpadCardCountdown";

const SocialButtons = ({ socials }) => {
  const { twitter, discord, instagram } = socials;
  if (Object.values(socials).every((el) => el === undefined)) return null;

  return (
    <div className="widget-social style-2 justify-content-center">
      <ul className="flex" style={{ gap: "1rem" }}>
        {twitter && (
          <li>
            <a href={twitter} target="_blank">
              <i className="fab fa-twitter" />
            </a>
          </li>
        )}
        {discord && (
          <li>
            <a href={discord} target="_blank">
              <i className="fab fa-discord" />
            </a>
          </li>
        )}
        {instagram && (
          <li>
            <a href={instagram} target="_blank">
              <i className="fab fa-instagram" />
            </a>
          </li>
        )}
      </ul>
    </div>
  );
};

const InfoBox = ({ text, textBold }) => {
  return (
    <div className="flex launchpad-infobox">
      <span style={{ fontSize: "18px" }}>
        {text}: <b>{textBold}</b>
      </span>
    </div>
  );
};

const LaunchpadCard = ({ item, my }) => {
  const { _id, launchpad_collection, status, start_date: startDate } = item;
  const {
    _id: collection_id,
    name,
    nft_count: items,
    floor: price,
    twitter,
    discord,
    instagram,
  } = launchpad_collection;
  const socials = { twitter, discord, instagram };
  const to = `/mintpad/${_id}`;

  return (
    <div className="sc-card-collection collection-card">
      <Link to={to}>
        <LazyLoadImage
          height="200px"
          className="launchpad-img-featured"
          src={getCollectionImageURL(collection_id, "featured")}
          key={`featured-${_id}`}
        />
      </Link>
      <div className="card-bottom" style={{ height: "225px", margin: "1.5rem" }}>
        <div className="launchpad-card-details flex-column">
          <h3
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Link
              style={{
                fontSize: "30px",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
              to={to}
            >
              {name ?? "Unnamed Mintpad"}
            </Link>
          </h3>
          <SocialButtons socials={socials} />
          <div className="flex justify-content-center fullWidth" style={{ gap: "1rem" }}>
            <InfoBox text="Items" textBold={items || "~"} />
            <InfoBox text="Price" textBold={price ? `${price} SUI` : "~"} />
          </div>
          {my ? <EditButtons id={_id} /> : <LaunchpadCardCountdown launchpad={item} />}
        </div>
      </div>
    </div>
  );
};

export default LaunchpadCard;
