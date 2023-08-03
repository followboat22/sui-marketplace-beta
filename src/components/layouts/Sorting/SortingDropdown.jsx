import { Dropdown } from "react-bootstrap";

const SortingDropdown = ({ setSortValue, sortValue }) => {
  const sortSelectHandler = (eKey, e) => {
    setSortValue(eKey);
  };

  const list = [
    { key: "sale_price", value: "Price" },
    { key: "createdAt", value: "Created" },
  ];

  const option = list.find((field) => field.key === sortValue);

  return (
    <Dropdown onSelect={(eKey, e) => sortSelectHandler(eKey, e)}>
      <Dropdown.Toggle id="dropdown-basic" className="btn-sort-by dropdown">
        <span className="capitalize">{option.value || "Sort By"}</span>
      </Dropdown.Toggle>

      <Dropdown.Menu style={{ margin: 0 }}>
        {list.map((item, i) => {
          return (
            <Dropdown.Item
              active={list[i]?.key === sortValue ? true : false}
              key={i}
              eventKey={list[i]?.key}
              //className="capitalize"
            >
              {item.value}
            </Dropdown.Item>
          );
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default SortingDropdown;
