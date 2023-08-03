import React from "react";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import PageHeader from "../components/layouts/PageHeader";
import CreateButton from "../components/button/CreateButton";
import NFTIcon from "../assets/images/img_slide1.90e0c73cf896172e8dde.png";
import ListIcon from "../assets/images/img_slide1.90e0c73cf896172e8dde.png";
import CollectionIcon from "../assets/images/img_slide1.90e0c73cf896172e8dde.png";

const Create = () => {
  return (
    <div>
      <Header />
      <PageHeader />
      <div className="tf-list-item tf-section pt-20">
        <div className="themesflat-container">
          <div className="row">
            <div className="modal-body">
              <div className="createFlex">
                <div className="createButtonFlex">
                  <div className="createFlex">
                    <h2>Create and Sell</h2>
                    <div className="createButtonFlex">
                      <CreateButton
                        icon={CollectionIcon}
                        title="Create Collection"
                        description="Create a new NFT Collection to hold your NFTs"
                        link="/create-collection"
                      />
                      <CreateButton
                        icon={NFTIcon}
                        title="Create NFT"
                        description="Create and mint a brand new NFT"
                        link="/create-nft"
                      />
                      <CreateButton
                        icon={ListIcon}
                        title="Sell or Loan Existing"
                        description="Sell or Loan existing NFTs directly from your wallet"
                        link="/profile/owned-nfts"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Create;
