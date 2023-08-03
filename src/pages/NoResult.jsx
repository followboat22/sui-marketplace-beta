import React, { useState } from "react";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import { Link } from "react-router-dom";
import liveAuctionData from "../assets/images/arcade-panda.6d45b60f713a1bdfd905.png";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import Countdown from "react-countdown";
import PageHeader from "../components/layouts/PageHeader";
import BidModal from "../components/layouts/modal/BidModal";

const NoResult = () => {
  const [data] = useState(liveAuctionData);
  const [modalShow, setModalShow] = useState(false);
  return (
    <div>
      <Header />

      <PageHeader />

      <section className="tf-no-result tf-section">
        <div className="themesflat-container">
          <div className="row">
            <div className="col-12">
              <h2 className="tf-title-heading ct style-2 mg-bt-10">
                Sorry, We Couldn’t Find That Page.
              </h2>
            </div>
          </div>
        </div>
      </section>
      <section className="tf-section live-auctions result">
        <div className="themesflat-container">
          <div className="row">
            <div className="col-md-12">
              <h2 className="tf-title">Live Auctions</h2>
              <div className="heading-line"></div>
            </div>
            <div className="col-md-12">
              <Swiper
                modules={[Navigation, Pagination, Scrollbar, A11y]}
                spaceBetween={30}
                breakpoints={{
                  0: {
                    slidesPerView: 1,
                  },
                  767: {
                    slidesPerView: 2,
                  },
                  991: {
                    slidesPerView: 3,
                  },
                  1300: {
                    slidesPerView: 4,
                  },
                }}
                navigation
                pagination={{ clickable: true }}
                scrollbar={{ draggable: true }}
              >
                {data.slice(0, 7).map((item, index) => (
                  <SwiperSlide key={index}>
                    <div className="swiper-container show-shadow carousel auctions">
                      <div className="swiper-wrapper">
                        <div className="swiper-slide">
                          <div className="slider-item">
                            <div className="sc-card-product">
                              <div className="card-media">
                                <Link to="/item-details">
                                  <img src={item.img} />
                                </Link>
                                <Link to="/login" className="wishlist-button heart">
                                  <span className="number-like">{item.wishlist}</span>
                                </Link>
                                <div className="featured-countdown">
                                  <span className="slogan"></span>
                                  <Countdown date={Date.now() + 500000000}>
                                    <span>You are good to go!</span>
                                  </Countdown>
                                </div>
                                <div className="button-place-bid">
                                  <button
                                    onClick={() => setModalShow(true)}
                                    className="sc-button style-place-bid style bag fl-button pri-3 fullWidth"
                                  >
                                    <span>Place Bid</span>
                                  </button>
                                </div>
                              </div>
                              <div className="card-title">
                                <h5>
                                  <Link to="/item-details">{item.title}</Link>
                                </h5>
                                <div className="tags">{item.tags}</div>
                              </div>
                              <div className="meta-info">
                                <div className="author">
                                  <div className="avatar">
                                    <img src={item.imgAuthor} />
                                  </div>
                                  <div className="info">
                                    <span>Creator</span>
                                    <h6>
                                      {" "}
                                      <Link to="/creators">{item.nameAuthor}</Link>{" "}
                                    </h6>
                                  </div>
                                </div>
                                <div className="price">
                                  <span>Current Bid</span>
                                  <h5> {item.price} SUI</h5>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </section>
      <BidModal show={modalShow} onHide={() => setModalShow(false)} />
      <Footer />
    </div>
  );
};
export default NoResult;
