import { Fragment, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { findIndexByValue } from "../../utils/formats";
import { useTitle } from "../utils/TitleProvider";

import MyOwnedNFTsPanel from "./profile/Panels/MyOwnedNFTsPanel";
import MyFavouritesPanel from "./profile/Panels/MyFavouritesPanel";
import MyListingsPanel from "./profile/Panels/MyListingsPanel";
import MyAuctionsPanel from "./profile/Panels/MyAuctionsPanel";
import MyCoinsPanel from "./profile/Panels/MyCoinsPanel";
import MyCollectionsPanel from "./profile/Panels/MyCollectionsPanel";
import MyWonAuctionsPanel from "./profile/Panels/MyWonAuctionsPanel";
import MyLaunchpadsPanel from "./profile/Panels/MyLaunchpadsPanel";
import MyBidsPanel from "./profile/Panels/MyBidsPanel";

const ProfileTabs = () => {
  const dataTabs = [
    {
      title: "Owned NFTs",
      link: "owned-nfts",
      panel: <MyOwnedNFTsPanel title="Owned NFTs" />,
    },
    {
      title: "Favourites",
      link: "favourites",
      panel: <MyFavouritesPanel title="Favourites" />,
    },
    {
      title: "My Listings",
      link: "listings",
      panel: <MyListingsPanel title="Listings" />,
    },
    {
      title: "My Auctions",
      link: "auctions",
      panel: <MyAuctionsPanel title="Auctions" />,
    },
    {
      title: "Coins",
      link: "coins",
      panel: <MyCoinsPanel title="Coins" />,
    },
    {
      title: "Collections",
      link: "collections",
      panel: <MyCollectionsPanel title="Collections" />,
    },
    {
      title: "My Bids",
      link: "my-bids",
      panel: <MyBidsPanel title="Bids" />,
    },
    {
      title: "Won Auctions",
      link: "won-auctions",
      panel: <MyWonAuctionsPanel title="Won Auctions" />,
    },
    {
      title: "Mintpads",
      link: "mintpads",
      panel: <MyLaunchpadsPanel title="Mintpads" />,
    },
    {
      title: "Rented NFTs",
      link: "rented",
      panel: <MyWonAuctionsPanel title="Rented NFTs" />,
    },
    {
      title: "Loaned NFTs",
      link: "loaned",
      panel: <MyLaunchpadsPanel title="Loaned NFTs" />,
    },
  ];

  const navigate = useNavigate();
  const { setTitle } = useTitle();
  const { link } = useParams();
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
    navigate(`/profile/${link}`);
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

export default ProfileTabs;
