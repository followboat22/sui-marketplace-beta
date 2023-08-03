import { Navigate } from "react-router-dom";
import { EthosConnectStatus, ethos } from "ethos-connect";
import ToastPopup from "../../components/utils/ToastPopup";
import FullScreenLoading from "../../components/utils/FullScreenLoading";

const PrivateRoute = ({ user, element }) => {
  const wallet = ethos.useWallet();

  if (wallet.status === EthosConnectStatus.Loading) {
    return <FullScreenLoading />;
  }

  if (!user._id && wallet.status === EthosConnectStatus.NoConnection) {
    // not logged in so redirect to login page with the return url
    ToastPopup("Please connect your wallet to continue", "warning");
    return <Navigate to="/" replace />;
  }

  if (user._id && !user.display_name) {
    ToastPopup("You must first set your display name and email address.", "warning");
    return <Navigate to="/settings" replace />;
  }

  // authorized so return child components
  return element;
};

export default PrivateRoute;
