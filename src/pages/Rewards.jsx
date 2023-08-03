import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import PageHeader from "../components/layouts/PageHeader";
import Companion from "../assets/images/arcade-panda.6d45b60f713a1bdfd905.png";
import Companion2 from "../assets/images/arcade-panda.6d45b60f713a1bdfd905.png";
import Companion3 from "../assets/images/arcade-panda.6d45b60f713a1bdfd905.png";
import * as ReactTooltip from 'react-tooltip';

const rewardsList = [
  { id: 1, level: "1", fees: "Base Fees", companion: Companion, locked: true },
  { id: 2, level: "2", fees: "~5% lower Fees", companion: Companion, locked: true },
  { id: 3, level: "3", fees: "~15% lower Fees", companion: Companion2, locked: true },
  { id: 4, level: "4", fees: "~25% lower Fees", companion: Companion2, locked: true },
  { id: 5, level: "5", fees: "~45% lower Fees", companion: Companion3, locked: true },
];

const RewardsProgress = (props) => {
  return (
    <div className="rewards-bar-wrapper">
      {rewardsList.map((reward) => (
        <RewardsInfoBox reward={reward} />
      ))}
      <div
        className="progress progress-bar-vertical"
        style={{ height: "80%", position: "absolute" }}
      >
        <div
          className="progress-bar bg-mint"
          role="progressbar"
          style={{ height: "0%" }}
        />
      </div>
    </div>
  );
};

const LockedTier = () => {
  return (
    <>
      <ReactTooltip
        id="lockedTier"
        place="top"
        type="dark"
        effect="solid"
        className="rewards-tooltip locked"
        delayShow={150}
      >
        <span>
          This tier is currently locked. You need 5000 points to unlock this tier
        </span>
      </ReactTooltip>
      <a data-tip data-for="lockedTier" className="rewards-level-progress-icon locked">
        <i className="fas fa-lock" />
      </a>
    </>
  );
};

const UnlockedTier = () => {
  return (
    <>
      <ReactTooltip
        id="unlockedTier"
        place="top"
        type="dark"
        effect="solid"
        className="rewards-tooltip locked"
        delayShow={150}
      >
        <span>You have unlocked this tier!</span>
      </ReactTooltip>
      <a
        data-tip
        data-for="unlockedTier"
        className="rewards-level-progress-icon unlocked"
      >
        <i className="fas fa-star" />
      </a>
    </>
  );
};

const RewardsInfoBox = ({ reward }) => {
  const { level, fees, companion, locked } = reward;
  return (
    <div className="rewards-level-interval">
      <hr className={`rewards-hr ${locked ? "locked" : "unlocked"}`} />
      <div className={`rewards-level-image ${locked ? "locked" : "unlocked"}`}>
        <img src={companion} />
      </div>
      {locked ? <LockedTier /> : <UnlockedTier />}
      <div className={`rewards-level-textbox ${locked ? "locked" : "unlocked"}`}>
        <div className="rewards-level-textbox-inner">
          <h4>Level {level}</h4>
          <ul>
            <li>Level {level} Rewards</li>
            <li>{fees}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const RewardsStatsProgressBar = () => {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        width: "100%",
        height: "16px",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        className="rewards-level-progress-icon unlocked"
        style={{ position: "absolute", left: 0 }}
      >
        <i className="fas fa-star" />
      </div>

      <div
        className="progress progress-bar-striped"
        style={{ position: "relative", width: "95%", height: "100%" }}
      >
        <div
          className="progress-bar bg-mint"
          role="progressbar"
          style={{ width: "0%", height: "100%" }}
        />
      </div>

      <div
        className="rewards-level-progress-icon locked"
        style={{ position: "absolute", right: 0 }}
      >
        <i className="fas fa-lock" />
      </div>
    </div>
  );
};

const RewardsStats = (props) => {
  return (
    <div
      className="flex flex-column-reverse"
      style={{
        borderRadius: "2rem",
        width: "100%",
        padding: "2rem",
        gap: "2rem",
        textAlign: "center",
      }}
    >
      <div
        className="flex flex-column"
        style={{
          border: "1px solid #707070",
          borderRadius: "1rem",
          padding: "2rem",
          gap: "2rem",
          alignItems: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <h2>LEVEL 1</h2>
        <RewardsStatsProgressBar />
        <h6>0/1000</h6>
      </div>
      <div
        className="flex flex-column justify-content-between"
        style={{ height: "100%", width: "100%" }}
      >
        <h3>Welcome to Companion Rewards!</h3>
        <span style={{ fontSize: "16px", fontWeight: 500, lineHeight: "22px" }}>
          We are excited to offer perks, benefits, and fee discounts to our community. You
          will earn 5 points for every 1 SUI spent on Onyx each yearly quarter. Points
          earned will be applied towards users level. Level up to enjoy greater rewards,
          platform discounts, and cost savings.
        </span>
        <LinkedWallets />
      </div>
    </div>
  );
};

const LinkedWallets = () => {
  return (
    <div
      className="flex flex-column"
      style={{
        border: "1px solid #707070",
        borderRadius: "1rem",
        padding: "1rem",
        gap: "1rem",
        alignItems: "center",
      }}
    >
      <div
        className="flex justify-content-between fullWidth"
        style={{ alignItems: "center" }}
      >
        <h5>Linked Wallets</h5>
        <button
          style={{
            height: "24px",
            borderRadius: "0.5rem",
            lineHeight: 1,
            padding: "1px 6px",
          }}
        >
          Connect Wallet
        </button>
      </div>

      <input
        type="text"
        disabled
        style={{ borderRadius: "30px", height: "24px", backgroundColor: "#222" }}
        placeholder="Wallet Address"
      />
      <input
        type="text"
        disabled
        style={{ borderRadius: "30px", height: "24px", backgroundColor: "#222" }}
        placeholder="Wallet Address"
      />
      <input
        type="text"
        disabled
        style={{ borderRadius: "30px", height: "24px", backgroundColor: "#222" }}
        placeholder="Wallet Address"
      />
    </div>
  );
};

const Rewards = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  return (
    <div>
      <Header />
      <PageHeader />
      <div className="tf-list-item tf-section">
        <div
          className="themesflat-container flex justify-content-center"
          style={{ gap: "2rem" }}
        >
          <div className="flex">
            <RewardsProgress />
          </div>
          <div className="flex">
            <RewardsStats />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Rewards;
