import { Modal } from "react-bootstrap";
import { listingToken, getNFTImageURL, mystToSui } from "../../../utils/formats";
import LoadingButton from "../../../components/button/LoadingButton";

const WinModal = ({ item, onHide, handleSubmit, buyLoading }) => {
  if (!item) {
    return false;
  }

  return (
    <Modal show={item} onHide={onHide}>
      <Modal.Header closeButton></Modal.Header>

      <div className="modal-body space-y-20 pd-40">
        <h3>Claim this listing?</h3>
        <h5 className="text-center">{item.nft.name}</h5>
        <img src={item.nft?.image ?? getNFTImageURL(item.nft_collection, item.nft._id)} />
        <div className={"field-container"}>
          <input
            name="price"
            type="text"
            disabled
            value={`${mystToSui(item.sale_price)} ${listingToken(item)}`}
          />
        </div>
        <LoadingButton
          loading={buyLoading}
          disabled={buyLoading}
          onClick={() => handleSubmit(item)}
        >
          Claim listing
        </LoadingButton>
      </div>
    </Modal>
  );
};

export default WinModal;
