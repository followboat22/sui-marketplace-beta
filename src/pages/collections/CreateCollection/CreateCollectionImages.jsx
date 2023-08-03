import React from "react";
import { Field } from "redux-form";
import { renderFormV2 } from "../../../utils/form";
import StickyPreviewCollection from "../../../components/layouts/StickyPreviewCollection";

const CreateCollectionImages = ({
  logoImage,
  setLogoImage,
  featuredImage,
  setFeaturedImage,
}) => {
  return (
    <div className="row">
      <div className="col-xl-4 col-lg-6 col-md-6 col-12">
        <StickyPreviewCollection />
      </div>
      <div className="col-xl-8 col-lg-6 col-md-12 col-12">
        <Field
          type="file"
          name="featured_image"
          title="Banner Image"
          className="hideInput"
          labelClassName="banner"
          imgClassName="inheritHeight"
          featuredImage={featuredImage}
          component={renderFormV2}
          containername="required"
          onChange={(e) => {
            if (e) {
              setFeaturedImage(URL.createObjectURL(e));
            }
          }}
        />
        <Field
          type="file"
          name="logo_image"
          className="hideInput"
          labelClassName="square"
          imgClassName="inheritHeight"
          featuredImage={logoImage}
          component={renderFormV2}
          containername="required"
          onChange={(e) => {
            if (e) {
              setLogoImage(URL.createObjectURL(e));
            }
          }}
        />
      </div>
    </div>
  );
};

export default CreateCollectionImages;
