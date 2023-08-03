import { Modal } from "react-bootstrap";
import LoadingButton from "../../../components/button/LoadingButton";

const SellModal = ({ item, onHide, handleSubmit, buyLoading }) => {
  if (!item) {
    return false;
  }

  return (
    <Modal show={item} onHide={onHide}>
      <Modal.Header closeButton></Modal.Header>

      <div className="modal-body space-y-20 pd-40">
        <h3>Sell this NFT?</h3>
        <h5 className="text-center">{item.name}</h5>
        <img src={item.imageUri} />
        <div className={"field-container"}>
          <input name="price" type="text" />
        </div>
        <LoadingButton
          loading={buyLoading}
          disabled={buyLoading}
          onClick={() => handleSubmit(item)}
        >
          Create Listing
        </LoadingButton>
      </div>
    </Modal>
  );
};

export default SellModal;
