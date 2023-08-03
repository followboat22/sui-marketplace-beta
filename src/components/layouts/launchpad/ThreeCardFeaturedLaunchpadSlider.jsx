import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Autoplay, Navigation, Pagination, Scrollbar } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/scss";
import "swiper/scss/navigation";
import "swiper/scss/pagination";
import { getCollectionImageURL } from "../../../utils/formats";
import FeaturedLaunchpadCountdownCubes from "./details/FeaturedLaunchpadCountdownCubes";
import styled from "styled-components";

const Cube = styled.div`
  background: linear-gradient(rgba(0, 0, 0, 0.24) 0%, rgba(0, 0, 0, 0.12) 100%);
  backdrop-filter: blur(20px);
  min-width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const ContentOuter = styled.div`
  z-index: 11;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  a,
  a:hover {
    color: #fff;
  }
`;
const ContentInner = styled.div`
  height: 100%;
  box-sizing: border-box;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
const ContentTop = styled.div`
  display: flex;
  justify-content: space-between;
`;
const ContentBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
`;
const Icon = styled.i`
  font-size: 24px;
`;
const LaunchpadTitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 1rem;
`;
const LaunchpadTitle = styled.div`
  font-weight: 700;
  font-size: 24px;
  line-height: 1;
  text-transform: uppercase;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 70%;
  color: #fff;
  -webkit-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;

  :hover,
  :hover a {
    color: rgba(255, 255, 255, 0.6);
  }
`;
const LaunchpadDate = styled.h6`
  font-weight: 500;
  font-size: 20px;
  font-family: "Poppins";
  line-height: 1;
  :hover,
  a:hover {
    color: rgba(255, 255, 255, 0.6);
  }
  -webkit-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
`;
const ViewButton = styled.div`
  background: linear-gradient(rgba(0, 0, 0, 0.24) 0%, rgba(0, 0, 0, 0.12) 100%);
  backdrop-filter: blur(20px);
  min-height: 60px;
  padding: 0 2rem;
  border-radius: 12px;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-family: "Poppins";
  font-weight: 600;
  text-transform: uppercase;
  :hover {
    border: none;
    background: #fff;
    color: #000;
  }
  -webkit-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;

  @media ((max-width: 1366px) and (min-width: 768px)) or (max-width: 500px) {
    min-height: 44px;
    border-radius: 8px;
    font-size: 16px;
    padding: 0 1rem;
  }
`;
const LaunchpadItems = styled.span`
  font-size: 16px;
  font-weight: 600;
  font-family: "Poppins";
  line-height: 1;
  text-transform: uppercase;
`;

const ThreeCardFeaturedLaunchpadSlider = ({ featuredData }) => {
  return (
    <div>
      <section className="flat-cart-item home6 style2 mainslider">
        <div className="overlay"></div>
        <div className="themesflat-container">
          <div className="row">
            <div className="col-md-12">
              <Swiper
                modules={[Autoplay, Navigation, Pagination, Scrollbar]}
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
                }}
                navigation
                pagination={{ clickable: true }}
                scrollbar={{ draggable: true }}
                speed={500}
                loop={true}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                }}
              >
                {featuredData.map((item, index) => (
                  <SwiperSlide key={index} className={item.class}>
                    <SliderItem item={item} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const SliderItem = ({ item }) => {
  const date = new Date(item.start_date);
  const stringDate = date.toLocaleString("default", { month: "long", day: "numeric" });
  // eslint-disable-next-line no-undef
  const sale = item?.object?.sales[saleIndex] || {};
  const { count, total } = sale;

  return (
    <div className="swiper-wrapper">
      <div className="swiper-slide">
        <div className="wrap-cart">
          <div className="cart_item style2 style3">
            <div className="inner-cart">
              <div className="overlay"></div>
              <img src={getCollectionImageURL(item.launchpad_collection._id, "logo")} />

              <ContentOuter>
                <Link to={`/mintpad/${item._id}`}>
                  <ContentInner>
                    <ContentTop>
                      <LaunchpadTitleWrapper>
                        <LaunchpadTitle>{item.launchpad_collection.name}</LaunchpadTitle>
                        <LaunchpadDate>{stringDate}</LaunchpadDate>
                        <LaunchpadItems>0 items · 0.01 SUI</LaunchpadItems>
                      </LaunchpadTitleWrapper>
                      <Cube>
                        <Icon className="far fa-bell-on" />
                      </Cube>
                    </ContentTop>
                    <ContentBottom>
                      <FeaturedLaunchpadCountdownCubes launchpad={item} />
                      <ViewButton>View</ViewButton>
                    </ContentBottom>
                  </ContentInner>
                </Link>
              </ContentOuter>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreeCardFeaturedLaunchpadSlider;
