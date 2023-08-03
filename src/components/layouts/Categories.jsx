import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";

import "swiper/scss";
import "swiper/scss/navigation";
import "swiper/scss/pagination";
import img1 from "../../assets/images/arcade-panda.6d45b60f713a1bdfd905.png";
import img2 from "../../assets/images/arcade-panda.6d45b60f713a1bdfd905.png";
import img3 from "../../assets/images/arcade-panda.6d45b60f713a1bdfd905.png";
import img4 from "../../assets/images/arcade-panda.6d45b60f713a1bdfd905.png";
import img5 from "../../assets/images/arcade-panda.6d45b60f713a1bdfd905.png";
import img6 from "../../assets/images/arcade-panda.6d45b60f713a1bdfd905.png";
import img7 from "../../assets/images/arcade-panda.6d45b60f713a1bdfd905.png";
import img8 from "../../assets/images/arcade-panda.6d45b60f713a1bdfd905.png";
import img9 from "../../assets/images/arcade-panda.6d45b60f713a1bdfd905.png";

const Categories = () => {
  const [data] = useState([
    {
      title: "Utility",
      img: img1,
      tag: "Utility",
    },
    {
      title: "Digital Art",
      img: img2,
      tag: "Art",
    },
    {
      title: "Gaming",
      img: img3,
      tag: "Gaming",
    },
    {
      title: "Trading Cards",
      img: img4,
      tag: "Trading Cards",
    },
    {
      title: "Collectibles",
      img: img5,
      tag: "Collectibles",
    },
    {
      title: "Photography",
      img: img6,
      tag: "Photography",
    },
    {
      title: "Domain Names",
      img: img7,
      tag: "Domain Names",
    },
    {
      title: "Sports",
      img: img8,
      tag: "Sports",
    },
    {
      title: "Virtual Worlds",
      img: img9,
      tag: "Virtual Worlds",
    },
  ]);
  return (
    <section className="tf-section category">
      <div className="themesflat-container">
        <div className="row">
          <div className="col-md-12">
            <div className="heading-live-auctions">
              <h2 className="tf-title pb-39">All Categories</h2>
            </div>
          </div>
          <div className="col-md-12">
            <Swiper
              modules={[Navigation, Pagination, Scrollbar, A11y]}
              spaceBetween={25}
              breakpoints={{
                0: {
                  slidesPerView: 2,
                },
                494: {
                  slidesPerView: 3,
                },
                767: {
                  slidesPerView: 4,
                },
                991: {
                  slidesPerView: 6,
                },
              }}
              navigation
              pagination={{ clickable: true }}
              scrollbar={{ draggable: true }}
            >
              {data.map((item, index) => (
                <SwiperSlide key={index}>
                  <CategoryItem item={item} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
};
const CategoryItem = ({ item }) => (
  <div className="swiper-container carousel11">
    <div className="swiper-wrapper">
      <div className="swiper-slide">
        <div className="slider-item">
          <div className="sc-category">
            <div className="card-media">
              <Link to="/explore">
                <img src={item.img} alt="Axies" />
              </Link>
            </div>
            <div className="card-title">
              <Link to="/explore">
                <h4>{item.title}</h4>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Categories;
