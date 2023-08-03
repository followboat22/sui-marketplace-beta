import { useState } from "react";
import { useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import { Field, reduxForm } from "redux-form";
import { bidNFTAuction } from "../../../web3/sui";
import { updateListing } from "../../../utils/api";
import { renderFormV2, escapeRegExp } from "../../../utils/form";
import { mystToSui, suiToMyst, countDecimals } from "../../../utils/formats";
import ToastPopup from "../../utils/ToastPopup";
import RequireAmountButton from "../../button/RequireAmountButton";
import { getObjectInfo } from "../../../web3/sui";
import { useEffect } from "react";
import { sleep } from "../../../utils/time";
import LoadingButton from "../../button/LoadingButton";

const formName = "bidModal";

const BidModal = ({ item, onHide, onBid, setModalShow, beforeSetListing }) => {
  const form = useSelector((state) => state.form[formName]);
  const user = useSelector((state) => state.user);
  const min_bid_increment = useSelector((state) => state.settings.min_bid_increment);
  const [bidLoading, setBidLoading] = useState(false);
  const [maxDecimals, setMaxDecimals] = useState(false);
  const [bidInput, setBidInput] = useState("");
  const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d{0,${maxDecimals}}$`);

  useEffect(() => {
    if (min_bid_increment) {
      setMaxDecimals(countDecimals(mystToSui(min_bid_increment)));
    }
  }, [min_bid_increment]);

  useEffect(async () => {
    if (item && !bidLoading) {
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
        setBidLoading(false);
        onHide();
      }
    }
  }, [item?._id]);

  const salePrice = parseFloat(item.sale_price);
  const minBid =
    item.sale_price === 0
      ? item.auction?.min_bid
      : salePrice + item.auction?.min_bid_increment;
  const inputPrice = form?.values?.price;
  const currentBid = inputPrice ? suiToMyst(inputPrice) : minBid;
  const itemFees = 0.025;
  const feePrice = parseFloat(minBid * itemFees);
  // const itemRoyalties = parseInt(salePrice * 0.1);
  const totalPrice = minBid; // parseFloat(curPrice + feePrice);
  const buttonText = "Bid";
  const disabled = bidLoading || !item.active || currentBid < minBid;

  useEffect(() => {
    setBidInput(mystToSui(totalPrice).toString());
  }, [totalPrice]);

  const handleOnClick = async () => {
    setBidLoading(true);
    const itemExistsRes = await getObjectInfo(item.listing_object_id);
    // check if listing exists on blockchain, then if it doesn't, request listing update.
    if (itemExistsRes) {
      const currentPrice = parseInt(itemExistsRes.data.bid);
      // update auction price, if it's changed.
      if (currentPrice > item.sale_price && currentPrice > currentBid) {
        ToastPopup("A new, higher bid has come in.", "error");
        setBidLoading(false);
        if (setModalShow) {
          setModalShow({ ...item, ...{ sale_price: currentPrice } });
        }
        if (beforeSetListing) {
          beforeSetListing({ ...item, ...{ sale_price: currentPrice } });
        }
        await updateListing(item._id);
      } else {
        let tx = false;
        try {
          let priceToBid = suiToMyst(inputPrice) || minBid;
          tx = bidNFTAuction(item, mystToSui(priceToBid));
          const res = await tx;
          await sleep();
          if (res?.status === "success") {
            await updateListing(item._id);
            ToastPopup(`Item bid on successfully!`);

            if (beforeSetListing) {
              item.sale_price = priceToBid;
              if (item.auction.bids) {
                item.auction.bids.push({
                  _id: new Date(),
                  bid: priceToBid,
                  bidder: user,
                  listing: item._id,
                  updatedAt: "Just now",
                });
              }
              beforeSetListing(item);
            }

            if (onBid) {
              onBid(item);
              onHide();
            }
          } else {
            ToastPopup("Something went wrong; Transaction failed.", "error");
          }
          setBidLoading(false);
        } catch (e) {
          console.log(e);
          ToastPopup("Something went wrong; Transaction failed.", "error");
          setBidLoading(false);
        }
      }
    } else if (item.active) {
      ToastPopup("Item has already been purchased.", "error");
      if (beforeSetListing) {
        beforeSetListing({ ...item, ...{ active: false } });
      }
      updateListing(item._id);
      setBidLoading(false);
      onHide();
    } else {
      ToastPopup("Item has already been purchased.", "error");
      if (beforeSetListing) {
        beforeSetListing({ ...item, ...{ active: false } });
      }
      setBidLoading(false);
      onHide();
      return;
    }
  };

  const onBlurBid = (value) => {
    if (value === "" || isNaN(value)) {
      setBidInput("");
    } else {
      setBidInput(Number(value).toString());
    }
  };

  const parseBid = (value) => {
    if (value === "" || inputRegex.test(escapeRegExp(value))) {
      setBidInput(value);
    }
  };

  return (
    <Modal show={!!item} onHide={onHide}>
      <Modal.Header closeButton></Modal.Header>

      <div className="modal-body space-y-10 pd-40">
        <h3>Bid {item.nft?.name}</h3>
        <img src={item.nft?.image} />
        <div className="hr"></div>
        <div className="d-flex justify-content-between">
          <p>Highest Bid</p>
          <p className="text-right price color-popup">{mystToSui(salePrice)} SUI</p>
        </div>
        <div className="d-flex justify-content-between">
          <p>Minimum Bid</p>
          <p className="text-right price color-popup">{mystToSui(minBid)} SUI</p>
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

        <Field
          type="text"
          inputMode="decimal"
          name="price"
          className="bidInput"
          placeholder="Bid amount"
          props={{
            value: bidInput.toString(),
          }}
          pattern={`^[0-9]*[.,]?[0-9]{0,${maxDecimals}}$`}
          component={renderFormV2}
          onBlur={() => {
            onBlurBid(bidInput);
          }}
          onChange={(event) => {
            if (event.currentTarget.validity.valid) {
              parseBid(event.target.value.replace(/,/g, "."));
            }
          }}
          hidename
        />
        <RequireAmountButton
          amount={Math.max(minBid, suiToMyst(form?.values?.price || 0))}
          text={buttonText}
          className="btn btn-primary"
          disabled={disabled}
        >
          <LoadingButton
            onClick={handleOnClick}
            disabled={disabled}
            loading={bidLoading}
            className="btn btn-primary"
            data-toggle="modal"
            data-target="#popup_bid_success"
            data-dismiss="modal"
            aria-label="Close"
          >
            {buttonText}
          </LoadingButton>
        </RequireAmountButton>
      </div>
    </Modal>
  );
};

export default reduxForm({ form: formName })(BidModal);
