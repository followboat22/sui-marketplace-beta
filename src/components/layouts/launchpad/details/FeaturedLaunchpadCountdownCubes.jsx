import Countdown from "react-countdown";
import styled from "styled-components";

const CountdownCube = styled.div`
  background: linear-gradient(rgba(0, 0, 0, 0.24) 0%, rgba(0, 0, 0, 0.12) 100%);
  backdrop-filter: blur(20px);
  width: 60px;
  min-height: 60px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  span {
    color: white;
    font-size: 16px;
    font-weight: 600;
    font-family: "Poppins";
    line-height: 24px;
    text-transform: uppercase;
    &:nth-child(2) {
      font-size: 12px;
      line-height: 20px;
    }
  }

  @media ((max-width: 1366px) and (min-width: 768px)) or (max-width: 500px) {
    width: 44px;
    min-height: 44px;
    border-radius: 8px;

    span {
      font-size: 12px;
      line-height: 18px;
      &:nth-child(2) {
        font-size: 8px;
        line-height: 12px;
      }
    }
  }
`;
const ContentBottom = styled.div`
  display: flex;
  gap: 6px;
  width: 100%;
`;
const ProgressBackground = styled.div`
  background: linear-gradient(rgba(0, 0, 0, 0.24) 0%, rgba(0, 0, 0, 0.12) 100%);
  backdrop-filter: blur(20px);
  min-height: 60px;
  padding: 0 2rem;
  border-radius: 12px;
  width: 100%;
  display: flex;
  align-items: center;

  @media ((max-width: 1366px) and (min-width: 768px)) or (max-width: 500px) {
    min-height: 44px;
    border-radius: 8px;

    span {
      font-size: 12px;
      line-height: 18px;
    }
  }
`;
const ProgressText = styled.span`
  font-size: 16px;
  font-weight: 600;
`;
const ProgressBar = styled.div`
  height: 1.5rem;

  @media ((max-width: 1366px) and (min-width: 768px)) or (max-width: 500px) {
    height: 1rem;
  }
`;

const FeaturedLaunchpadCountdownCubes = ({ launchpad }) => {
  const { start_date } = launchpad;
  const saleIndex = 0;
  const sale = launchpad?.object?.sales[saleIndex] || {};
  const { count, total } = sale;

  // Renderer callback with condition
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return (
        <ProgressBackground>
          <ContentBottom>
            <div className="fullWidth">
              <div className="flex justify-content-between mb-3">
                <ProgressText>Total Minted</ProgressText>
                <ProgressText>
                  <b>0%</b> ({total - count || 0}/{total || 0})
                </ProgressText>
              </div>
              <ProgressBar className="progress progress-bar-striped">
                <ProgressBar
                  className="progress-bar bg-info"
                  role="progressbar"
                  style={{
                    width: `${total - count || 0}%`,
                  }}
                />
              </ProgressBar>
            </div>
          </ContentBottom>
        </ProgressBackground>
      );
    } else {
      // Render a countdown
      return (
        <ContentBottom>
          <CountdownCube>
            <span>{days}</span>
            <span>Days</span>
          </CountdownCube>
          <CountdownCube>
            <span>{hours}</span>
            <span>Hrs</span>
          </CountdownCube>
          <CountdownCube>
            <span>{minutes}</span>
            <span>Mins</span>
          </CountdownCube>
          <CountdownCube>
            <span>{seconds}</span>
            <span>Secs</span>
          </CountdownCube>
        </ContentBottom>
      );
    }
  };

  return <Countdown date={new Date(start_date).valueOf()} renderer={renderer} />;
};

export default FeaturedLaunchpadCountdownCubes;
