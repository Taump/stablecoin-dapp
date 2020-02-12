import client from "../../../socket";
import { UPDATE_INFO_ACTIVE_AA } from "../../types/aa";

export const updateInfoActiveAA = address => async (dispatch, getState) => {
  try {
    const store = getState();
    if (store.deploy.wasIssued !== address) {
      const params = store.aa.activeParams;
      const aaState = await client.api.getAaStateVars({ address });
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
        console.log(e);
      }
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
      dispatch({
        type: UPDATE_INFO_ACTIVE_AA,
        payload: { address, aaVars: aaState, data_feed, data_feed_ma, coins }
      });
    }
  } catch (e) {
    console.log("error", e);
  }
};
