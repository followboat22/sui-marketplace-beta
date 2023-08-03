import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { searchLoading, searchMyBids } from "../../../../redux/state/search";
import { paramsToObject } from "../../../../utils/formats";
import { useDidUpdateEffect, usePrevious } from "../../../../utils/hooks";
import SearchBar from "../../../../components/layouts/SearchBar";
import PaginationWrapper from "../../../../components/layouts/PaginationWrapper";
import LayoutButtons from "../../../../components/layouts/LayoutButtons";
import Sorting from "../../../../components/layouts/Sorting/Sorting";
import RefreshButton from "../../../../components/layouts/RefreshButton";
import MyBidsList from "../Lists/MyBidsList";
import BidModal from "../../../../components/layouts/modal/BidModal";
import { updateListing } from "../../../../utils/api";

const MyBidsPanel = ({ title }) => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.search.loading);

  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState(0);
  const [pages, setPages] = useState(1);
  const [layout, setLayout] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [buyLoading, setBuyLoading] = useState(false);
  const [sortParams, setSortParams] = useState({});
  const [timer, setTimer] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const prevPage = usePrevious(currentPage, false);
  const prevSortParams = usePrevious(sortParams, false);
  const prevSearchParams = usePrevious(searchParams, false);

  const refreshSearch = () => {
    if (timer) {
      clearTimeout(timer);
    }
    const searchAndSortParams = {
      ...sortParams,
      ...paramsToObject(searchParams),
      page: currentPage,
    };
    if (!loading) dispatch(searchLoading(true));

    setTimer(
      setTimeout(() => {
        fetchInfo(searchAndSortParams);
      }, 300)
    );

    return () => {
      clearTimeout(timer);
    };
  };

  const fetchInfo = async (searchAndSortParams) => {
    await dispatch(searchMyBids(searchAndSortParams))
      .then(() => {
        dispatch(searchLoading(false));
      })
      .catch((error) => console.log(error));
  };

  //usePrevious is needed here to prevent useEffect maximum depth when switch from one explore page to another
  useDidUpdateEffect(() => {
    if (
      JSON.stringify(sortParams) !== JSON.stringify(prevSortParams) ||
      currentPage !== prevPage ||
      searchParams !== prevSearchParams
    ) {
      refreshSearch();
    }
  }, [sortParams, currentPage, searchParams]);

  const handleHideModal = () => {
    setBuyLoading(false);
    setModalShow(false);
  };

  const onBid = (item) => {
    updateListing(item._id);
  };

  return (
    <div>
      <div className="option" style={{ gap: "2rem" }}>
        <div className="count-and-search fullWidth">
          <h2 className="item-count">
            {loading ? "..." : count} {title}
          </h2>
          <SearchBar />
        </div>
        <div className="view">
          <div className="flex">
            <RefreshButton refreshHandler={refreshSearch} />
            <LayoutButtons layout={layout} setLayout={setLayout} />
          </div>
          <Sorting setSortParams={setSortParams} />
        </div>
      </div>
      <PaginationWrapper
        pages={pages}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        count={count}
      >
        <MyBidsList
          layout={layout}
          setModalShow={setModalShow}
          setCount={setCount}
          setPages={setPages}
        />
      </PaginationWrapper>
      <BidModal
        onBid={onBid}
        buyLoading={buyLoading}
        item={modalShow}
        onHide={() => handleHideModal()}
      />
    </div>
  );
};

export default MyBidsPanel;
