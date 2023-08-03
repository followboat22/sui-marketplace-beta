import React from "react";
import { FieldArray } from "redux-form";
import { renderLaunchpadFields, renderFAQFields } from "../../../utils/form";

const EditLaunchpadFAQ = () => {
  return (
    <div>
      <FieldArray
        name="faq"
        title="FAQ (Optional)"
        renderLaunchpadSection={renderFAQFields}
        component={renderLaunchpadFields}
        rerenderOnEveryChange
      />
    </div>
  );
};

export default EditLaunchpadFAQ;
