import React from "react";
import { Link } from "react-router-dom";
import icon1 from "../../assets/images/img_slide1.90e0c73cf896172e8dde.png";
import icon2 from "../../assets/images/img_slide1.90e0c73cf896172e8dde.png";
import icon3 from "../../assets/images/img_slide1.90e0c73cf896172e8dde.png";
import icon4 from "../../assets/images/img_slide1.90e0c73cf896172e8dde.png";

const CreateAndSell = () => {
  const data = [
    {
      title: "Set Up Your Wallet",
      description:
        "Easy, Free, and Fast! Set up your Onyx wallet using social logins!",
      icon: icon1,
      colorbg: "icon-color1",
    },
    {
      title: "Create Your Collection",
      description:
        "Join the many to create your own NFT collection on Onyx. With Onyx, it's easy and fast. From fine art to fashion, Onyx is the ultimate destination for NFT collectors.",
      icon: icon2,
      colorbg: "icon-color2",
    },
    {
      title: "Add Your NFTs",
      description:
        "Our marketplace is built on the Sui blockchain, making it the most secure and reliable place to buy and sell NFTs. Add your NFTs to the marketplace and get started.",
      icon: icon3,
      colorbg: "icon-color3",
    },
    {
      title: "List And Trade Your NFTs",
      description:
        "Trade your NFTs with the entire community!  We’re the most user-friendly nft marketplace out there. Our intuitive interface makes it easy to find and trade the right nfts for you.",
      icon: icon4,
      colorbg: "icon-color4",
    },
  ];
  return (
    <section className="tf-box-icon create style1 tf-section">
      <div className="themesflat-container">
        <div className="row">
          <div className="col-md-12">
            <div className="heading-live-auctions mg-bt-22">
              <h2 className="tf-title pb-17">Create And Sell Your NFTs</h2>
            </div>
          </div>
          {data.map((item, index) => (
            <CreateItem key={index} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

const CreateItem = (props) => (
  <div className="col-lg-3 col-md-6 col-12">
    <div className="sc-box-icon">
      <div className="image">
        <div className={`icon-create ${props.item.colorbg}`}>
          <img src={props.item.icon} alt="" />
        </div>
      </div>
      <h3 className="heading">
        <span>{props.item.title}</span>
      </h3>
      <p className="content">{props.item.description}</p>
    </div>
  </div>
);

export default CreateAndSell;
