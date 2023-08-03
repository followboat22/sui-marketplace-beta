import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/scss";
import "swiper/scss/navigation";
import "swiper/scss/pagination";

const ThreeCardFeaturedLaunchpadSkeleton = () => {
  return (
    <div>
      <section className="flat-cart-item home6 style2 mainslider">
        <div className="overlay"></div>
        <div className="themesflat-container">
          <div className="row">
            <div className="col-md-12">
              <Swiper
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
              >
                <SwiperSlide key="skeleton1">
                  <SliderItem />
                </SwiperSlide>
                <SwiperSlide key="skeleton2">
                  <SliderItem />
                </SwiperSlide>
                <SwiperSlide key="skeleton3">
                  <SliderItem />
                </SwiperSlide>
              </Swiper>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const SliderItem = () => {
  return (
    <div className="swiper-wrapper">
      <div className="swiper-slide">
        <div className="wrap-cart">
          <div className="cart_item style2 style3">
            <div className="inner-cart">
              <Skeleton style={{ aspectRatio: "1" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ThreeCardFeaturedLaunchpadSkeleton;
