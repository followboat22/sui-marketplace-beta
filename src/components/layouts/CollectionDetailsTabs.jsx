import { Fragment, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { findIndexByValue } from "../../utils/formats";
import { useTitle } from "../utils/TitleProvider";
import { useDispatch } from "react-redux";
import { reset } from "redux-form";
import CollectionListingsPanel from "../../components/layouts/explore/Panels/CollectionListingsPanel";

const CollectionDetailsTabs = ({ collection }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setTitle } = useTitle();
  const { link } = useParams();

  const dataTabs = [
    {
      title: "Listings",
      link: "listings",
      panel: <CollectionListingsPanel title="Listings" collection={collection} />,
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
    navigate(`/collection-details/${collection?._id}/${link}`);
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

export default CollectionDetailsTabs;
