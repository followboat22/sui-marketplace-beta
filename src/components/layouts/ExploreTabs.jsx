import { Fragment, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { findIndexByValue } from "../../utils/formats";
import { useTitle } from "../../components/utils/TitleProvider";
import { useDispatch } from "react-redux";
import { reset } from "redux-form";

import ListingsPanel from "../../components/layouts/explore/Panels/ListingsPanel";
import AuctionsPanel from "../../components/layouts/explore/Panels/AuctionsPanel";
import CollectionsPanel from "../../components/layouts/explore/Panels/CollectionsPanel";
import RentalsPanel from "../../components/layouts/explore/Panels/RentalsPanel";

const ExploreTabs = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setTitle } = useTitle();
  const { link } = useParams();

  const dataTabs = [
    {
      title: "Listings",
      link: "listings",
      panel: <ListingsPanel title="Listings" />,
    },
    {
      title: "Auctions",
      link: "auctions",
      panel: <AuctionsPanel title="Auctions" />,
    },
    {
      title: "Collections",
      link: "collections",
      panel: <CollectionsPanel title="Collections" />,
    },
    {
      title: "Rentals",
      link: "rentals",
      panel: <RentalsPanel title="Rentals" />,
    },
  ];

  const [selectedTab, setSelectedTab] = useState(
    Math.max(findIndexByValue(dataTabs, "link", link), 0)
  );

  useEffect(() => {
    const tab = findIndexByValue(dataTabs, "link", link);
    if (tab !== -1 && tab !== selectedTab) {
      setSelectedTab(tab);
      setTitle(dataTabs[tab].title);
    }
  }, [link]);

  useEffect(() => {
    setTitle(dataTabs[selectedTab].title);
  }, []);

  const tabSelectHandler = (index) => {
    const link = dataTabs[index].link;
    dispatch(reset("sidebar-search"));
    navigate(`/explore/${link}`);
  };

  return (
    <Fragment>
      <div className="flat-tabs items">
        <Tabs selectedIndex={selectedTab} onSelect={(index) => tabSelectHandler(index)}>
          <TabList>
            {dataTabs.map((tab, index) => (
              <Tab key={index} disabled={tab.disabled}>
                {tab.title}
              </Tab>
            ))}
          </TabList>
          {dataTabs.map(({ panel }, index) => (
            <TabPanel key={index}>{panel}</TabPanel>
          ))}
        </Tabs>
      </div>
    </Fragment>
  );
};

export default ExploreTabs;
