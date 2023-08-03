import React, { useState, useEffect } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import PageHeader from "../../components/layouts/PageHeader";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getLaunchpad } from "../../utils/api";
import LoadingSpinner from "../../components/utils/LoadingSpinner";
import { Tab, Tabs, TabList } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { useDispatch, useSelector } from "react-redux";
import { useTitle } from "../../components/utils/TitleProvider";
import LaunchpadImageAndMint from "../../components/layouts/launchpad/details/LaunchpadImageAndMint";
import LaunchpadInfo from "../../components/layouts/launchpad/details/LaunchpadInfo";
import LaunchpadRoadmap from "../../components/layouts/launchpad/details/LaunchpadRoadmap";
import LaunchpadTeam from "../../components/layouts/launchpad/details/LaunchpadTeam";
import LaunchpadFAQ from "../../components/layouts/launchpad/details/LaunchpadFAQ";
import {
  getObjectInfo,
  getObjectsInfo,
  buyLaunchpadNFT,
  updateLaunchPad,
  getObjectsOwnedByObject,
  getLaunchpadUserLimit,
} from "../../web3/sui";
import ToastPopup from "../../components/utils/ToastPopup";

const LaunchpadDetails = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { setTitle } = useTitle();
  const user = useSelector((state) => state.user);
  const [launchpad, setLaunchpad] = useState(false);
  const [inventories, setInventories] = useState([]);
  const [saleIndex, setSaleIndex] = useState(0);
  const [buyLoading, setBuyLoading] = useState(false);

  const handleStartStop = async (bool) => {
    // updateLaunchPad(launchpad, bool);
  };

  const handleBuyNFT = async () => {
    setBuyLoading(true);
    // todo, auction support
    buyLaunchpadNFT(launchpad, saleIndex)
      .then((result) => {
        // TODO: update info, refetch from blockchain?
        if (result.status === "success") {
          ToastPopup(`Item bought successfully!`);
          inventories[saleIndex] = inventories[saleIndex] - 1;
          setInventories(inventories);
        }
      })
      .catch((e) => {
        ToastPopup(e.message, "error");
      })
      .finally(() => {
        setBuyLoading(false);
      });
  };
  const { roadmap, team, faq, ...launchpadInfo } = launchpad;
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(async () => {
    try {
      if (launchpad) {
        if (inventories.length === 0 && launchpad.sales.length > 1) {
          const ownedObjectsPromises = [];
          for (let index = 0; index < launchpad.sales.length; index++) {
            ownedObjectsPromises.push(
              getObjectsOwnedByObject(launchpad.sales[index].object_id)
            );
          }
          const saleData = await Promise.all(ownedObjectsPromises);
          const warehouses = saleData.map(
            (saleObjects) =>
              saleObjects.find((a) => a.name.includes("warehouse::Warehouse")).objectId
          );
          const warehouseInfo = await getObjectsInfo(warehouses);
          const newInventories = [...inventories];
          for (let index = 0; index < launchpad.sales.length; index++) {
            newInventories[index] = warehouseInfo[index].data.value.fields.nfts.length;
          }
          setInventories(newInventories);
        } else {
          const saleData = await getObjectsOwnedByObject(
            launchpad.sales[saleIndex].object_id
          );
          const warehouse = saleData.find((a) => a.name.includes("warehouse::Warehouse"));
          const warehouseInfo = await getObjectInfo(warehouse.objectId);

          const newInventories = [...inventories];
          newInventories[saleIndex] = warehouseInfo.data.value.fields.nfts.length;
          setInventories(newInventories);
          // let limit = await getLaunchpadUserLimit(launchpad, saleIndex);
        }
      }
    } catch (e) {
      console.log(e);
    }
  }, [launchpad, saleIndex]);

  const tabPanels = [
    <LaunchpadInfo data={launchpadInfo} saleIndex={saleIndex} />,
    <LaunchpadRoadmap data={roadmap} />,
    <LaunchpadTeam data={team} />,
    <LaunchpadFAQ data={faq} />,
  ];

  const ActiveTab = ({ tabIndex }) => {
    return tabPanels[tabIndex];
  };

  useEffect(async () => {
    if (params.id) {
      try {
        const res = await getLaunchpad(params.id);
        const { launchpad } = res.data;
        // let LaunchpadDetails = await getObjectInfo(launchpad.object_id);
        // const sales = res.data.launchpad.sales;
        // launchpad.object = LaunchpadDetails.data;
        // launchpad.sales = sales;

        setLaunchpad(launchpad);
        setTitle(launchpad.launchpad_collection.name + " - Mintpad");
      } catch (e) {
        console.log(e);
        navigate("/mintpad", "replace");
      }
    }
  }, []);

  return (
    <div>
      <Header />
      <PageHeader title={`Mints`}>
        <p>
          {user.role_id == 3 && (
            <Link to={`/edit-mintpad/${launchpad?._id}`}>Edit Mintpad</Link>
          )}
        </p>
      </PageHeader>
      <div className="tf-section launchpad-section">
        <div className="themesflat-container">
          <div className="row flex justify-content-between">
            <div className="flat-tabs themesflat-tabs launchpad-tabs fullWidth">
              <Tabs selectedIndex={tabIndex} onSelect={(index) => setTabIndex(index)}>
                <TabList style={{ marginBottom: "3rem" }}>
                  <Tab>Info</Tab>
                  <Tab>Roadmap</Tab>
                  <Tab>Team</Tab>
                  <Tab>FAQ</Tab>
                </TabList>
                <div className="flex justify-content-between launchpad-tab">
                  <LaunchpadImageAndMint
                    launchpad={launchpad}
                    saleIndex={saleIndex}
                    buyLoading={buyLoading}
                    handleBuyNFT={handleBuyNFT}
                  />
                  {launchpad ? (
                    <ActiveTab tabIndex={tabIndex} />
                  ) : (
                    <LoadingSpinner size="xxlarge" centered />
                  )}
                </div>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LaunchpadDetails;
