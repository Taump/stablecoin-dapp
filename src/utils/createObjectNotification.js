import { isEmpty } from "lodash";

const createObjectResponseNotification = (data, aaVars) => {
  // console.log("data response", data);
  const address = data.aa_address;
  if (!isEmpty(data.response)) {
    const res = data.response;
    const time = data.objResponseUnit && data.objResponseUnit.timestamp;
    const trigger_unit = data.trigger_unit;

    if (res.responseVars) {
      const resVars = res.responseVars;
      if ("yes_asset" in resVars) {
        return {
          AA: address,
          title: "Yes_asset was issued",
          tag: "res_yes",
          time,
          trigger_unit
        };
      } else if ("no_asset" in resVars) {
        return {
          AA: address,
          title: "No_asset was issued",
          tag: "res_no",
          time,
          trigger_unit
        };
      } else if ("winner" in resVars) {
        return {
          AA: address,
          title: `${resVars.winner}_asset was chosen as the winner by ${data.trigger_address}`,
          tag: "res_winner",
          time: data.timestamp,
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
    if (data.objResponseUnit) {
      const trigger_unit = data.trigger_unit;
      const objResponseUnit = data.objResponseUnit;
      const time = objResponseUnit.timestamp;
      if (objResponseUnit.messages) {
        const msg = objResponseUnit.messages;
        if (aaVars.yes_asset && aaVars.no_asset) {
          if (
            msg[0] &&
            msg[0].payload &&
            msg[0].payload.asset === aaVars.yes_asset &&
            msg[1] &&
            msg[1].payload &&
            msg[1].payload.asset === aaVars.no_asset
          ) {
            if (
              msg[0].payload.inputs &&
              msg[0].payload.inputs[0] &&
              msg[0].payload.inputs[0].type === "issue" &&
              msg[1].payload.inputs &&
              msg[1].payload.inputs[0] &&
              msg[1].payload.inputs[0].type === "issue"
            ) {
              const recipientAmount = msg[0].payload.inputs[0].amount;
              return {
                AA: address,
                title: `${data.trigger_address} invested ${recipientAmount} bytes`,
                tag: "res_invest",
                time,
                trigger_unit
              };
            }
          } else if (
            msg[0] &&
            msg[0].payload.inputs &&
            "unit" in msg[0].payload.inputs[0] &&
            "unit" in msg[0].payload.inputs[1]
          ) {
            // console.log("bought", data);
            let amount = null;
            if (msg[0].payload.outputs[0].address === data.trigger_address) {
              amount = msg[0].payload.outputs[0].amount;
            } else if (
              msg[0].payload.outputs[1].address === data.trigger_address
            ) {
              amount = msg[0].payload.outputs[1].amount;
            }
            if (amount) {
              return {
                AA: address,
                title: `${data.trigger_address} bought ${amount} bytes`,
                tag: "res_bought",
                time,
                trigger_unit
              };
            }
          }
        }
      } else {
        return undefined;
      }
    }
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
    const assetWinner =
      aaVars &&
      aaVars.winner &&
      aaVars.yes_asset &&
      aaVars.no_asset &&
      aaVars[aaVars.winner + "_asset"];
    if ("define_yes" in payload) {
      return {
        AA,
        title: "Request for issue yes_asset",
        tag: "req_yes",
        time,
        trigger_unit
      };
    } else if ("define_no" in payload) {
      return {
        AA,
        title: "Request for issue no_asset",
        tag: "req_no",
        time,
        trigger_unit
      };
    } else if ("winner" in payload) {
      const author = data.body.unit.authors[0].address;
      return {
        AA,
        title: `Request to select a winner by ${author}`,
        tag: "req_winner",
        time,
        trigger_unit
      };
    } else if (
      assetWinner &&
      data.body.unit.messages[1].payload.asset === assetWinner
    ) {
      const amount =
        data.body.unit.messages[1].payload.outputs &&
        data.body.unit.messages[1].payload.outputs[0] &&
        data.body.unit.messages[1].payload.outputs[0].amount;

      const author =
        data.body.unit.authors && data.body.unit.authors[0].address;

      if (amount && author) {
        console.log("redemption", data);
        return {
          AA: AA,
          title: `Redemption Request ${amount} bytes by ${author}`,
          tag: "req_rede",
          time,
          trigger_unit
        };
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  } else if (
    "yes_asset" in aaVars &&
    "no_asset" in aaVars &&
    !("winner" in aaVars)
  ) {
    const AA = data.body.aa_address;
    const time = data.body.unit.timestamp;
    const trigger_unit = data.body.unit.unit;
    let amount = null;
    let author = null;
    if (data.body.unit.messages[0].payload.outputs[0].address === AA) {
      amount = data.body.unit.messages[0].payload.outputs[0].amount;
      author = data.body.unit.messages[0].payload.outputs[1].address;
    } else if (data.body.unit.messages[0].payload.outputs[1].address === AA) {
      amount = data.body.unit.messages[0].payload.outputs[1].amount;
      author = data.body.unit.messages[0].payload.outputs[0].address;
    }
    if (amount && author) {
      return {
        AA: AA,
        title: `Investment Request ${amount} bytes by ${author}`,
        tag: "req_invest",
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

export default {
  res: createObjectResponseNotification,
  req: createObjectRequestNotification
};
