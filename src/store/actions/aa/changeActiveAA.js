import { notification } from "antd";

import { isAddressByBase } from "../../../utils";
import client from "../../../socket";
import { CHANGE_ACTIVE_AA } from "../../types/aa";
import { subscribeAA } from "./";

export const changeActiveAA = address => async (dispatch, getState) => {
  try {
    const store = getState();
    const isValid = await isAddressByBase(address);
    const definitionActive = store.aa.listByBase.filter(
      aa => aa.address === address
    );
    const params =
      definitionActive && definitionActive[0].definition["1"].params;
    let data_feed;
    let data_feed_ma;
    try {
      data_feed = await client.api.getDataFeed({
        oracles: [params.oracle],
        feed_name: params.feed_name,
        ifnone: "none"
      });
      data_feed_ma = await client.api.getDataFeed({
        oracles: [params.oracle],
        feed_name: params.ma_feed_name,
        ifnone: "none"
      });
    } catch (e) {
      console.log("error", e);
    }
    if (isValid || store.deploy.wasIssued) {
      if (store.deploy.wasIssued === address) {
        await dispatch({
          type: CHANGE_ACTIVE_AA,
          payload: {
            address,
            aaVars: {},
            params,
            coins: {},
            data_feed,
            data_feed_ma
          }
        });
      } else {
        const aaState = await client.api.getAaStateVars({ address });
        let coins = {};
        for (const fields in aaState) {
          const field = fields.split("_");
          if (field.length === 2 && field[0] !== "circulating") {
            const [name, type] = field;
            coins[name] = {
              ...coins[name],
              [type]: aaState[fields]
            };
          }
        }
        await dispatch({
          type: CHANGE_ACTIVE_AA,
          payload: {
            address,
            aaVars: aaState,
            params,
            coins,
            data_feed,
            data_feed_ma
          }
        });
      }
      const subscriptions = store.aa.subscriptions;
      const isSubscription =
        subscriptions.filter(aa => aa === address).length > 0;
      if (!isSubscription) {
        await dispatch(subscribeAA(address));
      }
    } else {
      notification["error"]({
        message: "Address is not found"
      });
    }
  } catch (e) {
    console.log("error", e);
  }
};
