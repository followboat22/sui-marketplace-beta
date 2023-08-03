import { useTitle } from "../components/utils/TitleProvider";
import { useEffect } from "react";
import { useLocation, Routes, Route, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getBasePath } from "../utils/formats";
import { Navigate } from "react-router-dom";
import PrivateRoute from "../components/layouts/PrivateRoute";
import Home from "./Home";
import Explore from "./Explore";
import CollectionDetails from "./collections/CollectionDetails";
import RentalDetails from "./nfts/RentalDetails";
import ItemDetails from "./nfts/ItemDetails";
import Activity from "./Activity";
import Creator from "./Creator";
import Create from "./Create";
// import CreateItem from "./nfts/CreateItem";
import ListItem from "./nfts/ListItem";
// import CreateCollection from "./collections/CreateCollection";
import AddCollection from "./collections/AddCollection";
import EditCollection from "./collections/EditCollection";
import ReviewCollections from "./collections/ReviewCollections";
import Settings from "./Settings";
import Ranking from "./Ranking";
import NoResult from "./NoResult";
import FAQ from "./FAQ";
import Contact from "./Contact";
import MyProfile from "./MyProfile";
import NFTDetails from "./nfts/NFTDetails";
import Launchpad from "./launchpads/Launchpad";
import LaunchpadDetails from "./launchpads/LaunchpadDetails";
// import CreateLaunchpad from "./launchpads/CreateLaunchpad";
import ReviewLaunchpads from "./launchpads/ReviewLaunchpads";
// import EditLaunchpad from "./launchpads/EditLaunchpad";
// import EditLaunchpadListings from "./launchpads/EditLaunchpadListings";
import Rewards from "./Rewards";
import BatchCreateItem from "./nfts/BatchCreateItem";
import EditLaunchpadForm from "./launchpads/EditLaunchpad/EditLaunchpadForm";
import CreateCollectionForm from "./collections/CreateCollection/CreateCollectionForm";
import CreateItemForm from "./nfts/CreateItem/CreateItemForm";
import LoanItem from "./lending/ListItem";
import AllSafes from "./safes/AllSafes";

// Alias old routes to redirect to new routes e.g. launchpad redirects to mintpad
const AliasRedirect = ({ to }) => {
  const { id } = useParams();
  return <Navigate to={`${to}/${id}`} replace />;
};

const routes = [
  { path: "/", component: <Home />, title: "Home" },
  { path: "/explore", component: <Explore />, title: "Explore" },
  {
    path: "/explore/:link",
    component: <Explore />,
    title: "Explore",
  },
  {
    path: "/collection-details",
    component: <CollectionDetails />,
    title: "Collection Details",
  },
  {
    path: "/collection-details/:id",
    component: <CollectionDetails />,
    title: "Collection Details",
  },
  {
    path: "/collection-details/:id/:link",
    component: <CollectionDetails />,
    title: "Collection Details",
  },
  { path: "/item-details", component: <ItemDetails />, title: "Item Details" },
  {
    path: "/item-details/:id",
    component: <ItemDetails />,
    title: "Item Details",
  },
  {
    path: "/rental-details/:id",
    component: <RentalDetails />,
    title: "Rental Details",
  },
  { path: "/mintpad", component: <Launchpad />, title: "Mintpad" },
  {
    path: "/mintpad/:id",
    component: <LaunchpadDetails />,
    title: "Mintpad Details",
  },
  { path: "/launchpad", component: <Navigate to="/mintpad" replace /> },
  { path: "/launchpad/:id", component: <AliasRedirect to="/mintpad" /> },
  // {
  //   path: "/create-mintpad",
  //   component: <CreateLaunchpad />,
  //   title: "Create Mintpad",
  // },
  {
    path: "/edit-mintpad/:id",
    component: <EditLaunchpadForm />,
    title: "Edit Mintpad",
  },
  // {
  //   path: "/edit-mintpad-listings/:id",
  //   component: <EditLaunchpadListings />,
  //   title: "Edit Mintpad",
  // },
  { path: "/activity", component: <Activity />, title: "Activity" },
  { path: "/creators/:id", component: <Creator />, title: "Creator" },
  { path: "/nft-details/:id", component: <NFTDetails />, title: "NFT Details" },
  {
    path: "/review-collections",
    component: <ReviewCollections />,
    title: "Review Collections",
  },
  {
    path: "/review-collections/:id",
    component: <ReviewCollections />,
    title: "Review Collections",
  },
  {
    path: "/review-mintpads",
    component: <ReviewLaunchpads />,
    title: "Review Mintpads",
  },
  {
    path: "/review-mintpads/:id",
    component: <ReviewLaunchpads />,
    title: "Review Mintpads",
  },
  {
    path: "/edit-collection/:id",
    component: <EditCollection />,
    title: "Edit Collection",
  },
  { path: "/settings", component: <Settings />, title: "Settings" },
  {
    path: "/profile",
    private: true,
    component: <MyProfile />,
    title: "My Profile",
  },
  {
    path: "/profile/:link",
    private: true,
    component: <MyProfile />,
    title: "My Profile",
  },
  { path: "/rewards", private: true, component: <Rewards />, title: "Rewards" },
  { path: "/ranking", component: <Ranking />, title: "Rankings" },
  { path: "/no-result", component: <NoResult />, title: "404" },
  { path: "/faq", component: <FAQ />, title: "FAQ" },
  { path: "/contact", component: <Contact />, title: "Contact Us" },
  { path: "*", component: <Navigate to="/no-result" replace /> },
  { path: "/create", private: true, component: <Create />, title: "Create" },
  {
    path: "/list-nft",
    private: true,
    component: <ListItem />,
    title: "List NFT",
  },
  {
    path: "/create-nft",
    private: true,
    component: <CreateItemForm />,
    title: "Create NFT Wizard",
  },
  {
    path: "/batch-create-nft",
    private: true,
    component: <BatchCreateItem />,
    title: "Create NFTs",
  },
  {
    path: "/create-collection",
    private: true,
    component: <CreateCollectionForm />,
    title: "Create Collection",
  },
  {
    path: "/add-collection",
    private: true,
    component: <AddCollection />,
    title: "List Collection",
  },
  {
    path: "/loan",
    private: true,
    component: <LoanItem />,
    title: "Loan NFT",
  },
  {
    path: "/safes",
    private: true,
    component: <AllSafes />,
    title: "My Safes",
  },
];

const Routing = () => {
  const user = useSelector((state) => state.user);
  const location = useLocation();
  const basePath = getBasePath(location.pathname);
  const { setTitle } = useTitle();
  useEffect(() => {
    const currentRoute = routes.find(
      (route) => route.path == location.pathname
    );
    if (currentRoute?.title) setTitle(currentRoute.title);
  }, [basePath]);

  return (
    <Routes>
      {routes.map((data, index) =>
        data.private ? (
          <Route
            path={data.path}
            key={"private" + index}
            element={
              <PrivateRoute
                user={user}
                element={data.component}
                key={"private" + index}
              />
            }
          ></Route>
        ) : (
          <Route
            index={data.index}
            onUpdate={() => window.scrollTo(0, 0)}
            exact={true}
            path={data.path}
            element={data.component}
            key={index}
          />
        )
      )}
    </Routes>
  );
};

export default Routing;
