import { useState } from "react";
import { useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import { reduxForm } from "redux-form";
import { buyNftListing } from "../../../web3/sui";
import { updateListing } from "../../../utils/api";
import { ipfsConvert, mystToSui, suiToMyst } from "../../../utils/formats";
import ToastPopup from "../../../components/utils/ToastPopup";
import RequireAmountButton from "../../../components/button/RequireAmountButton";
import { getObjectInfo } from "../../../web3/sui";
import { useEffect } from "react";
import { sleep } from "../../../utils/time";
import LoadingButton from "../../../components/button/LoadingButton";

const formName = "buyModal";

const BuyModal = ({ item, onHide, onBuy, setModalShow, beforeSetListing }) => {
  const form = useSelector((state) => state.form[formName]);
  const [buyLoading, setBuyLoading] = useState(false);

  useEffect(async () => {
    if (item && !buyLoading) {
      const itemExistsRes = await getObjectInfo(item.listing_object_id);
      if (itemExistsRes) {
        const currentPrice = parseInt(itemExistsRes.data.bid);
        if (currentPrice > item.sale_price) {
          await updateListing(item._id);
          beforeSetListing({ ...item, ...{ sale_price: currentPrice } });
          if (setModalShow) {
            setModalShow({ ...item, ...{ sale_price: currentPrice } });
          }
        }
      } else {
        ToastPopup("Item has already been purchased.", "error");
        if (beforeSetListing) {
          beforeSetListing({ ...item, ...{ active: false } });
        }
        updateListing(item._id);
        setBuyLoading(false);
        onHide();
      }
    }
  }, [item?._id]);

  if (!item) return null;

  const salePrice = parseFloat(item.sale_price);
  const curPrice = salePrice;
  const itemFees = 0.025;
  const feePrice = parseFloat(curPrice * itemFees);
  // const itemRoyalties = parseInt(salePrice * 0.1);
  const totalPrice = curPrice; // parseFloat(curPrice + feePrice);
  const buyText = "Buy";
  const disabled = buyLoading || !item.active;

  const handleOnClick = async () => {
    setBuyLoading(true);
    const itemExistsRes = await getObjectInfo(item.listing_object_id);
    // check if listing exists on blockchain, then if it doesn't, request listing update.
    if (itemExistsRes) {
      try {
        const tx = buyNftListing(item, item.sale_price);
        const res = await tx;
        await sleep();
        if (res?.status === "success") {
          await updateListing(item._id);
          ToastPopup("Item bought successfully!");
          if (onBuy) {
            onBuy(item);
            onHide();
          }
        } else {
          ToastPopup("Something went wrong; Transaction failed.", "error");
        }
        setBuyLoading(false);
      } catch (e) {
        console.log(e);
        ToastPopup("Something went wrong; Transaction failed.", "error");
        setBuyLoading(false);
      }
    } else if (item.active) {
      ToastPopup("Item has already been purchased.", "error");
      if (beforeSetListing) {
        beforeSetListing({ ...item, ...{ active: false } });
      }
      updateListing(item._id);
      setBuyLoading(false);
      onHide();
    } else {
      ToastPopup("Item has already been purchased.", "error");
      if (beforeSetListing) {
        beforeSetListing({ ...item, ...{ active: false } });
      }
      setBuyLoading(false);
      onHide();
      return;
    }
  };

  return (
    <Modal show={!!item} onHide={onHide}>
      <Modal.Header closeButton></Modal.Header>

      <div className="modal-body space-y-10 pd-40">
        <h3>Buy {item.nft?.name}</h3>
        <img src={ipfsConvert(item.nft.image)} />
        <div className="hr"></div>
        <div className="d-flex justify-content-between">
          <p>Current Price</p>
          <p className="text-right price color-popup">{mystToSui(curPrice)} SUI</p>
        </div>
        <div className="d-flex justify-content-between">
          <p> Fees ({100 * itemFees}%):</p>
          <p className="text-right price color-popup"> {mystToSui(feePrice)} SUI </p>
        </div>
        {/*
        <div className="d-flex justify-content-between">
          <p> Royalties (10%):</p>
          <p className="text-right price color-popup"> {itemRoyalties} SUI </p>
        </div>
        */}
        <div className="d-flex justify-content-between dashed-line">
          <p> Total:</p>
          <p className="text-right price color-popup">{mystToSui(totalPrice)} SUI</p>
        </div>
        <RequireAmountButton
          amount={Math.max(curPrice, suiToMyst(form?.values?.price || 0))}
          text={buyText}
          className="btn btn-primary"
          disabled={disabled}
        >
          <LoadingButton
            onClick={handleOnClick}
            disabled={disabled}
            loading={buyLoading}
            className="btn btn-primary"
            data-toggle="modal"
            data-target="#popup_bid_success"
            data-dismiss="modal"
            aria-label="Close"
          >
            {buyText}
          </LoadingButton>
        </RequireAmountButton>
      </div>
    </Modal>
  );
};

export default reduxForm({ form: formName })(BuyModal);
