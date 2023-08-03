import { useState } from "react";
import styled from "styled-components";

const ToggleWrapper = styled.label`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 30px;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background-color: #00c853;
  }

  &:checked + span:before {
    transform: translateX(29px);
  }
`;

const ToggleDecoration = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #2c3e50;
  transition: 0.3s;
  border-radius: 30px;

  &:before {
    position: absolute;
    content: "";
    height: 25px;
    width: 25px;
    left: 3px;
    bottom: 2.6px;
    background-color: #fff;
    border-radius: 50%;
    transition: 0.3s;
  }
`;

const ToggleButton = ({ input }) => {
  const [isToggled, toggle] = useState(input.checked);

  const callback = () => {
    toggle(!isToggled);
    // onChange(!isToggled);
  };

  return (
    <ToggleWrapper>
      <ToggleInput {...input} type="checkbox" onClick={callback} />
      <ToggleDecoration></ToggleDecoration>
    </ToggleWrapper>
  );
};

export default ToggleButton;
