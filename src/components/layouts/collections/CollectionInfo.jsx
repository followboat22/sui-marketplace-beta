import React from "react";
import { Link } from "react-router-dom";
import SocialButtons from "../../button/SocialButtons";
import {
  getCollectionImageURL,
  imageOnErrorHandler,
  mystToSui,
  statusToEffect,
} from "../../../utils/formats";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import creatorBackground from "../../../assets/images/arcade-panda.6d45b60f713a1bdfd905.png";
import LazyLoadImage from "../LazyLoadImage";
import { SuiExplorer } from "../../../utils/environments";
import CreatedBy from "../../../components/utils/CreatedBy";

const CollectionInfo = ({ data }) => {
  const user = useSelector((state) => state.user);
  const {
    creator,
    name,
    description,
    _id,
    object_id,
    volume,
    total_sales,
    nft_count,
    owners,
    listed,
    floor,
    review_status,
    twitter,
    discord,
    instagram,
    whitepaper,
    website,
  } = data;
  const socials = { twitter, discord, instagram };
  const isCreator = useMemo(() => {
    return user && creator ? creator._id === user._id : false;
  }, [user, creator]);
  return (
    <section className="tf-section collection-info">
      <div className="themesflat-container">
        <div className="tab-collections">
          <div className="collection-banner">
            <div className="dark-overlay" />
            <LazyLoadImage
              className="collection-banner-bg"
              src={getCollectionImageURL(_id)}
              fallback={creatorBackground}
            />
            <div className="collection-banner-contents flex">
              <div style={{ position: "relative" }}>
                <img
                  src={getCollectionImageURL(_id, "logo")}
                  onError={imageOnErrorHandler}
                  className="featured-image"
                />

                {isCreator && (
                  <div className="ps-abs-bmdl">
                    <span
                      className={`sc-status ${statusToEffect(review_status)} capitalize`}
                    >
                      {review_status}
                    </span>
                  </div>
                )}
              </div>
              <div className="info-profile">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "2rem",
                  }}
                >
                  <div>
                    <h2 className="title">{name ?? "My Collection"}</h2>

                    <div className="collection-author">
                      <div className="author">
                        <div className="content">
                          <div className="info">
                            <span>Created by</span>
                            <span className="name">
                              <CreatedBy creator={creator} />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="content">
                  {description ??
                    "Lorem ipsum dolor sit amet, consectetur adipisicing elit."}
                </p>
                <br />
                <a
                  className="heading"
                  href={`${SuiExplorer}/objects/${object_id}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <h5 className="tf-text fill">View on SuiExplorer</h5>
                </a>

                {isCreator && <Link to={`/edit-collection/${_id}`}>Edit Collection</Link>}
              </div>
              <div className="collection-stats">
                <SocialButtons socials={socials} />
                <div className="grid-container">
                  <GridCard title="FLOOR" value={`${mystToSui(floor)} SUI`} />
                  <GridCard title="LISTED" value={listed} />
                  <GridCard title="TOTAL VOL" value={`${mystToSui(volume)} SUI`} />
                  <GridCard
                    title="AVG. SALE"
                    value={`${mystToSui(volume) / (total_sales || 1)} SUI`}
                  />
                  <GridCard title="OWNERS" value={owners} />
                  <GridCard title="TOTAL SUPPLY" value={nft_count} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const GridCard = ({ title, value }) => {
  return (
    <div className="grid-item">
      <div className="grid-item">
        <span className="title">{title}</span>
      </div>
      <div className="grid-item">
        <span className="value">{value}</span>
      </div>
    </div>
  );
};

export default CollectionInfo;
