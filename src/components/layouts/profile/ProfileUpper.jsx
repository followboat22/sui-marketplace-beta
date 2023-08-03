import styled from "styled-components";
import CopyToClipboard from "react-copy-to-clipboard";
import ToastPopup from "../../../components/utils/ToastPopup";
// import ReadMore from "components/utils/ReadMore";
import { ellipsifyString } from "../../../utils/formats";

const ProfileDetailsWrapper = styled.div`
  position: relative;
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  @media only screen and (max-width: 991px) {
    flex-direction: column;
    gap: 1.5rem;
  }
`;

const ProfileDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 0;
`;

const StatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #1f1f2c;
  border-radius: 20px;
  padding: 3rem;
  gap: 1rem;
  height: fit-content;
`;

const StatsWrapper = styled.span`
  display: flex;
  justify-content: space-between;
`;

const StatsTitle = styled.span`
  font-size: 15px;
  font-weight: 400;
  color: #8a8aa0;
`;

const StatsNumber = styled.span`
  font-size: 16px;
  font-weight: 600;
`;

const DisplayName = styled.h2`
  font-size: 38px;
  margin-right: 1rem;
`;

const SuiName = styled.h3`
  font-weight: 500;
  font-size: 20px;
`;

const Bio = styled.div`
  font-size: 16px;
  line-height: 22px;
`;

const WalletAddress = styled.div`
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  background-color: #fff;
  color: #14141f;
  width: max-content;
  height: min-content;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease-in-out;

  :hover {
    color: #fff;
    background-color: #5142fc;
  }
`;

const ProfileHeader = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
  @media only screen and (max-width: 767px) {
    flex-direction: column-reverse;
    align-items: flex-start;
  }
`;

const ProfileLinks = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  @media only screen and (max-width: 767px) {
  }
`;

const SocialsWrapper = styled.ul`
  display: flex;
  gap: 0.75rem;
`;

const SocialsItem = styled.a`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  text-align: center;
  justify-content: center;
  align-items: center;
  display: flex;
  font-size: 20px;
  background-color: #fff;
  color: #14141f;

  :hover {
    color: #fff;
    background-color: #5142fc;
  }
`;

const ProfileUpper = ({ user }) => {
  const { twitter = "1", discord = "1", instagram = "1" } = user;
  const socials = { twitter, discord, instagram };

  const CopyWallet = () => {
    return (
      <WalletAddress>
        <CopyToClipboard
          style={{
            cursor: "pointer",
          }}
          text={user.account_address}
          onCopy={() => ToastPopup("Copied wallet address to clipboard!", "success")}
        >
          <div>
            <i className="fal mr-3 fa-copy"></i>
            {ellipsifyString(user.account_address, 10)}
          </div>
        </CopyToClipboard>
      </WalletAddress>
    );
  };

  const SocialButtons = () => {
    const { twitter, discord, instagram } = socials;
    if (Object.values(socials).every((el) => el === undefined)) return null;

    return (
      <SocialsWrapper>
        {twitter && (
          <li>
            <SocialsItem href={twitter} target="_blank">
              <i className="fab fa-twitter" />
            </SocialsItem>
          </li>
        )}
        {discord && (
          <li>
            <SocialsItem href={discord} target="_blank">
              <i className="fab fa-discord" />
            </SocialsItem>
          </li>
        )}
        {instagram && (
          <li>
            <SocialsItem href={instagram} target="_blank">
              <i className="fab fa-instagram" />
            </SocialsItem>
          </li>
        )}
      </SocialsWrapper>
    );
  };

  return (
    <ProfileDetailsWrapper>
      <ProfileDetails className="col-lg-8 col-md-12">
        <ProfileHeader>
          <DisplayName>{user?.display_name ?? "Unknown"}</DisplayName>
          <ProfileLinks>
            <CopyWallet />
            <SocialButtons />
          </ProfileLinks>
        </ProfileHeader>
        <SuiName>suinameservice.sui</SuiName>
        {user.bio && (
          <Bio>
            {user.bio}
            {/* <ReadMore>{user.bio}</ReadMore> */}
          </Bio>
        )}
      </ProfileDetails>
      <StatsContainer className="col-lg-3 col-md-12">
        <StatsWrapper>
          <StatsTitle>Followers</StatsTitle>
          <StatsNumber>0</StatsNumber>
        </StatsWrapper>
        <StatsWrapper>
          <StatsTitle>Following</StatsTitle>
          <StatsNumber>0</StatsNumber>
        </StatsWrapper>
        <StatsWrapper>
          <StatsTitle>Volume Sold</StatsTitle>
          <StatsNumber>0</StatsNumber>
        </StatsWrapper>
      </StatsContainer>
    </ProfileDetailsWrapper>
  );
};

export default ProfileUpper;
