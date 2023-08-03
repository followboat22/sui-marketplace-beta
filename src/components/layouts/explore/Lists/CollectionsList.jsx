import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ListItemCard from "../../../../components/layouts/collections/ListItemCard";
import CollectionCard from "../../../../components/layouts/CollectionCard";
import CollectionSkeleton from "../../../../components/layouts/CollectionSkeleton";
import { useSearchParams } from "react-router-dom";

const CollectionsList = ({ layout, setCount, setPages }) => {
  const { count, results } = useSelector((state) => state.search.collections);
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
                <CollectionSkeleton />
              </div>
            );
          })
        : results.slice(0, pageSize).map((collection) => (
            <div
              key={collection._id}
              className="fl-item col-xl-3 col-lg-4 col-md-6 col-sm-6"
            >
              <CollectionCard collection={collection} />
            </div>
          ))}
    </div>
  ) : (
    <div className="content-item2">
      {results.slice((page - 1) * pageSize, page * pageSize).map((collection) => (
        <ListItemCard key={collection._id} collection={collection} />
      ))}
    </div>
  );
};

export default CollectionsList;
