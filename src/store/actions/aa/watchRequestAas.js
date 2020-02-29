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
import {
  addBidForCoinAuction,
  endAuctionRequest,
  endAuctionResponse
} from "../auction";
import { addCollateral } from "./addCollateral";
import { repayLoan } from "./repayLoan";
import { expiryExchangeRate } from "./expiryExchangeRate";
import { issueStableCoin } from "./issueStableCoin";

const openNotificationRequest = (address, event) => {
  notification.open({
    message: address,
    description: event,
    duration: null,
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
            } else if (
              aaActive === notificationObject.AA &&
              notificationObject.tag === "req_seize"
            ) {
              const meta = notificationObject.meta;
              dispatch(
                addBidForCoinAuction(
                  meta.id,
                  meta.newBid,
                  meta.timestamp,
                  false
                )
              );
            } else if (
              aaActive === notificationObject.AA &&
              notificationObject.tag === "req_repay"
            ) {
              const meta = notificationObject.meta;
              dispatch(repayLoan(meta.id, meta.address));
            } else if (
              aaActive === notificationObject.AA &&
              notificationObject.tag === "req_end"
            ) {
              const meta = notificationObject.meta;
              dispatch(endAuctionRequest(meta.id));
            }
          }
        }
      } else if (result[1].subject === "light/aa_response") {
        const AA = result[1].body.aa_address;
        const aaVars = await client.api.getAaStateVars({ address: AA });
        if (result[1].body && result[1].body.response) {
          const decimals = store.aa.activeParams.decimals;
          const notificationObject = createObjectNotification.res(
            result[1].body,
            aaVars,
            decimals
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
              notificationObject.tag === "res_seize"
            ) {
              const meta = notificationObject.meta;
              dispatch(
                addBidForCoinAuction(meta.id, meta.newBid, meta.timestamp, true)
              );
            } else if (
              aaActive === notificationObject.AA &&
              notificationObject.tag === "res_collateral"
            ) {
              const meta = notificationObject.meta;
              dispatch(addCollateral(meta.id, meta.collateral));
            } else if (
              aaActive === notificationObject.AA &&
              notificationObject.tag === "res_repay"
            ) {
              const meta = notificationObject.meta;
              dispatch(repayLoan(meta.id, meta.address));
            } else if (
              aaActive === notificationObject.AA &&
              notificationObject.tag === "res_expire"
            ) {
              const meta = notificationObject.meta;
              dispatch(expiryExchangeRate(meta.rate));
            } else if (
              aaActive === notificationObject.AA &&
              notificationObject.tag === "res_stable"
            ) {
              const meta = notificationObject.meta;
              dispatch(
                issueStableCoin({
                  id: meta.id,
                  owner: meta.owner,
                  collateral: meta.collateral,
                  amount: meta.amount
                })
              );
            } else if (
              aaActive === notificationObject.AA &&
              notificationObject.tag === "res_asset"
            ) {
              dispatch({
                type: ASSET_REQUEST
              });
            } else if (
              aaActive === notificationObject.AA &&
              notificationObject.tag === "res_au_end"
            ) {
              const meta = notificationObject.meta;
              if ("owner" in meta && "collateral" in meta && "id" in meta) {
                dispatch(
                  endAuctionResponse(meta.id, meta.owner, meta.collateral)
                );
              } else {
                dispatch(endAuctionRequest(meta.id));
              }
            }
          }
        }
      }
    });
  } catch (e) {
    console.log("error", e);
  }
};
