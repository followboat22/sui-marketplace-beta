import { ethos } from "ethos-connect";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setBalances } from "../redux/state/sui";
import { usePrevious } from "../utils/hooks";
import { SUI, updateGasObjects } from "../web3/sui";

const EthosSync = () => {
  const { wallet } = ethos.useWallet();
  const prevTotal = usePrevious(wallet?.contents?.tokens?.[SUI]?.balance.valueOf(), 0);
  const dispatch = useDispatch();

  useEffect(() => {
    if (wallet?.contents?.tokens?.[SUI]?.coins) {
      const total = wallet?.contents?.tokens[SUI].balance.valueOf();
      if (prevTotal !== total) {
        let suiCoins = wallet?.contents?.tokens[SUI].coins.sort((a, b) => {
          return parseInt(b.balance) - parseInt(a.balance);
        });
        suiCoins = suiCoins.map((a) => ({ id: a.id, data: { balance: a.balance } }));
        updateGasObjects(suiCoins);
        dispatch(setBalances(suiCoins, total));
      }
    }
  }, [wallet]);

  return null;
};

export default EthosSync;
