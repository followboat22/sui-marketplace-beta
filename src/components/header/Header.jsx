import { useRef, useState, useEffect } from "react";
import { EthosConnectStatus, ethos } from "ethos-connect";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import logoheader from "../../assets/images/logo2.aa87b52bd49c926378c2.png";
import logoicon from "../../assets/images/logo2.aa87b52bd49c926378c2.png";
import logoheader2x from "../../assets/images/logo2.aa87b52bd49c926378c2.png";
import logodark from "../../assets/images/logo2.aa87b52bd49c926378c2.png";
import logodark2x from "../../assets/images/logo2.aa87b52bd49c926378c2.png";
import { SignInButton } from "ethos-connect";
import AutocompleteSearchBar from "../layouts/AutocompleteSearchBar";
import HeaderProfile from "./HeaderProfile";
import MainNav from "./MainNav";
import LoadingSpinner from "../utils/LoadingSpinner";
import DarkMode from "./DarkMode";
import NotificationCenter from "../NotificationCenter/NotificationCenter";
import ResetBanner from "./ResetBanner";

const Header = () => {
  const { pathname } = useLocation();
  const user = useSelector((state) => state.user);
  const wallet = ethos.useWallet();

  const headerRef = useRef(null);
  useEffect(() => {
    window.addEventListener("scroll", isSticky);
    return () => {
      window.removeEventListener("scroll", isSticky);
    };
  });
  const isSticky = (e) => {
    const header = document.querySelector(".js-header");
    const scrollTop = window.scrollY;
    scrollTop >= 300
      ? header.classList.add("is-fixed")
      : header.classList.remove("is-fixed");
    scrollTop >= 400
      ? header.classList.add("is-small")
      : header.classList.remove("is-small");
  };

  const menuLeft = useRef(null);
  const btnToggle = useRef(null);

  const menuToggle = () => {
    menuLeft.current.classList.toggle("active");
    btnToggle.current.classList.toggle("active");
  };

  const [profile, toggleProfile] = useState(false);

  const [activeIndex, setActiveIndex] = useState(null);
  const handleOnClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <header
      id="header_main"
      className="header_1 js-header flex align-items-center"
      ref={headerRef}
    >
      <div
        className={`avatar_popup_bg ${profile ? "visible" : ""}`}
        onClick={() => toggleProfile(false)}
      ></div>
      <div className="themesflat-container">
        <div className="row">
          <div className="col-md-12">
            <div id="site-header-inner">
              <div
                className="flex justify-content-between align-items-center"
                style={{ gap: "1rem", height: "104px" }}
              >
                <div className="min-width-max-content">
                  <Link to="/" rel="home" className="main-logo">
                    <img
                      className="logo-icon"
                      id="logo_icon"
                      src={logoicon}
                      alt="Onyx-panda"
                    />
                    <img
                      className="logo-dark hidden-xs-down"
                      id="logo_header"
                      src={logodark}
                      srcSet={`${logodark2x}`}
                      alt="nft-gaming"
                    />
                    <img
                      className="logo-light hidden-xs-down"
                      id="logo_header"
                      src={logoheader}
                      srcSet={`${logoheader2x}`}
                      alt="nft-gaming"
                    />
                  </Link>
                </div>
                <AutocompleteSearchBar />
                <MainNav
                  menuLeft={menuLeft}
                  handleOnClick={handleOnClick}
                  pathname={pathname}
                  activeIndex={activeIndex}
                />
                <div className="flat-search-btn flex min-width-max-content">
                  {!user._id || wallet.status !== EthosConnectStatus.Connected ? (
                    wallet.status !== EthosConnectStatus.Loading ? (
                      <SignInButton>Connect</SignInButton>
                    ) : (
                      <div className="center-margin">
                        <LoadingSpinner size="medium" />
                      </div>
                    )
                  ) : (
                    <>
                      <HeaderProfile toggleProfile={toggleProfile} profile={profile} />
                      <NotificationCenter />
                    </>
                  )}
                  <DarkMode />
                  <div className="mobile-button" ref={btnToggle} onClick={menuToggle}>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ResetBanner />
    </header>
  );
};

export default Header;
