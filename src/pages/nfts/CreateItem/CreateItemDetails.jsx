import React from "react";
import { Field, FieldArray } from "redux-form";
import { renderFormV2, renderCreateNFTFields } from "../../../utils/form";
import { statusToEffect } from "../../../utils/formats";

const CreateItemDetails = ({ collections, collection }) => {
  return (
    <div>
      <Field type="select" name="collection" required={true} component={renderFormV2}>
        <option key="placeholder" value="" hidden>
          Select a collection
        </option>
        {collections.map((col, index) => (
          <option key={col._id} value={index}>
            {col.name}
          </option>
        ))}
      </Field>
      {!!collection && !collection?.active && (
        <span
          className={`sc-status ${statusToEffect(collection?.review_status)} capitalize`}
        >
          {collection?.review_status}
        </span>
      )}
      <Field
        name="name"
        type="text"
        required
        placeholder="NFT Name"
        component={renderFormV2}
      />
      <Field
        name="description"
        required
        placeholder='e.g. "This is a very limited item"'
        type="textarea"
        component={renderFormV2}
      />
      <Field
        type="number"
        title="Number of NFTs to mint"
        name="count"
        component={renderFormV2}
        placeholder={1}
      />
      {collection && (
        <FieldArray
          name="fields"
          title="Metadata Information"
          component={renderCreateNFTFields}
          props={{ fields: collection.fields }}
          rerenderOnEveryChange
        />
      )}
    </div>
  );
};

export default CreateItemDetails;
