import React from "react";
import { mystToSui } from "../../../../utils/formats";

const SocialButtons = ({ socials }) => {
  const { twitter, discord, instagram, website, whitepaper } = socials;
  if (Object.values(socials).every((el) => el === undefined)) return null;

  return (
    <div className="widget-social style-3">
      <ul className="flex" style={{ gap: "1rem" }}>
        {twitter && (
          <li>
            <a href={twitter} target="_blank" rel="noreferrer">
              <i className="fab fa-twitter" />
            </a>
          </li>
        )}
        {discord && (
          <li>
            <a href={discord} target="_blank" rel="noreferrer">
              <i className="fab fa-discord" />
            </a>
          </li>
        )}
        {instagram && (
          <li>
            <a href={instagram} target="_blank" rel="noreferrer">
              <i className="fab fa-instagram" />
            </a>
          </li>
        )}
        {website && (
          <li>
            <a href={website} target="_blank" rel="noreferrer">
              <i className="far fa-globe" />
            </a>
          </li>
        )}
        {whitepaper && (
          <li>
            <a href={whitepaper} target="_blank" rel="noreferrer">
              <i className="far fa-book" />
            </a>
          </li>
        )}
      </ul>
    </div>
  );
};

const InfoBox = ({ text, textBold }) => {
  return (
    <div className="flex launchpad-infobox">
      <span style={{ fontSize: "18px" }}>
        {text}: <b>{textBold}</b>
      </span>
    </div>
  );
};

const MintOption = () => {
  return (
    <div
      className="flex flex-column fullWidth launchpad-info-container"
      style={{ gap: "3rem" }}
    >
      <div className="flex justify-content-between">
        <div className="mint-option-pill">
          <span className="mint-option-pill-text">Public</span>
        </div>
        <span className="mint-option-live">LIVE</span>
      </div>
      <div className="flex justify-content-between">
        <span style={{ fontSize: "1.5rem" }}>
          WHITELIST 240 <b>•</b> MAX 4 TOKENS <b>•</b> Price 5000 SUI
        </span>
      </div>
    </div>
  );
};

const LaunchpadInfo = ({ data, saleIndex }) => {
  const { launchpad_collection, sales } = data;
  const sale = sales[saleIndex];
  const { name, description, twitter, discord, instagram, website, whitepaper } =
    launchpad_collection;
  const socials = { twitter, discord, instagram, website, whitepaper };

  return (
    <div className="flex flex-column launchpad-details launchpad-info">
      <h1 className="heading">{name}</h1>
      <div className="flex" style={{ gap: "1rem" }}>
        <SocialButtons socials={socials} />
        <InfoBox text="Items" textBold={`${sale?.total || "~"}`} />
        <InfoBox text="Price" textBold={`${mystToSui(sale?.price) || "~"} ` + ` SUI`} />
      </div>
      <p className="sub-heading">{description}</p>
      {/* <MintOption /> */}
    </div>
  );
};

export default LaunchpadInfo;
