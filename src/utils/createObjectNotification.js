import { isEmpty } from "lodash";
import { t } from "../utils";
const createObjectResponseNotification = (data, aaVars) => {
  const address = data.aa_address;
  if (!isEmpty(data.response)) {
    const res = data.response;
    const time = data.objResponseUnit && data.objResponseUnit.timestamp;
    const trigger_unit = data.trigger_unit;

    if (res.responseVars) {
      const resVars = res.responseVars;
      if ("asset" in resVars) {
        return {
          AA: address,
          title: t("notifications.asset.res.title"),
          tag: "res_asset",
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
  } else {
    return undefined;
  }
};

const createObjectRequestNotification = (data, aaVars) => {
  console.log("data request", data);
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
        title: t("notifications.asset.req.title"),
        tag: "req_asset",
        time,
        trigger_unit
      };
    } else {
      return undefined;
    }
  } else {
    return undefined;
  }
};

export const createObjectNotification = {
  res: createObjectResponseNotification,
  req: createObjectRequestNotification
};
