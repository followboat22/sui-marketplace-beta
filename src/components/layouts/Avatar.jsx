import CreatedBy from "../utils/CreatedBy";
import React from "react";
import { getUserImageURL, imageOnErrorHandler } from "../../utils/formats";

const Avatar = ({ creator, size, nolink, ...props }) => {
  const id = creator._id;
  const fallback = `https://gravatar.com/avatar/${id}?f=y&d=identicon&size=${size}`;
  if (nolink) {
    return (
      <img
        src={getUserImageURL(id, "avatar")}
        onError={(e) => imageOnErrorHandler(e, fallback)}
        className="avatar"
        {...props}
      />
    );
  }

  return (
    <CreatedBy creator={creator} {...props}>
      <img
        src={getUserImageURL(id, "avatar")}
        onError={(e) => imageOnErrorHandler(e, fallback)}
        className="avatar"
      />
    </CreatedBy>
  );
};

export default Avatar;
