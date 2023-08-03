import React from "react";

const adaptFileEventToValue = (delegate) => (e) => delegate(e.target.files[0]);

export const FileInputHidden = ({
  input: { value: omitValue, onChange, onBlur, ...inputProps },
  meta: omitMeta,
  ...props
}) => {
  return (
    <input
      onChange={adaptFileEventToValue(onChange)}
      onBlur={adaptFileEventToValue(onBlur)}
      type="file"
      className="hideInput"
      {...props.input}
      {...props}
    />
  );
};

export default FileInputHidden;
