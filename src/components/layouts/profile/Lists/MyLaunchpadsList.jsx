import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import LaunchpadCard from "../../../../components/layouts/launchpad/LaunchpadCard";
import NFTSkeleton from "../../../../components/layouts/NFTSkeleton";
import { useSearchParams } from "react-router-dom";

const MyLaunchpadsList = ({ setCount, setPages }) => {
  const { count, results } = useSelector((state) => state.search.launchpads);
  const loading = useSelector((state) => state.search.loading);
  const [params] = useSearchParams();
  const pageSize = 20;
  const page = params.get("p") || 1;

  useEffect(() => {
    setCount(count);
    count > pageSize && setPages(Math.ceil(count / pageSize));
  }, [count]);

  return (
    <div className="row">
      {loading
        ? Array.from({ length: 15 }, (_, index) => (
            <div key={index} className="fl-item col-xl-3 col-lg-4 col-md-6 col-sm-6">
              <NFTSkeleton />
            </div>
          ))
        : results.slice((page - 1) * pageSize, page * pageSize).map((item) => (
            <div key={item._id} className="fl-item col-xl-3 col-lg-4 col-md-6 col-sm-6">
              <LaunchpadCard my={true} item={item} />
            </div>
          ))}
    </div>
  );
};

export default MyLaunchpadsList;
