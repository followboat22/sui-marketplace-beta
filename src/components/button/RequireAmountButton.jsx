import { useSelector } from "react-redux";
import RequireConnectedButton from "./RequireConnectedButton";

const RequireAmountButton = ({ text, amount, disabled, className, children }) => {
  const connected = useSelector((state) => state.sui.connected);
  const total = useSelector((state) => state.sui?.total);
  const largest = useSelector((state) => state.sui?.largest);

  if (connected) {
    if (total < amount) {
      return (
        <button disabled={disabled} className={className}>
          Not enough SUI
        </button>
      );
    }
    if (largest < amount) {
      return (
        <button disabled={disabled} className={className}>
          No Sui Coin large enough.
        </button>
      );
    }
  }
  return (
    <RequireConnectedButton className={className} disabled={disabled} text={text}>
      {children}
    </RequireConnectedButton>
  );
};

export default RequireAmountButton;
