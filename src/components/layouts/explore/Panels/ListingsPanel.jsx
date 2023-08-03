import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { searchLoading, searchListings } from "../../../../redux/state/search";
import { paramsToObject } from "../../../../utils/formats";
import { useDidUpdateEffect, usePrevious } from "../../../../utils/hooks";
import { updateListing } from "../../../../utils/api";
import SearchBar from "../../../../components/layouts/SearchBar";
import PaginationWrapper from "../../../../components/layouts/PaginationWrapper";
import LayoutButtons from "../../../../components/layouts/LayoutButtons";
import Sorting from "../../../../components/layouts/Sorting/Sorting";
import RefreshButton from "../../../../components/layouts/RefreshButton";
import ListingsList from "../Lists/ListingsList";
import BuyModal from "../../../../components/layouts/modal/BuyModal";
import { useSidebar } from "../../../../components/utils/SidebarProvider";
import { REMOVE_LISTINGS_SEARCH_RESULTS } from "../../../../redux/types";

const ListingsPanel = ({ title }) => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.search.loading);
  const settings = useSelector((state) => state.settings);
  const { sidebarData, setSidebarData } = useSidebar();

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

  useEffect(() => {
    if (settings) {
      const tags = settings.tags.map((tag) => {
        return tag.name;
      });
      const newSidebarData = [
        {
          title: "Categories",
          name: "collection.tags",
          content: {},
        },
        {
          title: "Price",
          name: "sale_price",
          content: {
            type: "number",
          },
        },
      ];
      newSidebarData[0] = {
        ...newSidebarData[0],
        content: { name: newSidebarData[0].title, type: "select", values: tags },
      };
      setSidebarData(newSidebarData);
    }
  }, [settings]);

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
    await dispatch(searchListings(searchAndSortParams))
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

  const onBuy = (item) => {
    if (item?.sale_type === "sale") {
      dispatch({ type: REMOVE_LISTINGS_SEARCH_RESULTS, id: item._id });
    }
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
        <ListingsList
          layout={layout}
          setModalShow={setModalShow}
          setCount={setCount}
          setPages={setPages}
        />
      </PaginationWrapper>
      <BuyModal
        onBuy={onBuy}
        item={modalShow}
        setModalShow={setModalShow}
        beforeSetListing={refreshSearch}
        onHide={() => setModalShow(false)}
      />
    </div>
  );
};

export default ListingsPanel;
