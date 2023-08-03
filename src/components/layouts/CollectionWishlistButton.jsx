import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { favoriteCollection } from "../../redux/state/user";
import ToastPopup from "../utils/ToastPopup";

const CollectionWishlistButton = ({ collection, className = "" }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const favorited = useMemo(
    () => user.favorite_collections?.includes(collection?._id),
    [user, collection]
  );

  const handleFavoriteCollection = () => {
    if (user._id) {
      dispatch(
        favoriteCollection(
          collection._id,
          user.favorite_collections?.includes(collection?._id)
        )
      );
    } else {
      ToastPopup(
        "You must be connected to SUI in order to favorite collections",
        "error"
      );
    }
  };

  return (
    <div className={`meta-item ${className}`}>
      <span onClick={handleFavoriteCollection} className="wishlist-button">
        <span className={`fa-heart ${favorited ? "fa" : "far"}`} />
        <span>{collection?.favorites ?? "0"}</span>
      </span>
    </div>
  );
};

export default CollectionWishlistButton;
