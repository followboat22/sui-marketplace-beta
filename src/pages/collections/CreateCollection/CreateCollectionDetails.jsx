import React from "react";
import { FieldArray, Field } from "redux-form";
import { Accordion } from "react-bootstrap-accordion";
import { renderSetTags, renderFormV2 } from "../../../utils/form";
import RoyaltiesButtonGroup from "../../../components/layouts/RoyaltiesButtonGroup";
import StickyPreviewCollection from "../../../components/layouts/StickyPreviewCollection";

const CreateCollectionDetails = () => {
  return (
    <div className="row">
      <div className="col-xl-4 col-lg-6 col-md-6 col-12">
        <StickyPreviewCollection />
      </div>
      <div className="col-xl-8 col-lg-6 col-md-12 col-12">
        <Field
          name="name"
          title="Collection Name"
          type="text"
          placeholder="e.g. Sui Capys"
          component={renderFormV2}
          required
        />
        <Field
          name="symbol"
          title="Collection Symbol"
          type="text"
          placeholder="e.g. CAPY"
          component={renderFormV2}
          required
        />
        <Field
          name="description"
          type="textarea"
          placeholder='e.g. "This is my collection!"'
          component={renderFormV2}
          required
        />
        <Field name="royalties" label="Royalties" component={RoyaltiesButtonGroup} />
        <Field type="text" name="whitepaper" component={renderFormV2} />
        <Field type="text" name="website" component={renderFormV2} />
        <Accordion title="Tags" show={true}>
          <FieldArray
            name="tags"
            title="Tags"
            component={renderSetTags}
            className="pt-24"
          />
        </Accordion>
      </div>
    </div>
  );
};

export default CreateCollectionDetails;
