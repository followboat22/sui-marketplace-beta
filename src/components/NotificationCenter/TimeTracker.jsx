import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useEffect, useReducer, useRef } from "react";
import styled from "styled-components";

dayjs.extend(relativeTime);

const Wrapper = styled.div`
  color: #7a798a;
`;

const TimeTracker = ({ createdAt }) => {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const intervalRef = useRef();

  // refresh value of `createdAt` every ~ 1 minute
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      forceUpdate();
    }, 1000);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <Wrapper>
      <span>{dayjs(createdAt).fromNow()}</span>
    </Wrapper>
  );
};

export default TimeTracker;
