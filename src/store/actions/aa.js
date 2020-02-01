import { isEqual } from "lodash";
import { notification } from "antd";
import {
  SUBSCRIBE_BASE_AA,
  LOAD_AA_LIST_REQUEST,
  LOAD_AA_LIST_SUCCESS,
  SUBSCRIBE_AA,
  CHANGE_ACTIVE_AA,
  ADD_AA_TO_LIST,
  ASSET_REQUEST
} from "../types/aa";
import { ADD_AA_NOTIFICATION } from "../types/notifications";
import { deployRequest, pendingDeployResponse } from "../actions/deploy";
import client from "../../socket";
import config from "../../config";
import {
  createStringDescrForAa,
  isAddressByBase,
  createObjectNotification,
  t
} from "../../utils";
export const subscribeBaseAA = () => async dispatch => {
  await client.justsaying("light/new_aa_to_watch", {
    aa: config.BASE_AA
  });
  await dispatch({
    type: SUBSCRIBE_BASE_AA
  });
};
export const getAasByBase = () => async dispatch => {
  try {
    await dispatch({
      type: LOAD_AA_LIST_REQUEST
    });
    const aaByBase = await client.api.getAasByBaseAas({
      base_aa: config.BASE_AA
    });
    if (aaByBase && aaByBase !== []) {
      aaByBase.forEach(aa => {
        const { feed_name, expiry_date } = aa.definition[1].params;
        aa.view = createStringDescrForAa(aa.address, feed_name, expiry_date);
      });
    }
    await dispatch({
      type: LOAD_AA_LIST_SUCCESS,
      payload: aaByBase || []
    });
  } catch (e) {
    console.log("error", e);
  }
};

const openNotificationRequest = (address, event) => {
  notification.open({
    message: address,
    description: event,
    style: { minWidth: 350 }
  });
};
export const watchRequestAas = () => (dispatch, getState) => {
  try {
    client.subscribe(async (err, result) => {
      const store = getState();
      const aaActive = store.aa.active;
      if (result[1].subject === "light/aa_definition") {
        const address =
          result[1].body.messages[0].payload &&
          result[1].body.messages[0].payload.address;
        if (address) {
          openNotificationRequest(
            t("notifications.deploy.req.title"),
            t("notifications.deploy.req.subTitle", { address })
          );
          const params =
            result[1].body.messages[0].payload.definition &&
            result[1].body.messages[0].payload.definition[1] &&
            result[1].body.messages[0].payload.definition[1].params;
          console.log(
            "params",
            params,
            store.deploy.deployAaPrams,
            isEqual(store.deploy.deployAaPrams, params)
          );
          if (
            store.deploy.pending &&
            params &&
            isEqual(store.deploy.deployAaPrams, params)
          ) {
            console.log("Is true");
            const address = result[1].body.messages[0].payload.address;
            const definition = result[1].body.messages[0].payload.definition;
            if (address && definition) {
              const { feed_name, expiry_date } = definition[1].params;
              const view = createStringDescrForAa(
                address,
                feed_name,
                expiry_date
              );
              await dispatch({
                type: ADD_AA_TO_LIST,
                payload: { address, definition, view }
              });
              await dispatch(deployRequest(address));
              await dispatch(changeActiveAA(address));
            }
          }
        }
      } else if (result[1].subject === "light/aa_definition_saved") {
        const address =
          result[1].body.messages[0].payload &&
          result[1].body.messages[0].payload.address;
        const definition =
          result[1].body.messages[0].payload &&
          result[1].body.messages[0].payload.definition;
        if (address && definition) {
          openNotificationRequest(
            t("notifications.deploy.res.title"),
            t("notifications.deploy.res.subTitle", { address })
          );
          const { feed_name, expiry_date } = definition[1].params;
          const view = createStringDescrForAa(address, feed_name, expiry_date);
          dispatch({
            type: ADD_AA_TO_LIST,
            payload: { address, definition, view }
          });
          if (address === store.deploy.wasIssued) {
            dispatch(pendingDeployResponse());
          }
        }
      } else if (result[1].subject === "light/aa_request") {
        const AA = result[1].body.aa_address;
        const aaVars =
          store.deploy.wasIssued !== AA
            ? await client.api.getAaStateVars({ address: AA })
            : {};
        if (
          result[1].body &&
          result[1].body.aa_address &&
          result[1].body.unit.messages &&
          result[1].body.unit.messages[0]
        ) {
          const notificationObject = createObjectNotification.req(
            result[1],
            aaVars
          );
          if (
            (notificationObject && notificationObject.AA === aaActive) ||
            (!aaActive && notificationObject)
          ) {
            openNotificationRequest(
              notificationObject.AA,
              notificationObject.title
            );
            dispatch({
              type: ADD_AA_NOTIFICATION,
              payload: notificationObject
            });
            if (
              aaActive === notificationObject.AA &&
              notificationObject.tag === "req_asset"
            ) {
              dispatch({
                type: ASSET_REQUEST
              });
            }
          }
        }
      }
    });
  } catch (e) {
    console.log("error", e);
  }
};

export const subscribeAA = address => async (dispatch, getState) => {
  const store = getState();
  const subscriptions = store.aa.subscriptions;
  const isSubscription = subscriptions.filter(aa => aa === address).length > 0;
  if (!isSubscription) {
    await client.justsaying("light/new_aa_to_watch", {
      aa: address
    });

    await dispatch({
      type: SUBSCRIBE_AA,
      payload: address
    });
  }
};
export const changeActiveAA = address => async (dispatch, getState) => {
  try {
    const store = getState();
    const isValid = await isAddressByBase(address);
    const definitionActive = store.aa.listByBase.filter(
      aa => aa.address === address
    );
    const params =
      definitionActive && definitionActive[0].definition["1"].params;
    console.log(params);
    // const params = {};

    if (isValid || store.deploy.wasIssued) {
      if (store.deploy.wasIssued) {
        await dispatch({
          type: CHANGE_ACTIVE_AA,
          payload: { address, aaVars: {}, params, coins: {} }
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
          payload: { address, aaVars: aaState, params, coins }
        });
      }
      const subscriptions = store.aa.subscriptions;
      const isSubscription =
        subscriptions.filter(aa => aa === address).length > 0;
      // await dispatch(getAllNotificationAA(address));
      if (!isSubscription) {
        await dispatch(subscribeAA(address));
      }
    } else {
      console.log("Address is not found");
      notification["error"]({
        message: "Address is not found"
      });
    }
  } catch (e) {
    console.log("error", e);
  }
};
