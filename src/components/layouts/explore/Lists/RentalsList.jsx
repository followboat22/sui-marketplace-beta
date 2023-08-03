import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ListItemCard from "../ListItemCard";
import RentalCard from "../../../../components/cards/grid/RentalCard";
import NFTSkeleton from "../../NFTSkeleton";

const RentalsList = ({ layout, setModalShow, setCount, setPages }) => {
  const data = useSelector((state) => state.search.lendings.results);
  const count = useSelector((state) => state.search.lendings.count);
  const pages = useSelector((state) => state.search.lendings.pages);
  const loading = useSelector((state) => state.search.loading);

  useEffect(() => {
    setCount(count);
    pages > 0 && setPages(pages);
  }, [data]);

  const [visible, setVisible] = useState(50);

  return !layout ? (
    <div className="content-item">
      {loading
        ? Array.from({ length: 15 }, (_, index) => {
            return (
              <div key={index} className="col-item">
                <NFTSkeleton />
              </div>
            );
          })
        : data.slice(0, visible).map((item, key) => (
            <div key={item._id} className="col-item">
              <RentalCard item={item} setModalShow={setModalShow} />
            </div>
          ))}
    </div>
  ) : (
    <div className="content-item2">
      {data.slice(0, visible).map((item, index) => (
        <ListItemCard key={index} item={item} setModalShow={setModalShow} />
      ))}
    </div>
  );
};

export default RentalsList;
