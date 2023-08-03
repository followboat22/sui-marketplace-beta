import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ListItemCard from "../../../../components/layouts/explore/ListItemCard";
import NFTCard from "../../../../components/layouts/NFTCard";
import NFTSkeleton from "../../../../components/layouts/NFTSkeleton";
import { useSearchParams } from "react-router-dom";

const MyWonAuctionsList = ({ layout, setModalShow, setCount, setPages }) => {
  const { count, results } = useSelector((state) => state.search.auctions);
  const loading = useSelector((state) => state.search.loading);
  const [params] = useSearchParams();
  const pageSize = 20;
  const page = params.get("p") || 1;

  useEffect(() => {
    setCount(count);
    count > pageSize && setPages(Math.ceil(count / pageSize));
  }, [count]);

  return !layout ? (
    <div className="row">
      {loading
        ? Array.from({ length: 15 }, (_, index) => {
            return (
              <div key={index} className="fl-item col-xl-3 col-lg-4 col-md-6 col-sm-6">
                <NFTSkeleton />
              </div>
            );
          })
        : results?.slice(0, pageSize).map((item) => (
            <div key={item._id} className="fl-item col-xl-3 col-lg-4 col-md-6 col-sm-6">
              <NFTCard
                item={item}
                setModalShow={setModalShow}
                checkWon
                buttonText="Claim"
                alwaysShowButton
              />
            </div>
          ))}
    </div>
  ) : (
    <div className="content-item2">
      {results.slice((page - 1) * pageSize, page * pageSize).map((item) => (
        <ListItemCard
          key={item._id}
          item={item}
          setModalShow={setModalShow}
          checkWon
          buttonText="Claim"
        />
      ))}
    </div>
  );
};

export default MyWonAuctionsList;
