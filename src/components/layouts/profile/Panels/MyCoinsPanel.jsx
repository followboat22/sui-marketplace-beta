import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import MyCoins from "../../../../components/layouts/profile/Lists/MyCoins";
import { usePrevious } from "../../../../utils/hooks";

const MyCoinsPanel = ({ title }) => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.search.loading);

  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState(0);
  const [pages, setPages] = useState(1);
  const [layout, setLayout] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [sortParams, setSortParams] = useState({});
  const [timer, setTimer] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const prevPage = usePrevious(currentPage, false);
  const prevSortParams = usePrevious(sortParams, false);
  const prevSearchParams = usePrevious(searchParams, false);

  return (
    <div>
      <div className="option" style={{ gap: "2rem" }}>
        <div className="count-and-search fullWidth">
          <h2 className="item-count">
            {loading ? "..." : count} {title}
          </h2>
        </div>
      </div>
      <MyCoins setCount={setCount} />
    </div>
  );
};

export default MyCoinsPanel;
