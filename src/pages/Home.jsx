import React from "react";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import TripleVerticalSlider from "../components/slider/TripleVerticalSlider";
import LiveAuction from "../components/layouts/LiveAuction";
import PopularCollection from "../components/layouts/PopularCollection";
import CreateAndSell from "../components/layouts/CreateAndSell";
import TopCollections from "../components/layouts/TopCollections";
import Categories from "../components/layouts/Categories";

const Home = () => {
  return (
    <div className="home-1">
      <Header />
      <TripleVerticalSlider />
      <Categories />
      <LiveAuction />
      <TopCollections />
      <PopularCollection />
      <CreateAndSell />
      <Footer />
    </div>
  );
};

export default Home;
