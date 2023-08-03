import React from "react";

const SocialButtons = ({ socials }) => {
  const { twitter, discord, instagram } = socials;
  if (Object.values(socials).every((el) => el === undefined)) return null;

  return (
    <div className="widget-social style-3">
      <ul>
        {twitter && (
          <li>
            <a href={twitter} target="_blank">
              <i className="fab fa-twitter" />
            </a>
          </li>
        )}
        {discord && (
          <li>
            <a href={discord} target="_blank">
              <i className="fab fa-discord" />
            </a>
          </li>
        )}
        {instagram && (
          <li>
            <a href={instagram} target="_blank">
              <i className="fab fa-instagram" />
            </a>
          </li>
        )}
      </ul>
    </div>
  );
};

export default SocialButtons;
