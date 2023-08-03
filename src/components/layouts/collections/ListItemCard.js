import React from "react";
import { Link } from "react-router-dom";
import {
  getCollectionImageURL,
  imageOnErrorHandler,
} from "../../../utils/formats";

const ListItemCard = ({ collection, setModalShow }) => {
  return (
    <div className="col-item">
      <div className="sc-card-product menu_card style-h7">
        <div className="wrap-media">
          <div className="card-media">
            <Link to={`/item-details/${collection._id}`}>
              <img
                src={getCollectionImageURL(collection._id, "logo")}
                onError={imageOnErrorHandler}
                alt="Collection"
              />
            </Link>
          </div>
        </div>
        <div className="card-title">
          <p> Collection Name </p>
          <h4>
            <Link to={`/item-details/${collection._id}`}>
              {" "}
              {collection?.name}{" "}
            </Link>
          </h4>
        </div>
        {/* <div className="meta-info style">
                      <p>Creator</p>
                      <div className="author">
                        <div className="avatar">
                          <img src={item.imgAuthor}  />
                        </div>
                        <div className="info">
                          <h4>
                            {" "}
                            <Link to="author02.html">{item.nameAuthor}</Link>{" "}
                          </h4>
                        </div>
                      </div>
                    </div> */}{" "}
        {/* <div className="countdown">
                    <p>Countdown</p>
                    <div className="featured-countdown">
                      <span className="slogan"></span>
                      <Countdown date={Date.now() + 500000000}>
                        <span>You are good to go!</span>
                      </Countdown>
                    </div>
                  </div> */}
        <div className="wrap-hear">
          <button className="wishlist-button heart">
            <span className="number-like"> {collection.wishlist} </span>
          </button>
        </div>{" "}
        {/* <div className="wrap-tag">
                      <div className="tags">{item.tags}</div>
                    </div> */}{" "}
        {/* <div className="meta-info">
                      <div className="author">
                        <div className="info">
                          <p>Current Price</p>
                          <p className="pricing">{item.sale_price} SUI</p>
                        </div>
                      </div>
                    </div> */}{" "}
        {/* <div className="button-place-bid">
                      <button
                        onClick={() => setModalShow(item)}
                        data-toggle="modal"
                        data-target="#popup_bid"
                        className="sc-button style-place-bid style bag fl-button pri-3"
                      >
                        <span>Buy</span>
                      </button>
                    </div> */}{" "}
      </div>
    </div>
  );
};

export default ListItemCard;
