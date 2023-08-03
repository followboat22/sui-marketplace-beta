import React from "react";
import { useSelector } from "react-redux";
import { Field } from "redux-form";
import { renderFormV2 } from "../../../utils/form";

const EditLaunchpadDates = ({ collection }) => {
  const user = useSelector((state) => state.user);
  const admin = user?.role_id > 2;

  return (
    <div>
      <div className="row">
        <div className="col-md">
          <Field
            type="select"
            name="collection"
            required={true}
            disabled={true}
            component={renderFormV2}
          >
            <option value={collection?._id}>{collection?.name}</option>
          </Field>
        </div>
        {admin && (
          <div className="col-md-1">
            <Field
              name="featured"
              title="Featured?"
              type="checkbox"
              component={renderFormV2}
            />
          </div>
        )}
      </div>
      <div className="row">
        <div className="col-md-6">
          <Field
            name="start_date"
            title="Starting date"
            type="datetime-local"
            props={{ min: "2022-01-01 00:00" }}
            containername="required"
            component={renderFormV2}
          />
        </div>
        <div className="col-md-6">
          <Field
            name="end_date"
            title="Expiration date"
            type="datetime-local"
            props={{ min: "2022-01-01 00:00" }}
            containername="required"
            component={renderFormV2}
          />
        </div>
      </div>
    </div>
  );
};

export default EditLaunchpadDates;
