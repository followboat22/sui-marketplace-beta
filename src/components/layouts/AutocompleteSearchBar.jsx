import React, { useState, useEffect } from "react";
import AsyncSelect, { components } from "react-select";
import { useNavigate } from "react-router-dom";
import { getCollectionImageURL } from "../../utils/formats";
import { ReactComponent as SearchSVG } from "../../assets/images/search.svg";
import { searchCollections, searchCreators } from "../../utils/api";
import LazyLoadImage from "./LazyLoadImage";

const Input = (props) => <components.Input {...props} isHidden={false} />;
const Control = (props) => (
  <components.Control {...props}>
    <SearchSVG />
    {props.children}
  </components.Control>
);

export const searchbarStyles = {
  menu: (provided) => ({
    ...provided,
    backgroundColor: "#1f1f2c",
  }),
  groupHeading: (provided) => ({
    ...provided,
    fontSize: "15px",
    fontWeight: "500",
    padding: "0px 0px 5px 10px",
  }),
  option: (provided, { isFocused }) => ({
    ...provided,
    backgroundColor: isFocused ? "#14141f" : undefined,
    color: "white",
    fontSize: "15px",
    cursor: "pointer",
    paddingTop: "10px",
    paddingBottom: "10px",
  }),
  control: (provided) => ({
    ...provided,
    padding: "8px 18px 8px 18px",
    backgroundColor: "#1f1f2c",
    borderRadius: "25px",
    border: "2px solid #1f1f2c",
    fontSize: "13px",
    lineHeight: "20px",
    letterSpacing: "0.5px",
    boxShadow: "none",
    cursor: "text",
    ":hover": {
      border: "2px solid #5142FC",
    },
    ":focus-within": {
      border: "2px solid #5142FC !important",
    },
    "> svg": {
      marginRight: "10px",
    },
  }),
  input: (provided) => ({
    ...provided,
    color: "#fff",
    backgroundColor: "transparent",
    outline: "none",
    fontSize: "15px",
    lineHeight: "20px",
    letterSpacing: "0.5px",
    "> input": {
      borderRadius: "0px !important",
    },
  }),
  loadingMessage: (provided) => ({
    ...provided,
    fontSize: "15px",
  }),
  noOptionsMessage: (provided) => ({
    ...provided,
    fontSize: "15px",
  }),
};

export const searchbarThemeStyles = {
  menu: (provided) => ({
    ...provided,
    backgroundColor: "var(--bg-section)",
    border: "2px solid var(--primary-color)",
  }),
  groupHeading: (provided) => ({
    ...provided,
    fontSize: "15px",
    fontWeight: "500",
    padding: "0px 0px 5px 10px",
  }),
  option: (provided, { isFocused }) => ({
    ...provided,
    backgroundColor: isFocused ? "var(--primary-color)" : undefined,
    color: "var(--primary-color2)",
    fontSize: "15px",
    cursor: "pointer",
    paddingTop: "10px",
    paddingBottom: "10px",
  }),
  control: (provided) => ({
    ...provided,
    padding: "8px 18px 8px 18px",
    backgroundColor: "var(--bg-section)",
    border: "1px solid rgba(138, 138, 160, 0.3)",
    fontSize: "13px",
    lineHeight: "20px",
    letterSpacing: "0.5px",
    boxShadow: "none",
    ":hover": {
      border: "1px solid rgba(138, 138, 160, 0.8)",
    },
  }),
  placeholder: (provided) => {
    return {
      ...provided,
      color: "var(--primary-color2)",
    };
  },
  input: (provided) => ({
    ...provided,
    color: "var(--primary-color2)",
    outline: "none",
    fontSize: "15px",
    lineHeight: "20px",
    letterSpacing: "0.5px",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "var(--primary-color2)",
  }),
  loadingMessage: (provided) => ({
    ...provided,
    fontSize: "15px",
  }),
  noOptionsMessage: (provided) => ({
    ...provided,
    fontSize: "15px",
  }),
};

const AutocompleteSearchBar = () => {
  const [query, setQuery] = useState("");
  const [openMenu, setOpenMenu] = useState(false);
  const [collectionOptions, setCollectionOptions] = useState([]);
  const [creatorOptions, setCreatorOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const loadOptions = async () => {
    if (query.length > 0) {
      await Promise.all([
        searchCollections({ searchName: query }).then((res) => {
          const arr = res.data.results;
          const results = arr.map((collection) => ({
            value: collection.name,
            label: collection.name,
            id: collection._id,
            group: "Collection",
          }));
          setCollectionOptions(results);
        }),
        searchCreators({ searchName: query }).then((res) => {
          const arr = res.data.results;
          const results = arr.map((creator) => ({
            value: creator.display_name,
            label: creator.display_name,
            id: creator._id,
            group: "Creator",
          }));
          setCreatorOptions(results);
        }),
      ]).then(() => setIsLoading(false));
    }
  };

  const groupedOptions = [
    {
      label: "Collections",
      options: collectionOptions,
    },
    {
      label: "Creators",
      options: creatorOptions,
    },
  ];

  const formatOptionLabel = ({ value, label, id }) => (
    <div key={id} style={{ display: "flex", alignItems: "center" }}>
      <LazyLoadImage
        src={getCollectionImageURL(id, "logo")}
        width="36px"
        height="36px"
        className="searchResultsIcon"
      />
      <div className="searchResultsLabel">{label}</div>
    </div>
  );

  const clearAllOptions = () => {
    setCollectionOptions([]);
    setCreatorOptions([]);
  };

  const handleInputChange = (inputQuery, { action, prevInputValue }) => {
    if (action !== "input-blur" && action !== "menu-close") {
      setQuery(inputQuery);
    }
    if (action === "input-change") {
      clearAllOptions();
      if (inputQuery.length > 0) {
        setIsLoading(true);
        setOpenMenu(true);
      }
      if (inputQuery.length === 0) {
        setIsLoading(false);
        setOpenMenu(false);
      }
    }
  };

  const handleFocus = (event) => {
    const focusValue = event.target.value;
    if (focusValue.length > 0) setOpenMenu(true);
  };

  useEffect(() => {
    let timer = setTimeout(() => loadOptions(), 300);

    return () => {
      clearTimeout(timer);
    };
  }, [query]);

  const hideMenu = () => {
    setOpenMenu(false);
  };

  const onChange = (option) => {
    switch (option.group) {
      case "Creator":
        navigate(`/creators/${option.id}`);
        break;
      case "Collection":
        navigate(`/collection-details/${option.id}`);
        break;
      default:
        break;
    }
  };

  return (
    <div className="header_2 question-form fullWidth">
      <AsyncSelect
        isLoading={isLoading}
        openMenuOnFocus={!!query}
        openMenuOnClick={!!query}
        formatOptionLabel={formatOptionLabel}
        onChange={onChange}
        onBlur={hideMenu}
        styles={searchbarStyles}
        components={{
          DropdownIndicator: () => null,
          IndicatorSeparator: () => null,
          Input,
          Control,
        }}
        menuIsOpen={openMenu}
        onFocus={handleFocus}
        onInputChange={handleInputChange}
        inputValue={query}
        isSearchable={true}
        options={groupedOptions}
        noOptionsMessage={({ inputValue }) =>
          inputValue && "No Collections or Creators found"
        }
        placeholder="Search collections and creators..."
        controlShouldRenderValue={false}
        blurInputOnSelect
      />
    </div>
  );
};

export default AutocompleteSearchBar;
