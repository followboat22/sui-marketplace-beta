import React from "react";

const RoadmapItem = ({ dataBlock }) => {
  const { date, title, points, image } = dataBlock;
  return (
    <div className="flex fullWidth launchpad-info-container">
      <img src={image} className="launchpad-image" />
      <div className="flex flex-column" style={{ gap: "0.5rem" }}>
        <h5>{date}</h5>
        <h2>{title}</h2>
        <div>
          <ul
            className="launchpad-info-text"
            style={{
              paddingLeft: "16px",
            }}
          >
            {points.map((text, index) => (
              <li key={index} style={{ listStyleType: "disc" }}>
                {text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const LaunchpadRoadmap = ({ data }) => {
  return (
    <div className="flex flex-column launchpad-details launchpad-roadmap">
      <h1 className="launchpad-heading">Roadmap</h1>
      {data.map((dataBlock) => (
        <RoadmapItem key={dataBlock.id} dataBlock={dataBlock} />
      ))}
    </div>
  );
};

export default LaunchpadRoadmap;
