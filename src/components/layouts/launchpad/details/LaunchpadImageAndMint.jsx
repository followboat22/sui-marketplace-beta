import React from "react";
import LazyLoadImage from "../../../../components/layouts/LazyLoadImage";
import { getCollectionImageURL } from "../../../../utils/formats";
import LaunchpadCountdown from "./FeaturedLaunchpadCountdown";

const LaunchpadImageAndMint = ({
  launchpad,
  inventories,
  saleIndex,
  handleBuyNFT,
  buyLoading,
}) => {
  const collectionID = launchpad?.launchpad_collection?._id;

  return (
    <div className="flex flex-column launchpad-details launchpad-image-mint">
      <div className="launchpad-details-img-wrapper">
        <LazyLoadImage
          src={getCollectionImageURL(collectionID, "featured")}
          key={`featured-${collectionID}-blur`}
          className="launchpad-img-blur"
          height="675px"
        />
        <LazyLoadImage
          src={getCollectionImageURL(collectionID, "featured")}
          key={`featured-${collectionID}`}
          className="launchpad-img-main"
          height="675px"
        />
      </div>
      {launchpad && (
        <LaunchpadCountdown
          buyLoading={buyLoading}
          handleBuyNFT={handleBuyNFT}
          launchpad={launchpad}
          inventories={inventories}
          saleIndex={saleIndex}
        />
      )}
    </div>
  );
};

export default LaunchpadImageAndMint;
