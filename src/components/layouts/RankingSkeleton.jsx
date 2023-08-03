import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const RankingSkeleton = ({ rank }) => {
  return (
    <div className="center-margin flex top-collections-row">
      <div className="mr-2 flex flex-column collection-rank-container">
        <div className="collection-rank">{rank + 1}</div>
      </div>
      <div className="collection-logo-container">
        <Skeleton height="100%" circle />
      </div>
      <div className="flex flex-column text-container">
        {/* <div className="flex fullWidth">
          <div className="collection-text collection-name">
            {name ? <Link to={`/collection-details/${_id}`}>{name}</Link> : "~"}
          </div>
        </div>
        <div className="flex fullWidth">
          <div className="collection-text collection-creator">
            {creator?.display_name ? (
              <Link to={`/creators/${creator._id}`}>{creator.display_name}</Link>
            ) : (
              "~"
            )}
          </div>
        </div> */}
        <Skeleton containerClassName="fullWidth" />
        <Skeleton containerClassName="fullWidth" />
      </div>
      <div className="flex flex-column collection-volume-container">
        <div className="flex collection-volume">
          <Skeleton containerClassName="fullWidth" />
        </div>
      </div>
    </div>
  );
};

export default RankingSkeleton;
