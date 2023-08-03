import { useSelector } from "react-redux";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import "react-tabs/style/react-tabs.css";
import styled from "styled-components";
import { getUserImageURL } from "../utils/formats";
import LazyLoadImage from "../components/layouts/LazyLoadImage";
import ProfileTabs from "../components/layouts/ProfileTabs";
import ProfileUpper from "../components/layouts/profile/ProfileUpper";

import bg1 from "../assets/images/computer-panda.6597d09c0ecee8abaf89.png";
import bg2 from "../assets/images/computer-panda.6597d09c0ecee8abaf89.png";
import bg3 from "../assets/images/computer-panda.6597d09c0ecee8abaf89.png";
import bg4 from "../assets/images/computer-panda.6597d09c0ecee8abaf89.png";

const BannerWrapper = styled.div`
  padding-top: 100px;
  position: relative;
`;

const BannerImage = styled.img`
  position: absolute;
  top: 0;
  width: 100%;
  object-fit: cover;
  height: 100%;
`;

const BannerShadow = styled.div`
  background-image: linear-gradient(to bottom, #181a20aa, transparent);
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

const ProfileImageWrapper = styled.div`
  height: 200px;
  width: 200px;
  @media only screen and (max-width: 991px) {
    height: 140px;
    width: 140px;
  }
`;

const MyProfile = () => {
  const user = useSelector((state) => state.user);
  const banners = [bg1, bg2, bg3, bg4];

  return (
    <div className="my-profile">
      <Header />
      <BannerWrapper>
        <BannerShadow />
        <BannerImage src={banners[user.banner] ?? getUserImageURL(user._id, "banner")} />
        <div className="themesflat-container">
          <ProfileImageWrapper>
            <LazyLoadImage
              className="profile-image"
              src={getUserImageURL(user._id, "avatar")}
              fallback={`https://gravatar.com/avatar/${user._id}?f=y&d=identicon&size=200`}
            />
          </ProfileImageWrapper>
        </div>
      </BannerWrapper>
      <section className="tf-section tf-my-items">
        <div className="themesflat-container">
          <div className="row justify-content-center">
            <div className="col-12 my-items">
              <ProfileUpper user={user} />
              <ProfileTabs />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default MyProfile;
