import Countdown, { zeroPad } from "react-countdown";
import MintButtons from "./MintButtons";
import { useNavigate } from "react-router-dom";

const LaunchpadCardCountdown = ({ launchpad, saleIndex, handleBuyNFT, buyLoading }) => {
  const collectionID = launchpad?.launchpad_collection?._id;
  const { active, start_date, sales } = launchpad;

  // const sale = sales?.[saleIndex] || {};
  // const { count, total } = sale;

  const navigate = useNavigate();

  const handleGoToDetails = () => {
    navigate(`/mintpad/${launchpad._id}`);
  };

  const handleGoToCollection = () => {
    navigate(`/collection-details/${collectionID}`);
  };

  // Renderer callback with condition
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return (
        <div className="flex justify-content-between mint-buttons-wrapper fullWidth">
          <button
            className="mint-button launchpad-card-button"
            onClick={handleGoToDetails}
          >
            <span>Details</span>
          </button>
          <button
            className="mint-button-secondary launchpad-card-button"
            onClick={handleGoToCollection}
          >
            <span>Go To Collection</span>
          </button>
        </div>
      );
    } else {
      // Render a countdown
      return (
        <div className="countdown" style={{ textAlign: "center" }}>
          <span style={{ fontSize: "14px", fontWeight: "700" }}>LAUNCHES IN</span>
          <div className="launchpad-countdown">
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

export default LaunchpadCardCountdown;
