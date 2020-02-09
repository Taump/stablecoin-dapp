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
