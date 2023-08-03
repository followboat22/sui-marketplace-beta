import styled from "styled-components";

const Wrapper = styled.div`
  margin-left: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

const Button = styled.button`
  cursor: pointer;
  border: none;
  outline: none;
  background: transparent;
  padding: 0;
  :hover {
    border: none;
    outline: none;
    background: transparent;
    padding: 0;
  }
`;

const Icon = styled.i`
  font-size: 24px;
  color: #000;
  transition: color 0.15s linear;
  :hover {
    color: red;
  }
`;

const ItemActions = ({ notification, remove }) => {
  return (
    <Wrapper>
      <Button onClick={() => remove(notification.id)} title="Delete">
        <Icon className="fal fa-times"></Icon>
      </Button>
    </Wrapper>
  );
};

export default ItemActions;
