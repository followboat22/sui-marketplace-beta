import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { searchLoading, searchWonAuctions } from "../../../../redux/state/search";
import MyWonAuctionsList from "../../../../components/layouts/profile/Lists/MyWonAuctionsList";
import SearchBar from "../../../../components/layouts/SearchBar";
import PaginationWrapper from "../../../../components/layouts/PaginationWrapper";
import LayoutButtons from "../../../../components/layouts/LayoutButtons";
import Sorting from "../../../../components/layouts/Sorting/Sorting";
import RefreshButton from "../../../../components/layouts/RefreshButton";
import { paramsToObject } from "../../../../utils/formats";
import { useDidUpdateEffect, usePrevious } from "../../../../utils/hooks";
import { winNFTAuction } from "../../../../web3/sui";
import { WIN_LISTING } from "../../../../redux/types";
import WinModal from "../../../../components/layouts/modal/WinModal";
import { updateListing } from "../../../../utils/api";
import { sleep } from "../../../../utils/time";

const MyWonAuctionsPanel = ({ title }) => {
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
    await dispatch(searchWonAuctions(searchAndSortParams))
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

  useEffect(() => {
    refreshSearch();
  }, []);

  const winListing = async (item) => {
    setBuyLoading(true);
    const res = await winNFTAuction(item);
    if (res.effects?.status?.status === "success") {
      await sleep();
      await updateListing(item._id);
      dispatch({ type: WIN_LISTING, _id: item._id });
      setBuyLoading(false);
      setModalShow(false);
    } else {
      setBuyLoading(false);
    }
  };

  const handleHideModal = () => {
    setBuyLoading(false);
    setModalShow(false);
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
          {/* <Sorting setSortParams={setSortParams} /> */}
        </div>
      </div>
      <PaginationWrapper
        pages={pages}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        count={count}
      >
        <MyWonAuctionsList
          layout={layout}
          setModalShow={setModalShow}
          setCount={setCount}
          setPages={setPages}
        />
      </PaginationWrapper>
      <WinModal
        handleSubmit={winListing}
        item={modalShow}
        onHide={() => handleHideModal()}
        buyLoading={buyLoading}
      />
    </div>
  );
};

export default MyWonAuctionsPanel;
