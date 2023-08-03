import styled from "styled-components";

const Wrapper = styled.div`
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  :hover {
    cursor: pointer;
  }

  span {
    position: absolute;
    top: 0px;
    right: 0px;
    background: red;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    font-weight: 700;
  }
`;

const Trigger = ({ count, onClick }) => {
  return (
    <Wrapper onClick={onClick}>
      <i className={`fas fa-bell`} style={{ fontSize: "24px" }}></i>
      {count > 0 && <span>{count}</span>}
    </Wrapper>
  );
};

export default Trigger;
