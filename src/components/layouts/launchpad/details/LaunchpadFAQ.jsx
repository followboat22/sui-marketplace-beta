import React, { useState } from "react";
import Collapse from "react-bootstrap/Collapse";

const FAQItem = ({ dataBlock }) => {
  const [open, setOpen] = useState(false);
  const { question, answer } = dataBlock;
  return (
    <button onClick={() => setOpen(!open)} className="fullWidth launchpad-info-button">
      <div className="flex justify-content-between">
        <span style={{ fontSize: "24px" }}>{question}</span>
        {open ? <i className="fas fa-caret-up" /> : <i className="fas fa-caret-down" />}
      </div>
      <Collapse in={open}>
        <p style={{ fontSize: "16px", paddingTop: "1rem", lineHeight: "24px" }}>
          {answer}
        </p>
      </Collapse>
    </button>
  );
};

const LaunchpadFAQ = ({ data }) => {
  return (
    <div className="flex flex-column launchpad-details launchpad-faq">
      <h1 className="launchpad-heading">FAQ</h1>
      {data.map((dataBlock) => (
        <FAQItem dataBlock={dataBlock} />
      ))}
    </div>
  );
};

export default LaunchpadFAQ;
