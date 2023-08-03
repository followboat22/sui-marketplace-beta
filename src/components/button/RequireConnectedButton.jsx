import { useSelector } from "react-redux";
import { SignInButton } from "ethos-connect";

const RequireConnectedButton = ({ text, disabled, className, children }) => {
  const connected = useSelector((state) => state.sui?.connected);

  if (connected) {
    return <>{children}</>;
  }
  return (
    <SignInButton className={className} disabled={disabled}>
      Login to {text}
    </SignInButton>
  );
};

export default RequireConnectedButton;
