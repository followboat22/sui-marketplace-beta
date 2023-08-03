import React from "react";
import { ReactComponent as SearchSVG } from "../../assets/images/icon/search.svg";
import { useSearchParams } from "react-router-dom";

const SearchBar = () => {
  const SEARCHNAME_PARAM = "searchName";
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("searchName");

  const onChange = (e) => {
    const query = e.target.value;
    if (query) {
      searchParams.set(SEARCHNAME_PARAM, query);
    } else {
      searchParams.delete(SEARCHNAME_PARAM);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="header_2 fullWidth">
      <div className="question-form header_2">
        <form action="#" method="get">
          <input
            onChange={onChange}
            value={searchQuery || ""}
            type="text"
            placeholder="Type to search..."
            required
          />
          <SearchSVG />
        </form>
      </div>
    </div>
  );
};

export default SearchBar;
