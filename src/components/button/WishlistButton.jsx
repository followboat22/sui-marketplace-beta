import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { favoriteNFT } from "../../redux/state/user";
import ToastPopup from "../utils/ToastPopup";

const WishlistButton = ({ nft, className = "", onClick = undefined }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const favorited = useMemo(() => user.favorite_nfts?.includes(nft?._id), [user, nft]);

  const handleFavoriteNFT = () => {
    if (user._id) {
      dispatch(favoriteNFT(nft._id, user.favorite_nfts?.includes(nft?._id)));
      if (onClick) onClick();
    } else {
      ToastPopup("You must be connected to SUI in order to favorite NFTs", "error");
    }
  };

  return (
    <div className={`meta-item ${className}`}>
      <span onClick={handleFavoriteNFT} className="wishlist-button">
        <span className={`fa-heart ${favorited ? "fa" : "far"}`} />
        <span>{nft?.favorites ?? "0"}</span>
      </span>
    </div>
  );
};

export default WishlistButton;
