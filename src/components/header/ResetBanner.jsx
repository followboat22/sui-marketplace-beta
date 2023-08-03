import { useSelector } from "react-redux";

const ResetBanner = () => {
  const reset = useSelector((state) => state.settings.reset);
  if (!reset) {
    return "";
  }
  return (
    <div className="themesflat-container">
      <div className="row">
        <div className="col-md-12">
          <div id="reset-banner">
            <p>
              Network has been reset, please be patient while we update everything to work
              with the latest version of Sui.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetBanner;
