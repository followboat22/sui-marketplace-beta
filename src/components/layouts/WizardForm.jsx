import LoadingButton from "../../components/button/LoadingButton";
import React, { useState } from "react";
import { useMemo } from "react";
import styled from "styled-components";

const InnerProgress = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  counter-reset: step;
  transition: all 0.4s ease;
`;

const ProgressBar = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  height: 6px;
  width: calc(100% - 4rem);
  background-color: #000;
  z-index: 1;
  transition: width 0.4s ease;
`;

const ColoredProgressBar = styled(ProgressBar)`
  width: ${({ progress }) => `calc(${progress}% - 2rem)`};
`;

const ProgressStep = styled.div`
  width: 4rem;
  height: 4rem;
  background-color: #fff;
  border-radius: 50%;
  border: ${({ mode }) =>
    mode !== "todo" ? "4px solid var(--primary-color11)" : "4px solid #000"};
  display: flex;
  justify-content: center;
  align-items: center;
  color: #000;
  z-index: 2;

  &:before {
    counter-increment: step;
    content: ${({ mode }) => (mode === "done" ? "'\u2713'" : "counter(step)")};
    color: ${({ mode }) => mode === "done" && "var(--primary-color11)"};
    font-size: ${({ mode }) => (mode === "done" ? "2rem" : "1.5rem")};
    font-weight: 900;
  }

  &:after {
    content: attr(data-title);
    position: absolute;
    top: ${({ mode }) => (mode === "doing" ? "-115%" : "-100%")};
    border-bottom: ${({ mode }) =>
      mode === "doing" && "2px solid var(--primary-color11)"};
    padding-bottom: ${({ mode }) => mode === "doing" && "0.5rem"};
    font-size: 2rem;
    color: var(--primary-color2);
    font-weight: 700;
    transition: top 0.4s ease;
    white-space: nowrap;
  }
`;

const ProgressWrapper = styled.div`
  background-color: var(--bg-section3);
  padding: 1rem 1.5rem;
  border-radius: 5rem;
  margin-bottom: 6rem;
`;

const FormFlexColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
  margin-bottom: 3rem;
`;

const WizardButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 2rem;
`;

const getTopNavStyles = (indx, length) => {
  const styles = [];
  for (let i = 0; i < length; i++) {
    if (i < indx) {
      styles.push("done");
    } else if (i === indx) {
      styles.push("doing");
    } else {
      styles.push("todo");
    }
  }
  return styles;
};

const TopNavSteps = ({ steps, stylesState }) => {
  return steps.map((step, i) => {
    return <ProgressStep data-title={step.title} mode={stylesState[i]} key={i} />;
  });
};

const WizardForm = ({
  children,
  onSubmit,
  submitText,
  handleSubmit,
  pristine,
  submitting,
  invalid,
}) => {
  const numberOfSteps = React.Children.toArray(children).filter((child) =>
    React.isValidElement(child)
  ).length;
  const [page, setPage] = useState(0);
  const [stylesState, setStyles] = useState(getTopNavStyles(page, numberOfSteps));
  const activePage = React.Children.toArray(children)[page];
  const isLastPage = page === numberOfSteps - 1;

  const progress = useMemo(() => {
    const subBarLength = 100 / (numberOfSteps - 1);
    const initialProgress = subBarLength / 2;
    const totalProgress = initialProgress + subBarLength * page;
    return totalProgress;
  }, [page, numberOfSteps]);

  let steps = [];
  if (children) {
    let childrenWithProps = React.Children.map(children, (child) => {
      if (child !== null) {
        return React.cloneElement(child);
      }
    });
    steps = childrenWithProps.map((childComponent) => ({
      title: childComponent.props.title,
    }));
  }

  const setStepState = (indx) => {
    setStyles(getTopNavStyles(indx, numberOfSteps));
    setPage(indx);
  };

  const next = () => {
    setStepState(Math.min(page + 1, children.length - 1));
  };

  const previous = () => {
    setStepState(Math.max(page - 1, 0));
  };

  const stepper = (values) => {
    if (isLastPage) {
      return onSubmit(values);
    } else {
      next(values);
    }
  };

  return (
    <form onSubmit={handleSubmit(stepper)}>
      <FormFlexColumn>
        <ProgressWrapper className="full-width">
          <InnerProgress>
            <ProgressBar className="progress progress-bar" style={{ marginLeft: "2rem" }}>
              <ColoredProgressBar progress={progress} className="progress-bar bg-mint" />
            </ProgressBar>
            <TopNavSteps steps={steps} stylesState={stylesState} />
          </InnerProgress>
        </ProgressWrapper>

        {activePage}
        <WizardButtons>
          {page > 0 && (
            <button type="button" onClick={previous}>
              « Previous
            </button>
          )}
          {!isLastPage && <button type="submit">Next »</button>}
          {isLastPage && (
            <LoadingButton
              type="submit"
              loading={submitting}
              disabled={pristine || submitting || invalid}
            >
              {submitText ?? "Submit"}
            </LoadingButton>
          )}
        </WizardButtons>
      </FormFlexColumn>
    </form>
  );
};

export default WizardForm;
