import { useNavigate } from "react-router-dom";
import RequireAmountButton from "../../../../components/button/RequireAmountButton";
import { mystToSui } from "../../../../utils/formats";
import LoadingButton from "../../../../components/button/LoadingButton";

const MintButtons = ({ sale, active, collectionID, handleBuyNFT, buyLoading }) => {
  const navigate = useNavigate();
  const disabled = !active;

  const handleGoToCollection = () => {
    navigate(`/collection-details/${collectionID}`);
  };

  return (
    <div className="mint-buttons-container">
      <div className="flex justify-content-between mb-3">
        <p style={{ fontSize: "22px" }}>
          Price: <b>{mystToSui(sale?.price) || "~"} SUI</b>
        </p>
        <p style={{ fontSize: "22px" }}>
          Limit: <b>{sale?.limit > 1000 ? sale?.limit : "∞"}</b>
        </p>
      </div>
      <div className="flex justify-content-between mb-3 mint-buttons-wrapper">
        <RequireAmountButton
          amount={sale?.price}
          text="Buy"
          className="mint-button"
          disabled={disabled}
        >
          <LoadingButton
            onClick={handleBuyNFT}
            disabled={disabled}
            loading={buyLoading}
            className="mint-button"
            data-toggle="modal"
            data-target="#popup_bid_success"
            data-dismiss="modal"
            aria-label="Close"
          >
            Buy
          </LoadingButton>
        </RequireAmountButton>

        <button className="mint-button-secondary" onClick={handleGoToCollection}>
          <span>Go To Collection</span>
        </button>
      </div>
    </div>
  );
};

export default MintButtons;
