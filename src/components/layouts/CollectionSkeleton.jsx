import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const CollectionSkeleton = () => {
  return (
    <div className="sc-card-collection collection-card">
      <Skeleton height="200px" />
      <Skeleton
        height="80px"
        width="80px"
        borderRadius="10px"
        containerClassName="collection-img-logo ps-abs-mdl"
      />

      <div className="card-bottom" style={{ height: "200px" }}>
        <div className="author collection-details">
          <div className="sc-author-box style-2">
            <div className="author-avatar">
              <Skeleton height="64px" width="64px" borderRadius="21px" />
            </div>
          </div>
          <div className="content">
            <p>
              <Skeleton height="100%" width="110px" />
              <Skeleton height="100%" width="110px" />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionSkeleton;
