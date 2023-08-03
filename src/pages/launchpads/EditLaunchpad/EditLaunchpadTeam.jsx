import React from "react";
import { FieldArray } from "redux-form";
import { renderLaunchpadFields, renderTeamFields } from "../../../utils/form";

const EditLaunchpadTeam = () => {
  return (
    <div>
      <FieldArray
        name="team"
        title="Team"
        renderLaunchpadSection={renderTeamFields}
        component={renderLaunchpadFields}
        rerenderOnEveryChange
        required
      />
    </div>
  );
};

export default EditLaunchpadTeam;
