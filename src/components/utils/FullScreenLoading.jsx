import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { usePrevious } from "../../utils/hooks";
import styled from "styled-components";
import LoadingSpinner from "../utils/LoadingSpinner";

const LoadingScreen = styled.div`
  position: fixed;
  background: #202030;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  z-index: 1500;
  opacity: ${({ fadeOut }) => (fadeOut ? 0 : 1)};
  transition: opacity 0.2s ease-in-out;
`;

const FullScreenLoading = () => {
  const loading = useSelector((state) => state.loading);
  const prevLoading = usePrevious(loading.fullScreen, false);
  const [shouldRender, setShouldRender] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    if (loading.fullScreen && !shouldRender) {
      setShouldRender(true);
      setFadingOut(false);
    }
    if (!loading.fullScreen && prevLoading) {
      setShouldRender(true);
      setFadingOut(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setFadingOut(false);
      }, 1000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [loading]);

  return (
    shouldRender && (
      <LoadingScreen fadeOut={fadingOut}>
        <LoadingSpinner size="xlarge" responsive />
        <div className="mt--40">
          <h6>Loading user profile...</h6>
        </div>
      </LoadingScreen>
    )
  );
};

export default FullScreenLoading;
