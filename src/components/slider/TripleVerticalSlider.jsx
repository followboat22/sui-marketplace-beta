import React from "react";
import { Link } from "react-router-dom";
import { Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/scss";
import "swiper/scss/navigation";
import "swiper/scss/pagination";

import img1 from "../../assets/images/utility-panda.67b2340dbeecff266b98.png";
import img2 from "../../assets/images/utility-panda.67b2340dbeecff266b98.png";
import img3 from "../../assets/images/utility-panda.67b2340dbeecff266b98.png";
import img4 from "../../assets/images/utility-panda.67b2340dbeecff266b98.png";
import img5 from "../../assets/images/utility-panda.67b2340dbeecff266b98.png";
import img6 from "../../assets/images/utility-panda.67b2340dbeecff266b98.png";
import img7 from "../../assets/images/utility-panda.67b2340dbeecff266b98.png";
import img8 from "../../assets/images/utility-panda.67b2340dbeecff266b98.png";
import img9 from "../../assets/images/utility-panda.67b2340dbeecff266b98.png";
import img10 from "../../assets/images/utility-panda.67b2340dbeecff266b98.png";
import img11 from "../../assets/images/utility-panda.67b2340dbeecff266b98.png";
import img12 from "../../assets/images/utility-panda.67b2340dbeecff266b98.png";
import img13 from "../../assets/images/utility-panda.67b2340dbeecff266b98.png";
import img14 from "../../assets/images/utility-panda.67b2340dbeecff266b98.png";
import img15 from "../../assets/images/utility-panda.67b2340dbeecff266b98.png";
import img16 from "../../assets/images/utility-panda.67b2340dbeecff266b98.png";

const TripleVerticalSlider = () => {
  return (
    <div className="home-7">
      <section className="flat-title-page style3 mainslider">
        <div className="overlay"></div>
        <div className="themesflat-container ">
          <div className="wrap-heading flat-slider flex">
            <div className="content">
              <h2 className="heading mt-15">A Reimagined</h2>
              <h1 className="heading mb-style">
                <span className="tf-text s1">NFT Gaming</span>
              </h1>
              <h1 className="heading">Marketplace</h1>
              <p className="sub-heading mt-19 mb-40">
                The Marketplace For Utility Based Collections And All Gaming Digital
                Collectibles
              </p>
              <div className="flat-bt-slider flex style2">
                <Link
                  to="/explore"
                  className="sc-button header-slider style style-1 rocket fl-button"
                >
                  <span>Explore</span>
                </Link>
                <Link
                  to="/mintpad"
                  className="sc-button header-slider style style-1 note fl-button"
                >
                  <span>Mintpads</span>
                </Link>
              </div>
            </div>
            <Swiper
              modules={[Autoplay]}
              direction={"vertical"}
              spaceBetween={25}
              slidesPerView={"auto"}
              loop
              autoplay={{
                delay: 1000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              speed={4200}
            >
              <SwiperSlide>
                <img src={img13} />
              </SwiperSlide>
              <SwiperSlide>
                <img src={img4} />
              </SwiperSlide>
              <SwiperSlide>
                <img src={img1} />
              </SwiperSlide>
              <SwiperSlide>
                <img src={img7} />
              </SwiperSlide>
              <SwiperSlide>
                <img src={img10} />
              </SwiperSlide>
            </Swiper>
            <Swiper
              modules={[Autoplay]}
              direction={"vertical"}
              spaceBetween={25}
              slidesPerView={"auto"}
              loop
              autoplay={{
                delay: 1000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              speed={3600}
            >
              <SwiperSlide>
                <img src={img8} />
              </SwiperSlide>
              <SwiperSlide>
                <img src={img16} />
              </SwiperSlide>
              <SwiperSlide>
                <img src={img5} />
              </SwiperSlide>
              <SwiperSlide>
                <img src={img2} />
              </SwiperSlide>
              <SwiperSlide>
                <img src={img14} />
              </SwiperSlide>
            </Swiper>
            <Swiper
              modules={[Autoplay]}
              direction={"vertical"}
              spaceBetween={25}
              slidesPerView={"auto"}
              loop
              autoplay={{
                delay: 1000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              speed={4800}
            >
              <SwiperSlide>
                <img src={img3} />
              </SwiperSlide>
              <SwiperSlide>
                <img src={img6} />
              </SwiperSlide>
              <SwiperSlide>
                <img src={img9} />
              </SwiperSlide>
              <SwiperSlide>
                <img src={img12} />
              </SwiperSlide>
              <SwiperSlide>
                <img src={img15} />
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TripleVerticalSlider;
