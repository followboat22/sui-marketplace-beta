import { Modal } from "react-bootstrap";
import { connect, useDispatch, useSelector } from "react-redux";
import { Field, FieldArray, Form, reduxForm, change } from "redux-form";
import { Accordion } from "react-bootstrap-accordion";
import { renderFormV2, renderSearchFields, renderSetTags } from "../../../utils/form";
import { getCollectionImageURL } from "../../../utils/formats";

export const formName = "collection-review";

const ReviewModal = ({ onSubmit, collection, onHide, ...props }) => {
  const dispatch = useDispatch();
  const { pristine, submitting, handleSubmit, reset, error } = props;
  const form = useSelector((state) => state.form[formName]);
  const statuses = ["awaiting review", "under review", "denied", "approved", "verified"];

  if (!collection) {
    return false;
  }

  return (
    <Modal
      show={collection}
      onHide={() => {
        reset();
        onHide();
      }}
      size="xl"
    >
      <Modal.Header closeButton></Modal.Header>

      <div className="modal-body space-y-20 pd-40">
        <div className="tf-list-item tf-section">
          <div className="themesflat-container">
            <div className="row">
              <div className="col-12">
                <div className="flat-form flat-form-wide">
                  <div className="flat-tabs tab-list-item">
                    <Form onSubmit={handleSubmit(onSubmit)}>
                      <Field
                        type="file"
                        name="featured_image"
                        className="hideInput"
                        featuredImage={getCollectionImageURL(collection._id)}
                        component={renderFormV2}
                      />
                      <Field
                        type="file"
                        name="logo_image"
                        className="hideInput"
                        labelClassName="square"
                        featuredImage={getCollectionImageURL(collection._id, "logo")}
                        component={renderFormV2}
                      />
                      <h5>Project Details</h5>
                      <p>{collection.project_details}</p>
                      <Field
                        type="text"
                        name="name"
                        placeholder="Collection Name"
                        required
                        component={renderFormV2}
                      />
                      <Field
                        type="textarea"
                        name="description"
                        placeholder='e.g. "This is my collection!"'
                        required
                        component={renderFormV2}
                      />
                      <div className="row-form style-3">
                        <div className="inner-row-form">
                          <Field
                            type="number"
                            name="royalties"
                            placeholder="5%"
                            disabled={true}
                            component={renderFormV2}
                          />
                        </div>
                      </div>
                      <Accordion title="Tags" show={true}>
                        <FieldArray
                          name="tags"
                          title="Tags"
                          component={renderSetTags}
                          className="pt-24"
                        />
                      </Accordion>
                      <FieldArray
                        name="fields"
                        title="Metadata Information"
                        component={renderSearchFields}
                        rerenderOnEveryChange
                      />
                      <Field
                        type="select"
                        name="review_status"
                        component={renderFormV2}
                        onChange={(_, value) => {
                          dispatch(
                            change(formName, "active", statuses.slice(3).includes(value))
                          );
                        }}
                      >
                        {statuses.map((value) => (
                          <option key={value} value={value}>
                            {value}
                          </option>
                        ))}
                      </Field>
                      <Field
                        type="checkbox"
                        name="active"
                        checked={form?.values?.active}
                        onClick={() =>
                          dispatch(change(formName, "active", !form?.values?.active))
                        }
                        component={renderFormV2}
                      />
                      <Field
                        type="textarea"
                        name="review_notes"
                        component={renderFormV2}
                      />
                      <p className="error">{error}</p>
                      <button type="submit" disabled={pristine || submitting}>
                        Update Collection
                      </button>
                    </Form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default connect((state) => ({
  initialValues: state.initialValues[formName], // pull initial values from account reducer
}))(reduxForm({ form: formName, enableReinitialize: true })(ReviewModal));
