import { Modal } from "react-bootstrap";
import { listingToken, listingPrice, ipfsConvert } from "../../../utils/formats";
import Countdown from "react-countdown";
import LoadingButton from "../../button/LoadingButton";

const UnlistModal = ({ item, onHide, handleSubmit, buyLoading }) => {
  if (!item) {
    return false;
  }

  const finishRenderer = ({ formatted, completed }) => {
    const { days, hours, minutes, seconds } = formatted;
    if (completed) {
      return "Auction Finished";
    }
    return <p>Auction Ends in: {`${days}:${hours}:${minutes}:${seconds}`}</p>;
  };

  const startRenderer = ({ formatted, completed }) => {
    const { days, hours, minutes, seconds } = formatted;
    if (completed) {
      return <Countdown date={item?.auction?.end_date} renderer={finishRenderer} />;
    }
    return <p>Auction Starts in: {`${days}:${hours}:${minutes}:${seconds}`}</p>;
  };

  return (
    <Modal show={item} onHide={onHide}>
      <Modal.Header closeButton></Modal.Header>

      <div className="modal-body space-y-20 pd-40">
        <h3>Remove this listing?</h3>
        <h5 className="text-center">{item.nft.name}</h5>
        <img src={ipfsConvert(item.nft.image)} />
        <div className={"field-container"}>
          <input
            name="price"
            type="text"
            disabled
            value={`${listingPrice(item)} ${listingToken(item)}`}
          />
        </div>
        {item.sale_type === "auction" && (
          <div>
            <>
              <Countdown date={item.auction.start_date} renderer={startRenderer}>
                <></>
              </Countdown>
            </>
          </div>
        )}
        <LoadingButton
          loading={buyLoading}
          disabled={buyLoading}
          onClick={() => handleSubmit(item)}
        >
          Remove listing
        </LoadingButton>
      </div>
    </Modal>
  );
};

export default UnlistModal;
