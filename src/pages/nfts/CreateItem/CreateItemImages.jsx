import React from "react";
import { Field } from "redux-form";
import { renderFormV2 } from "../../../utils/form";

const CreateItemImages = ({ nftImage, setNFTImage }) => {
  return (
    <div className="form-upload-profile">
      <Field
        type="file"
        name="image"
        title="NFT Image"
        className="hideInput"
        labelClassName="full-image"
        containername="required"
        featuredImage={nftImage}
        component={renderFormV2}
        onChange={(e) => {
          if (e) {
            setNFTImage(URL.createObjectURL(e));
          }
        }}
      />
    </div>
  );
};

export default CreateItemImages;
