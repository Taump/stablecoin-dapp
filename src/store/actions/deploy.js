import {
  PENDING_DEPLOY_REQUEST,
  REQUEST_DEPLOY,
  CANCEL_PENDING_DEPLOY_REQUEST,
  RESPONSE_PENDING_DEPLOY
} from "../types/deploy";
import history from "../../history";

export const pendingDeployRequest = params => async (dispatch, getState) => {
  const store = getState();
  const pending = store.deploy.pending;
  if (!pending) {
    dispatch({
      type: PENDING_DEPLOY_REQUEST,
      payload: params
    });
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
