import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { searchCollections } from "../../redux/state/search";
import CollectionCard from "./CollectionCard";
import CollectionSkeleton from "./CollectionSkeleton";

const PopularCollection = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.search.collections.results);
  const [visible, setVisible] = useState(6);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    dispatch(
      searchCollections({
        review_status: "approved",
        sortParams: { favorites: -1 },
      })
    ).then(() => {
      let timer = setTimeout(() => setLoading(false), 300);
    });
  }, []);

  return (
    <section className="tf-section popular-collections">
      <div className="themesflat-container">
        <div className="row">
          <div className="col-md-12">
            <div className="heading-live-auctions">
              <h2 className="tf-title pb-22 text-left">Popular Collections</h2>
              <Link to="/explore/collections" className="exp style2">
                EXPLORE MORE
              </Link>
            </div>
          </div>
          <div className="col-md-12">
            <div className="row">
              {loading
                ? Array.from({ length: visible }, (_, index) => {
                    return (
                      <div
                        key={index}
                        className="fl-item col-xl-4 col-lg-6 col-md-6 col-sm-6"
                      >
                        <CollectionSkeleton />
                      </div>
                    );
                  })
                : data.slice(0, visible).map((collection) => (
                    <div
                      key={collection._id}
                      className="fl-item col-xl-4 col-lg-6 col-md-6 col-sm-6"
                    >
                      <CollectionCard collection={collection} />
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularCollection;
