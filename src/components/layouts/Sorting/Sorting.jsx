import { useState, useEffect } from "react";
import SortingDropdown from "./SortingDropdown";
import SortingToggle from "./SortingToggle";

const Sorting = ({ setSortParams }) => {
  const [sortValue, setSortValue] = useState("sale_price");
  const [sortDirection, setSortDirection] = useState(1);

  useEffect(() => {
    const newSortParams = { sortParams: { [sortValue]: sortDirection } };
    setSortParams(newSortParams);
  }, [sortValue, sortDirection]);

  return (
    <div className="flex">
      <SortingToggle setSortDirection={setSortDirection} sortDirection={sortDirection} />
      <SortingDropdown setSortValue={setSortValue} sortValue={sortValue} />
    </div>
  );
};

export default Sorting;
