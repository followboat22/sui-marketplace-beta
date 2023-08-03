import React from "react";
import { FieldArray } from "redux-form";
import { renderLaunchpadFields, renderRoadmapFields } from "../../../utils/form";

const EditLaunchpadRoadmap = () => {
  return (
    <div>
      <FieldArray
        name="roadmap"
        title="Roadmap"
        renderLaunchpadSection={renderRoadmapFields}
        component={renderLaunchpadFields}
        rerenderOnEveryChange
        required
      />
    </div>
  );
};

export default EditLaunchpadRoadmap;
