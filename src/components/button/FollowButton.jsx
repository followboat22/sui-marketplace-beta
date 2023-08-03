import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { followUser } from "../../redux/state/user";
import ToastPopup from "../utils/ToastPopup";

const FollowButton = ({ creator }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const following = useMemo(() => user.following?.includes(creator?._id), [user]);

  const handleFollow = (id) => {
    if (user._id) {
      dispatch(followUser(id, user?.following?.includes(id)));
    } else {
      ToastPopup("You must be connected to SUI to follow creators.", "error");
    }
  };

  return (
    <button
      className="sc-button fl-button pri-3"
      onClick={() => handleFollow(creator?._id)}
    >
      <span>{following ? "Following" : "Follow"}</span>
    </button>
  );
};

export default FollowButton;
