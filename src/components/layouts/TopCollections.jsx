import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CollectionRanking from "./CollectionRanking";
import RankingSkeleton from "./RankingSkeleton";
import { getTopCollections } from "../../utils/api";

const TopCollections = () => {
  const [topCollections, setTopCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(async () => {
    setLoading(true);
    const res = await getTopCollections();
    let collectionsData = [];
    if (res.data.data.length < 15) {
      for (let index = res.data.data.length; index < 15; index++) {
        collectionsData.push({});
      }
    }
    collectionsData = [...res.data.data, ...collectionsData];
    setTopCollections(collectionsData);
    setTimeout(() => setLoading(false), 300);
  }, []);

  return (
    <section className="tf-section top-collections">
      <div className="center-margin fullWidth">
        <div className="themesflat-container">
          <div className="row">
            <div className="col-md-12">
              <div className="heading-live-auctions">
                <h2 className="tf-title pb-22 text-left">Top Collections</h2>
                <Link to="/" className="exp style2">
                  EXPLORE MORE
                </Link>
              </div>
            </div>
            <div className="flex-space-between fullWidth">
              <div className="flex flex-column top-collections-column">
                {loading
                  ? Array.from({ length: 15 }, (_, index) => {
                      return (
                        <div
                          key={index}
                          className="fl-item col-sm-12"
                          style={{ maxHeight: "88px" }}
                        >
                          <RankingSkeleton rank={index} />
                        </div>
                      );
                    })
                  : topCollections.slice(0, 15).map((item, index) => (
                      <div
                        key={item._id || index}
                        className="fl-item col-sm-12"
                        style={{ maxHeight: "88px" }}
                      >
                        <CollectionRanking item={item} rank={index} />
                      </div>
                    ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopCollections;
