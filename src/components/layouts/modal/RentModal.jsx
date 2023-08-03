import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import { Field, reduxForm } from "redux-form";
import { borrowNFT, returnNFT, getObjectInfo } from "../../../web3/sui";
import { updateLoanListing } from "../../../utils/api";
import { renderFormV2 } from "../../../utils/form";
import { sleep } from "../../../utils/time";
import { mystToSui, renderDuration } from "../../../utils/formats";
import ToastPopup from "../../../components/utils/ToastPopup";
import RequireAmountButton from "../../../components/button/RequireAmountButton";
import LoadingButton from "../../../components/button/LoadingButton";
import styled from "styled-components";

const Total = styled.span`
  font-size: 22px;
  font-weight: 600;
`;

const TotalPrice = styled.span`
  font-size: 24px;
  font-weight: 700;
  color: var(--primary-color2);
`;

const formName = "buyModal";

const validate = (values) => {
  const errors = {};
  if (!values.hours) {
    errors.hours = "Required";
  }
  return errors;
};

const RentModal = ({ item, onHide, onBuy, beforeSetListing }) => {
  const form = useSelector((state) => state.form[formName]);
  const user = useSelector((state) => state.user);
  const [buyLoading, setBuyLoading] = useState(false);
  const [nftType, setNftType] = useState(false);

  useEffect(async () => {
    if (item && !buyLoading) {
      const itemExistsRes = await getObjectInfo(item.listing_object_id);
      if (!itemExistsRes) {
        ToastPopup("Listing no longer exists.", "error");
        if (beforeSetListing) {
          beforeSetListing({ ...item, ...{ active: false } });
        }
        updateLoanListing(item._id);
        setBuyLoading(false);
        onHide();
      } else {
        const nftInfo = await getObjectInfo(item.nft_object_id);
        setNftType(nftInfo.type);
      }
    }
  }, [item?._id]);

  const max = useMemo(() => {
    let ends = new Date(item.end_date);
    let now = new Date();
    let diff = Math.round(Math.abs(ends - now) / 3600000);
    return Math.min(diff, item?.duration?.max);
  }, [item]);

  if (!item) return null;

  const salePrice =
    parseFloat(item.ask_per_day * (parseInt(form?.values?.hours) || 0)) / 24;
  const curPrice = salePrice;
  const itemFees = 0.025;
  const feePrice = parseFloat(curPrice * itemFees);
  // const itemRoyalties = parseInt(salePrice * 0.1);
  const totalPrice = curPrice; // parseFloat(curPrice + feePrice);
  const buyText = "Rent";
  const disabled = buyLoading || !item.active;

  const handleOnClick = async () => {
    setBuyLoading(true);
    const itemExistsRes = await getObjectInfo(item.listing_object_id);
    // check if listing exists on blockchain, then if it doesn't, request listing update.
    if (itemExistsRes) {
      try {
        console.log(itemExistsRes);
        if (itemExistsRes.data.loan_id) {
          let returnRes = await returnNFT(item);
        }
        const res = await borrowNFT(item, nftType, form.values.hours, user.primary_safe);
        if (res?.status === "success") {
          await sleep();
          await updateLoanListing(item._id);
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
      updateLoanListing(item._id);
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
        <h2>Rent {item.nft?.name}</h2>
        <img src={item.nft.image} />
        <div className="hr"></div>
        <div className="d-flex justify-content-between">
          <p>Price per day</p>
          <p className="text-right price color-popup">
            {mystToSui(item.ask_per_day)} SUI
          </p>
        </div>
        <Field
          type="number"
          name="hours"
          className="hoursInput"
          placeholder={`Hours to rent for (${item?.duration?.min || 1}-${max})`}
          props={{ step: 1, max }}
          component={renderFormV2}
          parse={(val) => Math.min(val, max)}
          hidename
        />
        {/* <div className="d-flex justify-content-between">
          <p>Fees ({100 * itemFees}%):</p>
          <p className="text-right price color-popup"> {mystToSui(feePrice)} SUI </p>
        </div> */}
        <div className="d-flex justify-content-between">
          <p>Min Rent Duration</p>
          <p className="text-right price color-popup">
            {renderDuration(item.duration?.min)}
          </p>
        </div>
        <div className="d-flex justify-content-between">
          <p>Max Rent Duration</p>
          <p className="text-right price color-popup">{renderDuration(max)}</p>
        </div>
        <div className="d-flex justify-content-between">
          <p>Rent Deadline</p>
          <p className="text-right price color-popup">~</p>
        </div>
        <div className="d-flex justify-content-between dashed-line">
          <Total>Total:</Total>
          <TotalPrice>{mystToSui(totalPrice)} SUI</TotalPrice>
        </div>
        <RequireAmountButton
          amount={curPrice}
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

export default reduxForm({ form: formName, validate })(RentModal);
