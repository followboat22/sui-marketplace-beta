import { getSettings } from "../../utils/api";
import { updateSettings, getObjectInfo } from "../../web3/sui";

export const SETTINGS = "SETTINGS";

export const fetchSettings = () => async (dispatch) => {
  let newSettings = await getSettings().then((res) => res.data);
  updateSettings(newSettings);
  let stillExists = await getObjectInfo(newSettings.market_address);
  newSettings.reset = !stillExists;

  dispatch({
    type: SETTINGS,
    data: newSettings,
  });
};

const INIT_STATE = {
  nft_bytes: "",
  package_id: "",
  module_name: "",
  market_address: "",
  admin_address: "",
  tags: [],
};

const reducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case SETTINGS:
      return { ...state, ...action.data };
    default:
      return state;
  }
};
export default reducer;
