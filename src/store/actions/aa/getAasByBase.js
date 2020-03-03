import { LOAD_AA_LIST_REQUEST, LOAD_AA_LIST_SUCCESS } from "../../types/aa";
import client from "../../../socket";
import config from "../../../config";
import { createStringDescrForAa } from "../../../utils";

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
        aa.isStable = true;
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
