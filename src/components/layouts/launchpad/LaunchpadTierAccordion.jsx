import { useState } from "react";
import { Collapse } from "react-bootstrap";
import styled from "styled-components";

const AccordionTitle = styled.span`
  color: var(--primary-color2);
  font-size: 28px;
`;

const LaunchpadTierAccordion = ({ title, defaultOpen, fields, index, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  const isWhitelisted = fields.get(index)?.whitelisted;
  const isActive = fields.get(index)?.active;
  const mintLimit = fields.get(index)?.limit || "UNLIMITED";
  const mintPrice = fields.get(index)?.price ? `${fields.get(index)?.price} SUI` : "FREE";
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="fullWidth item-details-accordian"
      >
        <div className="flex justify-content-between align-items-center">
          <div className="flex align-items-center" style={{ gap: "1rem" }}>
            <AccordionTitle>{title}</AccordionTitle>
            <div className="mint-option-pill">
              <span className="mint-option-pill-text">
                {isWhitelisted ? "Whitelist" : "Public"}
              </span>
            </div>
          </div>
          {isActive ? (
            <span className="mint-option-live">LIVE</span>
          ) : (
            <span className="mint-option-inactive">INACTIVE</span>
          )}
        </div>
        <div className="flex flex-column fullWidth" style={{ gap: "3rem" }}>
          <div className="flex justify-content-between"></div>
          <div className="flex justify-content-between" style={{ height: "2rem" }}>
            <span style={{ fontSize: "18px", fontWeight: 600 }}>
              Limit: {mintLimit}
              <b> • </b> Price: {mintPrice}
            </span>

            {open ? (
              <i className="fas fa-caret-up" />
            ) : (
              <i className="fas fa-caret-down" />
            )}
          </div>
        </div>
      </button>
      <Collapse in={open}>
        <div>
          <div className="item-details-accordian-details">{children}</div>
        </div>
      </Collapse>
    </div>
  );
};

export default LaunchpadTierAccordion;
