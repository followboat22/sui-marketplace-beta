import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { searchAuctions } from "../../redux/state/search";
import { useDispatch, useSelector } from "react-redux";
import NFTCard from "./NFTCard";
import BidModal from "./modal/BidModal";
import { updateListing } from "../../utils/api";

const LiveAuction = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.search.auctions.results);

  useEffect(() => {
    dispatch(searchAuctions({ sortParams: { sale_price: 1 } }));
  }, []);

  const [modalShow, setModalShow] = useState(false);
  const [visible, setVisible] = useState(8);
  const showMoreItems = () => {
    setVisible((prevValue) => prevValue + 4);
  };

  const onBid = (item) => {
    updateListing(item._id);
  };

  return (
    <section className="tf-section live-auctions">
      <div className="themesflat-container">
        <div className="row">
          <div className="col-md-12">
            <div className="heading-live-auctions">
              <h2 className="tf-title pb-22 text-left">Live Auctions</h2>
              <Link to="/explore/auctions" className="exp style2">
                EXPLORE MORE
              </Link>
            </div>
          </div>

          {data.slice(0, visible).map((item) => (
            <div key={item._id} className="fl-item col-xl-3 col-lg-6 col-md-6 col-sm-6">
              <NFTCard item={item} setModalShow={setModalShow} />
            </div>
          ))}
          {visible < data.length && (
            <div className="col-md-12 wrap-inner load-more text-center">
              <Link
                to="#"
                id="load-more"
                className="sc-button loadmore fl-button pri-3"
                onClick={showMoreItems}
              >
                <span>Load More</span>
              </Link>
            </div>
          )}
        </div>
      </div>
      <BidModal
        onBid={onBid}
        item={modalShow}
        setModalShow={setModalShow}
        onHide={() => setModalShow(false)}
      />
    </section>
  );
};

export default LiveAuction;
