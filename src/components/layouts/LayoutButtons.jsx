import GridToggle from "../../assets/images/icon/gridToggle.svg";
import ListToggle from "../../assets/images/icon/listToggle.svg";

const LayoutButtons = ({ layout, setLayout }) => {
  return (
    <ul className="layout-buttons">
      <li
        onClick={() => setLayout(false)}
        className={`style1 list ${!layout ? "active" : ""}`}
      >
        <div>
          <img src={ListToggle} />
          <span className="search-options-text">Grid</span>
        </div>
      </li>
      <li
        onClick={() => setLayout(true)}
        className={`style2 list ${layout ? "active" : ""}`}
      >
        <div>
          <img src={GridToggle} />
          <span className="search-options-text">List</span>
        </div>
      </li>
    </ul>
  );
};

export default LayoutButtons;
