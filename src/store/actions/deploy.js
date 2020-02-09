import {
  PENDING_DEPLOY_REQUEST,
  REQUEST_DEPLOY,
  CANCEL_PENDING_DEPLOY_REQUEST,
  RESPONSE_PENDING_DEPLOY
} from "../types/deploy";
import history from "../../history";
import client from "../../socket";
import { message } from "antd";
import { redirect } from "../../utils";

export const pendingDeployRequest = (params, url) => async (
  dispatch,
  getState
) => {
  const store = getState();
  const pending = store.deploy.pending;
  // Проверки на доступность data_feeds
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
    console.log("error getDataFeed", e);
  }
  if (!pending) {
    if (
      data_feed &&
      data_feed !== "none" &&
      data_feed_ma &&
      data_feed_ma !== "none"
    ) {
      redirect(url);
      dispatch({
        type: PENDING_DEPLOY_REQUEST,
        payload: params
      });
    } else {
      message.error("Data feeds is undefined");
    }
  }
};
export const deployRequest = address => async (dispatch, getState) => {
  const store = getState();
  const pending = store.deploy.pending;
  if (pending) {
    await dispatch({
      type: REQUEST_DEPLOY,
      payload: address
    });
  }
  history.push("/");
};

export const cancelPendingDeployRequest = () => ({
  type: CANCEL_PENDING_DEPLOY_REQUEST
});

export const pendingDeployResponse = () => ({
  type: RESPONSE_PENDING_DEPLOY
});
