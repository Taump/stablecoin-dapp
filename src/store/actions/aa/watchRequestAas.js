import { isEqual } from "lodash";
import { notification } from "antd";

import client from "../../../socket";
import {
  createObjectNotification,
  createStringDescrForAa,
  t
} from "../../../utils";
import { ADD_AA_TO_LIST, ASSET_REQUEST } from "../../types/aa";
import { deployRequest, pendingDeployResponse } from "../deploy";
import { ADD_AA_NOTIFICATION } from "../../types/notifications";
import { changeActiveAA } from "./index";

const openNotificationRequest = (address, event) => {
  notification.open({
    message: address,
    description: event,
    // duration: null,
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
          if (
            store.deploy.pending &&
            params &&
            isEqual(store.deploy.deployAaPrams, params)
          ) {
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
      } else if (result[1].subject === "light/aa_response") {
        const AA = result[1].body.aa_address;
        const aaVars = await client.api.getAaStateVars({ address: AA });
        if (result[1].body && result[1].body.response) {
          const notificationObject = createObjectNotification.res(
            result[1].body,
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
          }
        }
      }
    });
  } catch (e) {
    console.log("error", e);
  }
};
