import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import ListItemCard from "./ListItemCard";
import CollectionCard from "../CollectionCard";
import CollectionSkeleton from "../CollectionSkeleton";
import { useSearchParams } from "react-router-dom";

const CollectionItemsList = ({ layout, setCount, setPages }) => {
  const data = useSelector((state) => state.search.collections.results);
  const count = useSelector((state) => state.search.collections.count);
  const pages = useSelector((state) => state.search.collections.pages);
  const loading = useSelector((state) => state.search.loading);
  const pageSize = 20;
  const [params] = useSearchParams();
  const page = params.get("p") || 1;

  useEffect(() => {
    setCount(count);
    pages > 0 && setPages(pages);
  }, [data]);

  return !layout ? (
    <div className="content-item">
      {loading
        ? Array.from({ length: 15 }, (_, index) => {
            return (
              <div key={index} className="col-item">
                <CollectionSkeleton />
              </div>
            );
          })
        : data.slice(0, pageSize).map((collection) => (
            <div key={collection._id} className="col-item">
              <CollectionCard collection={collection} />
            </div>
          ))}
    </div>
  ) : (
    <div className="content-item2">
      {data.slice((page - 1) * pageSize, page * pageSize).map((collection) => (
        <ListItemCard key={collection._id} collection={collection} />
      ))}
    </div>
  );
};

export default CollectionItemsList;
