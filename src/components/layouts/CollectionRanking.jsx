import CreatedBy from "../../components/utils/CreatedBy";
import React from "react";
import { Link } from "react-router-dom";
import { getCollectionImageURL, mystToSui, numberShortFormat } from "../../utils/formats";
import LazyLoadImage from "./LazyLoadImage";

const CollectionRanking = ({ item, rank }) => {
  const { _id, creator, name, volume, percent_change } = item;
  return (
    <div className="center-margin flex top-collections-row">
      <div className="mr-2 flex flex-column collection-rank-container">
        <div className="collection-rank">{rank + 1}</div>
      </div>
      <div className="collection-logo-container">
        <Link to={`/collection-details/${_id}`}>
          <LazyLoadImage
            src={getCollectionImageURL(_id, "logo", 120, 120)}
            className="collection-logo-round"
            circle
          />
        </Link>
      </div>
      <div className="flex flex-column text-container">
        <div className="flex fullWidth">
          <div className="collection-text collection-name">
            {name ? <Link to={`/collection-details/${_id}`}>{name}</Link> : "~"}
          </div>
        </div>
        <div className="flex fullWidth">
          <div className="collection-text collection-creator">
            {creator ? <CreatedBy creator={creator} /> : "~"}
          </div>
        </div>
      </div>
      <div className="flex flex-column collection-volume-container">
        <div className="flex collection-volume">
          {volume ? numberShortFormat(mystToSui(volume)) : 0} SUI
        </div>
        {percent_change !== undefined && percent_change !== 0 && (
          <div className="flex collection-volume">
            {percent_change < 0 ? (
              <span className="volume-percent-negative">{percent_change}%</span>
            ) : (
              <span className="volume-percent-positive">+{percent_change}%</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionRanking;
