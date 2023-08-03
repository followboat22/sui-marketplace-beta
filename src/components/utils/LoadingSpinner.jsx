import React from "react";
// small, medium, large, xlarge, xxlarge
const LoadingSpinner = ({ size = "small", responsive, absolute, centered }) => (
  <div
    className={`load-spinner load-spinner--${size}${
      responsive ? " load-spinner--responsive" : ""
    }${centered ? " load-spinner--centered" : ""}
    ${absolute ? " load-spinner--absolute" : ""}`}
  />
);

export default LoadingSpinner;
