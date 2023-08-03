import React from "react";

const TeamMember = ({ dataBlock }) => {
  const { member, bio, image } = dataBlock;
  return (
    <div className="flex fullWidth launchpad-info-container">
      <img src={image} className="launchpad-image rounded-circle" />
      <div className="flex flex-column" style={{ gap: "0.5rem" }}>
        <h2>{member}</h2>
        <div>
          <span className="launchpad-info-text">{bio}</span>
        </div>
      </div>
    </div>
  );
};

const LaunchpadTeam = ({ data }) => {
  return (
    <div className="flex flex-column launchpad-details launchpad-team">
      <h1 className="launchpad-heading">Team</h1>
      {data.map((dataBlock) => (
        <TeamMember key={dataBlock.id} dataBlock={dataBlock} />
      ))}
    </div>
  );
};

export default LaunchpadTeam;
