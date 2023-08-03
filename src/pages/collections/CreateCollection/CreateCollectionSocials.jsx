import React from "react";
import { Field } from "redux-form";
import { renderFormV2 } from "../../../utils/form";

const CreateCollectionSocials = () => {
  return (
    <div>
      <Field
        name="twitter"
        type="text"
        placeholder="https://twitter.com/"
        component={renderFormV2}
      />
      <Field
        name="discord"
        type="text"
        placeholder="https://discord.gg/"
        component={renderFormV2}
      />
      <Field
        name="instagram"
        type="text"
        placeholder="https://instagram.com/"
        component={renderFormV2}
      />
    </div>
  );
};

export default CreateCollectionSocials;
