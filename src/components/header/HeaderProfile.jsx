import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { showWallet } from "../../web3/sui";
import { ethos } from "ethos-connect";
import { ellipsifyString, numberShortFormat, mystToSui } from "../../utils/formats";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { disconnect } from "../../redux/state/sui";
import Avatar from "../layouts/Avatar";
import ToastPopup from "../utils/ToastPopup";

const HeaderProfile = ({ toggleProfile, profile }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const { wallet } = ethos.useWallet();
  const total = useSelector((state) => state.sui?.total);
  const account = useSelector((state) => state.sui.account);

  const handleCopy = () => {
    ToastPopup("Copied wallet address to clipboard!", "success");
  };

  const logout = () => {
    dispatch(disconnect());
    wallet.disconnect();
  };

  return (
    <div className="header_profile" onClick={() => toggleProfile(!profile)}>
      <div className="header_avatar">
        <div>
          <div className="suiName">{user.suiName && <span>{user.suiName}</span>}</div>
          <div className="price">
            <span>
              {numberShortFormat(mystToSui(total || 0))} <strong>SUI</strong>
            </span>
          </div>
        </div>
        <Avatar creator={user} size={50} nolink />
      </div>
      <div className={`avatar_popup ${profile ? "visible" : ""}`}>
        <CopyToClipboard
          style={{
            cursor: "pointer",
          }}
          text={account}
          onCopy={() => handleCopy()}
        >
          <div>
            <i className="fal mr-3 fa-copy"></i>
            {ellipsifyString(account, 10)}
          </div>
        </CopyToClipboard>
        {/* <div className="d-flex align-items-center mt-10">
          <p className="text-sm font-book text-gray-400">Balance</p>
          <p className="w-full text-sm font-bold text-green-500">
            {numberShortFormat(sui.total)}
          </p>
        </div> */}
        <div className="hr"></div>
        <div className="links mt-20">
          {user.role_id == 3 && (
            <>
              <Link to="/review-collections">
                <i className="fab fa-pencil-alt"></i> <span> Review Collections</span>
              </Link>
            </>
          )}
          <Link to="/profile">
            <i className="fas fa-chart-bar"></i> <span> My Profile</span>
          </Link>
          {/* <Link to="/rewards">
            <i className="fas fa-gift"></i> <span> Rewards</span>
          </Link> */}
          <Link to="/settings">
            <i className="fas fa-cog"></i> <span> Settings</span>
          </Link>
          {wallet?.type === "hosted" && (
            <a className="pointer" onClick={showWallet}>
              <i className="fas fa-wallet"></i> <span>Show wallet</span>
            </a>
          )}
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSdvE9r7iOjhSxTF7aivHdr2xyha8Epj7albYwusPl-rcy3oHQ/viewform?usp=sf_link"
            target="_blank"
            rel="noreferrer"
          >
            <i className="fas fa-external-link"></i> <span> Apply for Mintpad</span>
          </a>
          <a className="pointer" id="logout" onClick={logout}>
            <i className="fal fa-sign-out"></i> <span> Logout</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default HeaderProfile;
