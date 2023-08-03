import { Link } from "react-router-dom";
import menus from "../../pages/menu";
import * as ReactTooltip from 'react-tooltip';

const MainNav = ({ menuLeft, handleOnClick, pathname, activeIndex }) => {
  return (
    <nav id="main-nav" className="main-nav" ref={menuLeft}>
      <ul id="menu-primary-menu" className="menu">
        {menus.map((data, index) => (
          <li
            key={index}
            onClick={() => handleOnClick(index)}
            className={`menu-item ${data.namesub ? "menu-item-has-children" : ""} ${
              activeIndex === index ? "active" : ""
            } `}
          >
            {data.links && !data.disabled && !data.namesub ? (
              <Link to={data.links}>{data.name}</Link>
            ) : (
              <>
                <ReactTooltip
                
                  place="bottom"
                  id="comingSoonLink"
                  type="info"
                  className="tooltip-nowrap"
                >
                  <span>Coming Soon!</span>
                </ReactTooltip>
                <p data-tip data-for="comingSoonLink" style={{ color: "#343444" }}>
                  {data.name}
                </p>
              </>
            )}
            {data.namesub && (
              <ul className="sub-menu">
                {data.namesub.map((submenu, index2) => (
                  <li
                    key={index2}
                    className={
                      pathname === submenu.links ? "menu-item current-item" : "menu-item"
                    }
                  >
                    <Link to={submenu.links}>{submenu.sub}</Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default MainNav;
