import {
  LOGIN,
  CONTENTS,
  BALANCES,
  CONNECTED,
  LOADING,
  LOGOUT,
} from "../../redux/types";
import * as sui from "../../web3/sui";
import {
  suiSignIn,
  signIn,
  getCurrentUser,
  getBearerToken,
  setBearerToken,
  clearBearerToken,
  refreshInstance,
} from "../../utils/api";
import { getName } from "../../web3/suins";

const attemptSign = (address) => {
  return sui
    .loginSignature()
    .then((res) => {
      return signIn(res[0]);
    })
    .catch((e) => {
      return suiSignIn(address);
    });
};

export const connect = (provider, signer) => async (dispatch) => {
  const address = await signer.getAddress();
  if (address) {
    dispatch(setLoading(true));
    let bearerToken = getBearerToken();
    let user = false;

    sui.setProvider(provider, signer, address);
    const name = await getName(address);
    if (bearerToken) {
      // TODO: hide error for bad token from the toasts.
      try {
        const res = await getCurrentUser();
        user = res.data.data.user;
        user.suiName = name;
        if (user?.account_address !== address) {
          clearBearerToken();
          refreshInstance();
          bearerToken = false;
        } else {
          dispatch({
            type: LOGIN,
            user,
          });
        }
      } catch (e) {
        clearBearerToken();
        refreshInstance();
        bearerToken = false;
      }
    }

    if (!bearerToken) {
      let res = await attemptSign(address);
      user = res.data.data.user;
      user.suiName = name;
      if (user._id) {
        setBearerToken(res.data.token);
        refreshInstance();
        dispatch({
          type: LOGIN,
          user,
        });
      }
    } else if (user) {
      dispatch({
        type: LOGIN,
        user,
      });
    }
    dispatch({
      type: CONNECTED,
      account: address,
    });
  }
  let { total, suiObjects } = await sui.getUserCoins();
  sui.updateGasObjects(suiObjects);
  dispatch(setBalances(suiObjects, total));
};

export const setConnected = (address) => async (dispatch) => {
  dispatch({
    type: CONNECTED,
    account: address,
  });
  let { total, suiObjects } = await sui.getUserCoins();
  sui.updateGasObjects(suiObjects);
  dispatch(setBalances(suiObjects, total));
};

export const disconnect = () => async (dispatch) => {
  clearBearerToken();
  dispatch({
    type: CONNECTED,
  });
  dispatch({
    type: LOGOUT,
  });
};

export const setLoading = (loading) => async (dispatch) => {
  dispatch({
    type: LOADING,
    loading,
  });
};

export const setBalances = (suiCoins, total) => async (dispatch) => {
  suiCoins.forEach((e, i) => {
    suiCoins[i].data.balance = parseInt(e.data.balance);
  });
  dispatch({
    type: BALANCES,
    total: parseInt(total),
    largest: parseInt(suiCoins[0].data.balance),
    suiObjects: suiCoins,
  });
};

export const getContents =
  (currentContents = []) =>
  async (dispatch) => {
    const newContents = await sui.getObjectsByType(
      false,
      false,
      [
        "mint_cap::MintCap",
        "transfer_allowlist::CollectionControlCap",
        "0x2::coin::Coin<0x2::sui::SUI>",
      ],
      true
    );

    const newContentIds = newContents.map((a) => a.id);
    currentContents.forEach((item, index) => {
      const indexOf = newContentIds.indexOf(item.id);
      if (indexOf > -1) {
        // if item exists in list of new things, keep it
        delete newContents[indexOf];
        delete newContentIds[indexOf];
      } else {
        // if item no longer exists, remove it
        delete currentContents[index];
      }
    });
    const newItems = await sui.getNFTsInfo(newContents);
    currentContents = currentContents.concat(newItems);

    dispatch({
      type: CONTENTS,
      data: currentContents,
    });
  };

const INIT_STATE = {
  connected: false,
  total: 0,
  largest: 0,
  loading: true,
  contents: [],
  suiObjects: [],
};
const reducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case CONNECTED:
      return {
        ...state,
        connected: !!action.account,
        account: action.account,
        name: action.name,
        loading: false,
      };
    case LOADING:
      return { ...state, loading: action.loading };
    case BALANCES:
      return {
        ...state,
        total: action.total,
        suiObjects: action.suiObjects,
        largest: action.largest,
      };
    case CONTENTS:
      return {
        ...state,
        contents: action.data,
      };
    default:
      return state;
  }
};
export default reducer;
