import React from "react";
import { FieldArray } from "redux-form";
import { renderSearchFields } from "../../../utils/form";

const CreateCollectionMetadata = () => {
  return (
    <div>
      <FieldArray
        name="fields"
        title="Metadata Information"
        component={renderSearchFields}
        rerenderOnEveryChange
      />
    </div>
  );
};

export default CreateCollectionMetadata;
