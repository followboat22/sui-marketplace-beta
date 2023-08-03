import { useState } from "react";
import { Collapse } from "react-bootstrap";
import styled from "styled-components";

const AccordionTitle = styled.span`
  color: var(--primary-color2);
  font-size: 18px;
`;

const Accordion = ({ title, defaultOpen, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="fullWidth item-details-accordian"
      >
        <div className="flex justify-content-between">
          <AccordionTitle>{title}</AccordionTitle>
          {open ? <i className="fas fa-caret-up" /> : <i className="fas fa-caret-down" />}
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

export default Accordion;
