import React from "react";

const adaptFileEventToValue = (delegate) => (e) => delegate(e.target.files[0]);

export const FileInput = ({
  input: { onChange, onBlur, ...inputProps },
  meta: omitMeta,
  featuredImage,
  imgClassName = "",
  labelClassName = "",
  hint,
  ...props
}) => {
  let displayImage;
  try {
    displayImage = inputProps.value
      ? URL.createObjectURL(inputProps.value)
      : featuredImage;
  } catch (e) {}
  return (
    <label className={`uploadFile ${featuredImage ? "noPad " : ""}${labelClassName}`}>
      {!!featuredImage && <img src={displayImage} className={imgClassName} />}
      <input
        onChange={adaptFileEventToValue(onChange)}
        onBlur={adaptFileEventToValue(onBlur)}
        type="file"
        {...props.input}
        {...props}
      />
      {!featuredImage && (
        <>
          <div className="filename">{hint || "PNG, JPG, GIF, WEBP or MP4. Max 5mb."}</div>
          <div className="inputfile" />
        </>
      )}
    </label>
  );
};

export default FileInput;
