import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logodark from "../../assets/images/logo2.aa87b52bd49c926378c2.png";
import logoicon from "../../assets/images/logo2.aa87b52bd49c926378c2.png";
import logofooter from "../../assets/images/logo2.aa87b52bd49c926378c2.png";
import DarkMode from "../header/DarkMode";
import ToastPopup from "../utils/ToastPopup";
import { emailSubscribe } from "../../utils/api";

const Footer = () => {
  const accountList = [
    {
      title: "Listings",
      link: "/explore",
    },
    {
      title: "Collections",
      link: "/explore/collections",
    },
    {
      title: "Create",
      link: "/create",
    },
  ];
  const resourcesList = [
    {
      title: "Help & Support",
      link: "/help-center",
    },
  ];
  const mintList = [
    {
      title: "Apply for Mintpad",
      link: "https://docs.google.com/forms/d/e/1FAIpQLSdvE9r7iOjhSxTF7aivHdr2xyha8Epj7albYwusPl-rcy3oHQ/viewform?usp=sf_link",
    },
  ];
  const socialList = [
    {
      title: "Twitter",
      icon: "fab fa-twitter",
      link: "https://twitter.com/OnyxMarket",
    },
    {
      title: "Discord",
      icon: "fab fa-discord",
      link: "https://discord.gg/t5zsWfqcNn",
    },
    // {
    //   title: "Telegram",
    //   icon: "fab fa-telegram-plane",
    //   link: "#",
    // },
    // {
    //   title: "Youtube",
    //   icon: "fab fa-youtube",
    //   link: "#",
    // },
  ];

  const [isVisible, setIsVisible] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();

    const email = e.target[0].value;
    emailSubscribe(email)
      .then((res) => {
        ToastPopup("Email subscription successful!", "success");
        setSubscribed(true);
      })
      .catch((e) => {
        ToastPopup("Something went wrong; Please try again!", "error");
        setSubscribed(false);
      });
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div>
      <footer id="footer" className="footer-light-style clearfix bg-style">
        <div className="themesflat-container">
          <div className="row">
            <div className="col-lg-3 col-md-12 col-12">
              <div className="widget widget-logo">
                <div className="logo-footer" id="logo-footer">
                  <Link to="/">
                    <img
                      className="logo-icon"
                      id="logo_icon"
                      src={logoicon}
                      alt="Onyx-panda"
                    />
                    <img
                      className="logo-dark"
                      id="logo_footer"
                      src={logodark}
                      alt="nft-gaming"
                    />
                    <img
                      className="logo-light"
                      id="logo_footer"
                      src={logofooter}
                      alt="nft-gaming"
                    />
                  </Link>
                </div>
                <p className="sub-widget-logo">
                  Onyx blends the space between Web 2.0 and Web 3.0 – ushering in Web
                  2.5.
                </p>
                <div className="widget-social style-1 mg-t32">
                  <ul>
                    {socialList.map((item, index) => (
                      <li key={index}>
                        <a href={item.link}>
                          <i className={item.icon}></i>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* <DarkMode /> */}
              </div>
            </div>
            <div className="col-lg-2 col-md-4 col-sm-5 col-5">
              <div className="widget widget-menu style-1">
                <h5 className="title-widget">Explore</h5>
                <ul>
                  {accountList.map((item, index) => (
                    <li key={index}>
                      <Link to={item.link}>{item.title}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {/* <div className="col-lg-2 col-md-4 col-sm-7 col-7">
              <div className="widget widget-menu style-2">
                <h5 className="title-widget">Resources</h5>
                <ul>
                  {resourcesList.map((item, index) => (
                    <li key={index}>
                      <Link to={item.link}>{item.title}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div> */}
            <div className="col-lg-2 col-md-4 col-sm-5 col-5">
              <div className="widget widget-menu fl-st-3">
                <h5 className="title-widget">Mint</h5>
                <ul>
                  {mintList.map((item, index) => (
                    <li key={index}>
                      <a href={item.link} target="_blank">
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="col-lg-2 col-md-4 col-sm-5 col-5">
              <div className="widget widget-menu fl-st-3">
                <h5 className="title-widget">Socials</h5>
                <ul>
                  {socialList.map((item, index) => (
                    <li key={index}>
                      <a href={item.link}>{item.title}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-7 col-12">
              <div className="widget widget-subcribe">
                <h5 className="title-widget">Get notified</h5>
                {!subscribed ? (
                  <div className="form-subcribe">
                    <form
                      id="subscribe-form"
                      method="POST"
                      acceptCharset="utf-8"
                      className="form-submit"
                      onSubmit={(e) => onSubmit(e)}
                    >
                      <input
                        name="email"
                        className="email"
                        type="email"
                        placeholder="info@yourgmail.com"
                        required
                      />
                      <button id="submit" name="submit" type="submit">
                        <i className="icon-fl-send"></i>
                      </button>
                    </form>
                  </div>
                ) : (
                  <div>
                    <h6>Thanks for subscribing!</h6>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </footer>
      {isVisible && <Link onClick={scrollToTop} to="#" id="scroll-top"></Link>}

      <div
        className="modal fade popup"
        id="popup_bid"
        tabIndex="-1"
        role="dialog"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
            <div className="modal-body space-y-20 pd-40">
              <h3>Place a Bid</h3>
              <p className="text-center">
                You must bid at least <span className="price color-popup">4.89</span>
              </p>
              <input type="text" className="form-control" placeholder="00.00" />
              <p>
                Enter quantity. <span className="color-popup">5 available</span>
              </p>
              <input type="number" className="form-control" placeholder="1" />
              <div className="hr"></div>
              <div className="d-flex justify-content-between">
                <p> You must bid at least:</p>
                <p className="text-right price color-popup"> 4.89 </p>
              </div>
              <div className="d-flex justify-content-between">
                <p> Service free:</p>
                <p className="text-right price color-popup"> 0,89 </p>
              </div>
              <div className="d-flex justify-content-between">
                <p> Total bid amount:</p>
                <p className="text-right price color-popup"> 4 </p>
              </div>
              <Link
                to="#"
                className="btn btn-primary"
                data-toggle="modal"
                data-target="#popup_bid_success"
                data-dismiss="modal"
                aria-label="Close"
              >
                {" "}
                Place a bid
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
