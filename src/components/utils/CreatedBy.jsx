import { ellipsifyString } from "../../utils/formats";
import { IS_TESTNET } from "../../utils/environments";
import { Link } from "react-router-dom";

const CreatedBy = ({ creator, children }) => {
  const network = IS_TESTNET ? "testnet" : "devnet";
  return creator?.display_name ? (
    <Link to={`/creators/${creator?._id}`}>{children ?? creator?.display_name}</Link>
  ) : (
    <a
      href={`https://explorer.sui.io/address/${creator?.account_address}?network=${network}`}
      target="_blank"
      rel="noreferrer"
    >
      {children ?? ellipsifyString(creator?.account_address, 8)}
    </a>
  );
};

export default CreatedBy;
