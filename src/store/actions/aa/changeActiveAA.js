import { notification } from "antd";

import { isAddressByBase } from "../../../utils";
import client from "../../../socket";
import { CHANGE_ACTIVE_AA } from "../../types/aa";
import { subscribeAA } from "./";
import { initAuction } from "../auction";
import moment from "moment";

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
    const DateNow = moment()
      .utc(false)
      .unix();

    const isExpired = DateNow > moment.utc(params.expiry_date).unix();

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
            data_feed_ma,
            isExpired
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
          } else if (field.length === 3) {
            const name = field[0];
            const type = field[1] + "_" + field[2];
            coins[name] = {
              ...coins[name],
              [type]: aaState[fields]
            };
          } else if (field.length === 4) {
            const name = field[0];
            const type = field[1] + "_" + field[2] + "_" + field[3];
            coins[name] = {
              ...coins[name],
              [type]: aaState[fields]
            };
          }
        }
        const auctionCoins = {};
        for (let id in coins) {
          if (
            !("expired" in coins[id]) &&
            "amount" in coins[id] &&
            !("repaid" in coins[id]) &&
            "collateral" in coins[id] &&
            Number(coins[id].amount) !== 0
          ) {
            const exchange_rate = Number(data_feed_ma);
            const decimals = params.decimals;
            const liquidation_ratio = Number(params.liquidation_ratio);
            const overcollateralization_ratio = Number(
              params.overcollateralization_ratio
            );
            const amount = Number(coins[id].amount);

            const min_collateral =
              (amount / Math.pow(10, decimals) / exchange_rate) * 1000000000;

            const min_collateral_liquidation = Math.round(
              Number(min_collateral) * liquidation_ratio
            );

            // const percent = Math.ceil(
            //   (coins[id].collateral / min_collateral) * 100
            // );

            coins[id].atAuction =
              Number(coins[id].collateral) < min_collateral_liquidation;

            // coins[id].percent = percent;
            if (coins[id].collateral < min_collateral_liquidation) {
              const DateNow = moment().unix();
              // const isEnded = moment(DateNow).isSameOrBefore(
              //     moment.unix(Number(coins[id].auction_end_ts))
              // );
              const isEnded =
                moment(DateNow) > Number(coins[id].auction_end_ts);
              auctionCoins[id] = { ...coins[id] };
              auctionCoins[id].opening_collateral = Math.round(
                min_collateral * overcollateralization_ratio
              );
              if (!("winner_bid" in coins[id])) {
                auctionCoins[id].status = "open";
              } else if ("winner_bid" in coins[id] && isEnded) {
                auctionCoins[id].status = "end";
              } else if ("winner_bid" in coins[id] && !isEnded) {
                auctionCoins[id].status = "active";
              }
            }
          }
        }
        await dispatch(initAuction(auctionCoins));

        await dispatch({
          type: CHANGE_ACTIVE_AA,
          payload: {
            address,
            aaVars: aaState,
            params,
            coins,
            data_feed,
            data_feed_ma,
            isExpired
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
