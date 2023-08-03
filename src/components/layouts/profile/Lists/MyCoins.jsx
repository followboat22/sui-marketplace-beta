import React, { useState, useEffect } from "react";
import { ethos } from "ethos-connect";
import { mystToSui } from "../../../../utils/formats";
import { mergeCoins, getUserCoins, updateGasObjects } from "../../../../web3/sui";
import ToastPopup from "../../../../components/utils/ToastPopup";
import { useDispatch, useSelector } from "react-redux";
import { setBalances } from "../../../../redux/state/sui";
import { sleep } from "../../../../utils/time";

const MyCoins = ({ setCount }) => {
  const dispatch = useDispatch();
  const coins = useSelector((state) => state.sui.suiObjects);
  const [coin1, setCoin1] = useState(false);
  const [coin2, setCoin2] = useState(false);

  const count = coins?.length || 0;

  useEffect(() => {
    setCount(count);
  }, [count]);

  const selectCoin = (index) => {
    if (coin1 === false) {
      setCoin1(index);
    } else if (index !== coin1) {
      setCoin2(index);
    }
  };

  const merge = async () => {
    const tx = await mergeCoins([coins[coin1].id, coins[coin2].id]);
    if (tx.status === "success") {
      await sleep();
      ToastPopup("Coins merged!", "success");
      let { total, suiObjects } = await getUserCoins();
      updateGasObjects(suiObjects);
      dispatch(setBalances(suiObjects, total));
    }
  };

  return (
    <div>
      <div className="row">
        <div className="col-3 coinbox">
          <h4> Coin A:</h4>
          <p>{coins[coin1]?.id}</p>
          {coin1 !== false && (
            <div>
              <p>Balance: {mystToSui(coins[coin1]?.data.balance)}</p>
              <button onClick={() => setCoin1(false)}>deselect</button>
            </div>
          )}
        </div>
        <div className="col-3 coinbox">
          <h4> Coin B:</h4>
          <p>{coins[coin2]?.id}</p>
          {coin2 !== false && (
            <div>
              <div>
                <p>Balance: {mystToSui(coins[coin2]?.data.balance)}</p>
                <button onClick={() => setCoin2(false)}>deselect</button>
              </div>
            </div>
          )}
        </div>
        <div className="col-2">
          <h2 className="ps-abs-mdl">=</h2>
        </div>
        <div className="col-4 coinbox">
          <h4>New Coin A:</h4>
          <p>{coins[coin1]?.id}</p>
          {coin1 !== false && coin2 !== false && (
            <div>
              <p>
                New Balance:{" "}
                {mystToSui(coins[coin1]?.data.balance) +
                  mystToSui(coins[coin2]?.data.balance)}
              </p>
              <button onClick={merge}>Merge</button>
            </div>
          )}
        </div>
      </div>
      <div className="content-item coinManager">
        {coins.map((item, index) => {
          const selected = index === coin1 || index === coin2;
          return (
            <div key={item.id} className={`col-item coin${selected ? " selected" : ""}`}>
              <div>Coin: {item.id}</div>
              <div>Balance: {mystToSui(item.data.balance)}</div>
              <button onClick={() => selectCoin(index)}>select</button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyCoins;
