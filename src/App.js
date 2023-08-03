import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, history } from "./redux";
import ScrollToTop from "./ScrollToTop";
import { EthosConnectProvider } from "ethos-connect";
import { connect, setLoading } from "./redux/state/sui";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IS_PROD } from "./utils/environments";
import { fetchSettings } from "./redux/state/settings";
// import Routing from "pages/Routing";
import Routing from "./pages/Routing";
import { TitleProvider } from "./components/utils/TitleProvider";
import { SkeletonTheme } from "react-loading-skeleton";
import useAppDataFetcher from "./utils/useAppDataFetcher";
import { getBearerToken } from "./utils/api";
import FullScreenLoading from "./components/utils/FullScreenLoading";
// import { network } from "web3/sui";
import EthosSync from "./components/EthosSync";

const ethosConfiguration = {
  apiKey: IS_PROD ? "Onyx-prod" : "Onyx-dev",
  walletAppUrl: IS_PROD
    ? "https://ethoswallet.xyz"
    : "https://sui-wallet-staging.onrender.com",
  // network,
};

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  useAppDataFetcher();

  const onWalletConnected = async (provider, signer) => {
    if (!signer) return false;
    dispatch(connect(provider, signer));
    dispatch(setLoading(false));
  };

  useEffect(() => {
    dispatch(fetchSettings());
  }, []);

  return (
    <EthosConnectProvider
      ethosConfiguration={ethosConfiguration}
      onWalletConnected={({ provider, signer }) =>
        onWalletConnected(provider, signer)
      }
    >
      <PersistGate loading={null} persistor={persistor}>
        <ToastContainer theme="colored" />
        <TitleProvider>
          <SkeletonTheme
            baseColor="var(--primary-color11)"
            highlightColor="var(--primary-color11d)"
          >
            <Router location={history.location} navigator={history}>
              <ScrollToTop />{" "}
              {!user._id && getBearerToken() ? null : <Routing/>}
            </Router>
            <EthosSync />
            <FullScreenLoading />
          </SkeletonTheme>
        </TitleProvider>
      </PersistGate>
    </EthosConnectProvider>
  );
}

export default App;
