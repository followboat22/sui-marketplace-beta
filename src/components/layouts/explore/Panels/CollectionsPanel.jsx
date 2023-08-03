import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { searchLoading, searchCollections } from "../../../../redux/state/search";
import { paramsToObject } from "../../../../utils/formats";
import { useDidUpdateEffect, usePrevious } from "../../../../utils/hooks";
import SearchBar from "../../../../components/layouts/SearchBar";
import PaginationWrapper from "../../../../components/layouts/PaginationWrapper";
import LayoutButtons from "../../../../components/layouts/LayoutButtons";
import Sorting from "../../../../components/layouts/Sorting/Sorting";
import RefreshButton from "../../../../components/layouts/RefreshButton";
import CollectionsList from "../Lists/CollectionsList";
import { useSidebar } from "../../../../components/utils/SidebarProvider";

const CollectionsPanel = ({ title }) => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.search.loading);
  const { sidebarData, setSidebarData } = useSidebar();

  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState(0);
  const [pages, setPages] = useState(1);
  const [layout, setLayout] = useState(false);
  const [sortParams, setSortParams] = useState({});
  const [timer, setTimer] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const prevPage = usePrevious(currentPage, false);
  const prevSortParams = usePrevious(sortParams, false);
  const prevSearchParams = usePrevious(searchParams, false);

  useEffect(() => {
    setSidebarData([]);
  }, []);

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
    await dispatch(searchCollections(searchAndSortParams))
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
        <CollectionsList layout={layout} setCount={setCount} setPages={setPages} />
      </PaginationWrapper>
    </div>
  );
};

export default CollectionsPanel;
