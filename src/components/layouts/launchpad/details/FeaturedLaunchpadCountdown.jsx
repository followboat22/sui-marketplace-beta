import Countdown, { zeroPad } from "react-countdown";
import MintButtons from "./MintButtons";
import { useNavigate } from "react-router-dom";

const FeaturedLaunchpadCountdown = ({
  launchpad,
  saleIndex,
  handleBuyNFT,
  buyLoading,
  inventories,
}) => {
  const collectionID = launchpad?.launchpad_collection?._id;
  const { active, start_date } = launchpad;

  const sale = launchpad?.sales[saleIndex] || {};
  const { total } = sale;
  const count = inventories?.[saleIndex];

  // Renderer callback with condition
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return (
        <>
          <div className="fullWidth">
            <div className="flex justify-content-between mb-3">
              <p>Total Minted</p>
              <p>
                <b>0%</b> ({total - count || 0}/{total || 0})
              </p>
            </div>
            <div className="progress" style={{ height: "1.5rem" }}>
              <div
                className="progress-bar bg-info"
                role="progressbar"
                style={{
                  width: `${total - count || 0}%`,
                  height: "1.5rem",
                }}
              />
            </div>
          </div>
          <MintButtons
            handleBuyNFT={handleBuyNFT}
            buyLoading={buyLoading}
            launchpad={launchpad}
            sale={sale}
            tier={saleIndex}
            active={active}
            collectionID={collectionID}
          />
        </>
      );
    } else {
      // Render a countdown
      return (
        <div className="countdown" style={{ textAlign: "center" }}>
          <div className="launchpad-details-countdown">
            <span>
              {zeroPad(days)}d {zeroPad(hours)}h {zeroPad(minutes)}m {zeroPad(seconds)}s
            </span>
          </div>
        </div>
      );
    }
  };

  return <Countdown date={new Date(start_date).valueOf()} renderer={renderer} />;
};

export default FeaturedLaunchpadCountdown;
