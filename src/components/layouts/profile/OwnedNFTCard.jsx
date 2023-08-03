import React from "react";
import { ellipsifyString } from "../../../utils/formats.js";
import LazyLoadImage from "../../../components/layouts/LazyLoadImage";
import CopyToClipboard from "react-copy-to-clipboard";
import ToastPopup from "../../../components/utils/ToastPopup";

const OwnedNFTCard = ({ item, sellHandler, rentHandler }) => {
  const handleCopy = () => {
    ToastPopup("Copied wallet address to clipboard!", "success");
  };
  return (
    <div className="sc-card-product">
      <div className="card-media">
        <LazyLoadImage src={item.data.url} className="image-skeleton" />
        <div className="button-place-bid">
          <button
            onClick={() => sellHandler(item)}
            data-toggle="modal"
            data-target="#popup_bid"
            className="sc-button style-place-bid style bag fl-button pri-3 fullWidth"
          >
            <span>Sell</span>
          </button>
          <button
            onClick={() => rentHandler(item)}
            data-toggle="modal"
            data-target="#popup_bid"
            className="sc-button style-place-bid style bag fl-button pri-3 fullWidth"
          >
            <span>Rent</span>
          </button>
        </div>
      </div>
      <div className="card-title owned-nft">
        <div className="name">{item.data.name}</div>
        <CopyToClipboard
          style={{
            cursor: "pointer",
          }}
          text={item.id}
          onCopy={() => handleCopy()}
        >
          <div>
            <i className="fal mr-3 fa-copy"></i>
            {ellipsifyString(item.id, 16)}
          </div>
        </CopyToClipboard>
      </div>
    </div>
  );
};

export default OwnedNFTCard;
