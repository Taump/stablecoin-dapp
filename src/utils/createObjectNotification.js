import { isEmpty } from "lodash";
import { t } from "../utils";
const createObjectResponseNotification = (data, aaVars) => {
  const address = data.aa_address;
  const upd = data.updatedStateVars;
  const trigger_unit = data.trigger_unit;
  if (!isEmpty(data.response)) {
    const res = data.response;
    const time = data.objResponseUnit && data.objResponseUnit.timestamp;
    if (res.responseVars && !data.bounced) {
      const resVars = res.responseVars;
      if ("asset" in resVars) {
        return {
          AA: address,
          title: t("notifications.asset.res.title"),
          tag: "res_asset",
          time,
          trigger_unit
        };
      } else if ("amount" in resVars && "id" in resVars) {
        return {
          AA: address,
          title: t("notifications.issueStablecoin.res.title", {
            address: data.objResponseUnit.authors["0"].address
          }),
          tag: "res_stable",
          time,
          trigger_unit
        };
      } else if ("collateral" in resVars) {
        return {
          AA: address,
          title: t("notifications.addCollateral.res.title"),
          tag: "res_collateral",
          time,
          trigger_unit
        };
      } else if ("new_bid" in resVars && "id" in resVars) {
        return {
          AA: address,
          title: t("notifications.seize.res.title"),
          tag: "res_seize",
          time,
          trigger_unit,
          meta: {
            id: resVars.id,
            newBid: resVars.new_bid,
            timestamp: resVars.auction_end_ts
          }
        };
      } else if ("new_owner" in resVars && "new_collateral" in resVars) {
        return {
          AA: address,
          title: t("notifications.end_auction.res.title"),
          tag: "res_au_end",
          time,
          trigger_unit
        };
      } else if ("expiry_exchange_rate" in resVars) {
        return {
          AA: address,
          title: t("notifications.expire.res.title"),
          tag: "res_expire",
          time,
          trigger_unit
        };
      }
    } else if ("error" in res) {
      return {
        AA: address,
        title: res.error,
        tag: "error",
        time: data.timestamp,
        trigger_unit
      };
    } else {
      return undefined;
    }
  } else if (upd) {
    return {
      AA: address,
      title: t("notifications.repay.res.title", {
        address: data.trigger_address
      }),
      tag: "req_repay",
      time: data.timestamp,
      trigger_unit
    };
  } else {
    return undefined;
  }
};

const createObjectRequestNotification = (data, aaVars) => {
  if (
    data.body.unit.messages[0].payload &&
    data.body.unit.messages[1] &&
    data.body.unit.messages[1].payload
  ) {
    const messages = data.body.unit.messages;
    const payload = messages[0].payload;
    const AA = data.body.aa_address;
    const time = data.body.unit.timestamp;
    const trigger_unit = data.body.unit.unit;
    if ("define" in payload) {
      return {
        AA,
        title: t("notifications.asset.req.title", {
          address: data.body.unit.authors["0"].address
        }),
        tag: "req_asset",
        time,
        trigger_unit
      };
    } else if ("repay" in payload) {
      return {
        AA,
        title: t("notifications.repay.req.title", {
          address: data.body.unit.authors["0"].address
        }),
        tag: "req_repay",
        time,
        trigger_unit
      };
    } else if ("add_collateral" in payload) {
      return {
        AA,
        title: t("notifications.addCollateral.req.title", {
          address: data.body.unit.authors["0"].address
        }),
        tag: "req_collateral",
        time,
        trigger_unit
      };
    } else if ("seize" in payload) {
      const id = payload.id;
      const payOut = messages[1].payload.outputs;
      const newBid =
        payOut[0].address === AA ? payOut[0].amount : payOut[1].amount;
      const timestamp = data.body.unit.timestamp;
      if (id && newBid && timestamp) {
        return {
          AA,
          title: t("notifications.seize.req.title"),
          tag: "req_seize",
          time,
          trigger_unit,
          meta: { id, newBid, timestamp }
        };
      }
      return undefined;
    } else if ("end_auction" in payload) {
      return {
        AA,
        title: t("notifications.end_auction.req.title"),
        tag: "req_end",
        time,
        trigger_unit
      };
    } else if ("expire" in payload) {
      return {
        AA,
        title: t("notifications.expire.req.title"),
        tag: "req_expire",
        time,
        trigger_unit
      };
    } else {
      return undefined;
    }
  } else {
    const time = data.body.unit.timestamp;
    const trigger_unit = data.body.unit.unit;
    const AA = data.body.aa_address;
    const unit = data.body.unit;
    if (
      unit &&
      unit.authors &&
      unit.authors["0"] &&
      unit.authors["0"].address
    ) {
      return {
        AA,
        title: t("notifications.issueStablecoin.req.title", {
          address: data.body.unit.authors["0"].address
        }),
        tag: "req_stable",
        time,
        trigger_unit
      };
    }
  }
};

export const createObjectNotification = {
  res: createObjectResponseNotification,
  req: createObjectRequestNotification
};
