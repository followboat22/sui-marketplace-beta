const SortingToggle = ({ setSortDirection, sortDirection }) => {
  return (
    <button
      className="btn-sort-by mg-r-12"
      onClick={() => setSortDirection(sortDirection * -1)}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={sortDirection < 0 ? "" : "reverseSVG"}
      >
        <path d="M3 7H21" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M6 12H18" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M10 17H14" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <span className="search-options-text">
        {sortDirection < 0 ? "High to Low" : "Low to High"}
      </span>
    </button>
  );
};

export default SortingToggle;
