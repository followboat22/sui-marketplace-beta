import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const NFTSkeleton = () => {
  return (
    <div className="sc-card-product">
      <div className="card-media">
        <Skeleton height="100%" containerClassName="image-skeleton" />
      </div>
      <div className="card-title">
        <Skeleton height="18px" width="95%" containerClassName="title-skeleton" />
        <div className="tags">
          <Skeleton containerClassName="tag-skeleton" />
        </div>
      </div>
      <div className="meta-info">
        <div className="author">
          <div className="avatar">
            <Skeleton height="100%" />
          </div>
        </div>
        <div className="text-container">
          <p>
            <Skeleton containerClassName="fullWidth" />
            <Skeleton containerClassName="fullWidth" />
          </p>
        </div>
      </div>
    </div>
  );
};

export default NFTSkeleton;
