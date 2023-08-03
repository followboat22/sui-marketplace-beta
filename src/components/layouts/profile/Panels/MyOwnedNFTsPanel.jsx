import React, { useState } from "react";
import { useSelector } from "react-redux";
import MyOwnedNFTsList from "../../../../components/layouts/profile/Lists/MyOwnedNFTsList";
import SearchBar from "../../../../components/layouts/SearchBar";
import PaginationWrapper from "../../../../components/layouts/PaginationWrapper";
import SellModal from "../../../../components/layouts/modal/SellModal";

const MyOwnedNFTsPanel = ({ title }) => {
  const loading = useSelector((state) => state.search.loading);

  const [sellModalShow, setSellModalShow] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState(0);
  const [pages, setPages] = useState(1);

  return (
    <div>
      <div className="option" style={{ gap: "2rem" }}>
        <div className="count-and-search fullWidth">
          <h2 className="item-count">
            {loading ? "..." : count} {title}
          </h2>
          <SearchBar />
        </div>
      </div>
      <PaginationWrapper
        pages={pages}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        count={count}
      >
        <MyOwnedNFTsList
          setSellModalShow={setSellModalShow}
          setCount={setCount}
          setPages={setPages}
        />
      </PaginationWrapper>
      <SellModal
        // handleSubmit={winListing}
        item={sellModalShow}
        onHide={() => setSellModalShow(false)}
      />
    </div>
  );
};

export default MyOwnedNFTsPanel;
