import { ADD_SYMBOL_BY_AA } from "../../types/aa";
import { createStringDescrForAa } from "../../../utils";

export const addSymbol = symbol => (dispatch, getState) => {
  const store = getState();
  const { feed_name, expiry_date } = store.aa.activeParams;
  const address = store.aa.active;
  const view = createStringDescrForAa(address, feed_name, expiry_date, symbol);
  dispatch({
    type: ADD_SYMBOL_BY_AA,
    payload: { address, symbol, view }
  });
};
