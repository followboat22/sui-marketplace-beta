import React, { useState, useEffect } from "react";
import { Pagination as Paginate, PageItem } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { useWindowSize } from "../../utils/hooks";

const PaginationWrapper = ({ pages, setCurrentPage, currentPage, count, children }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [minVisiblePages, setMinVisiblePages] = useState(5);
  const [maxVisiblePages, setMaxVisiblePages] = useState(9);

  //Calculate media size
  const screenWidth = useWindowSize().width;

  useEffect(() => {
    // TODO: eventually standardize our breakpoints and replace hard-coded pixel values
    if (screenWidth > 991) {
      setMinVisiblePages(5);
      setMaxVisiblePages(9);
    } else if (screenWidth > 575 && screenWidth <= 991) {
      setMinVisiblePages(3);
      setMaxVisiblePages(5);
    } else if (screenWidth <= 575) {
      setMinVisiblePages(2);
      setMaxVisiblePages(3);
    }
  }, [screenWidth]);

  useEffect(() => {
    setCurrentPage(parseInt(searchParams.get("p") || 1));
  }, [searchParams.get("p")]);

  const paginateHandler = (page) => {
    setCurrentPage(parseInt(page));
    searchParams.set("p", page);
    setSearchParams(searchParams);
  };

  useEffect(() => {
    if (searchParams.get("p") > pages) paginateHandler(pages);
  }, [pages]);

  const generatePages = (current, max) => {
    // determine min
    let realMin = Math.max(0, current - minVisiblePages);
    // determine max
    let realMax = Math.min(max, realMin + maxVisiblePages);
    // redetermine min based on max
    if (realMin > realMax - maxVisiblePages) {
      realMin = Math.max(0, realMax - maxVisiblePages);
    }
    let arr = [];
    for (let i = realMin; i < realMax; i++) {
      arr.push(i);
    }
    return arr.map((val) => {
      const pageNum = val + 1;
      return (
        <PageItem
          onClick={() => paginateHandler(pageNum)}
          key={`paginate-${pageNum}`}
          active={pageNum == currentPage}
          activeLabel=""
        >
          {pageNum}
        </PageItem>
      );
    });
  };

  const Paginator = () =>
    pages > 0 && count > 0 ? (
      <Paginate size="lg">
        <PageItem
          onClick={() => paginateHandler(1)}
          disabled={currentPage <= 1}
        >{`<<`}</PageItem>
        <PageItem
          onClick={() => paginateHandler(--currentPage)}
          disabled={currentPage <= 1}
        >{`<`}</PageItem>
        {generatePages(currentPage, pages)}
        <PageItem
          onClick={() => paginateHandler(++currentPage)}
          disabled={currentPage >= pages}
        >{`>`}</PageItem>
        <PageItem
          onClick={() => paginateHandler(pages)}
          disabled={currentPage >= pages}
        >{`>>`}</PageItem>
      </Paginate>
    ) : (
      <div style={{ padding: "49px 0" }} />
    );

  return (
    <>
      <Paginator />
      {children}
      <Paginator />
    </>
  );
};
export default PaginationWrapper;
