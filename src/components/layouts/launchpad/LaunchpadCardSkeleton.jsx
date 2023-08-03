import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const LaunchpadCardSkeleton = () => {
  return (
    <div className="sc-card-collection collection-card">
      <Skeleton height="200px" />
      <div className="card-bottom" style={{ height: "225px", margin: "1.5rem" }}>
        <div className="launchpad-card-details flex-column">
          <Skeleton height="30px" width="160px" />
          <div className="widget-social style-2 flex" style={{ gap: "1rem" }}>
            <Skeleton height="32px" width="32px" borderRadius="6px" />
            <Skeleton height="32px" width="32px" borderRadius="6px" />
            <Skeleton height="32px" width="32px" borderRadius="6px" />
          </div>
          <div className="flex" style={{ gap: "1rem" }}>
            <Skeleton height="40px" width="80px" />
            <Skeleton height="40px" width="80px" />
          </div>
          <Skeleton height="40px" width="200px" />
        </div>
      </div>
    </div>
  );
};

export default LaunchpadCardSkeleton;
