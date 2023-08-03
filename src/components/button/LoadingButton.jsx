import LoadingSpinner from "../utils/LoadingSpinner";
import React from "react";

const LoadingButton = ({ loading, disabled, children, ...props }) => {
  return (
    <button {...props} disabled={loading || disabled}>
      {loading ? <LoadingSpinner size="small" /> : children}
    </button>
  );
};

export default LoadingButton;
