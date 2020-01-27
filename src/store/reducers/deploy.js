import {
  PENDING_DEPLOY_REQUEST,
  REQUEST_DEPLOY,
  CANCEL_PENDING_DEPLOY_REQUEST,
  RESPONSE_PENDING_DEPLOY
} from "../types/deploy";

const initialState = {
  pending: false,
  deployAaPrams: null,
  wasIssued: null
};

export const deployReducer = (state = initialState, action) => {
  switch (action.type) {
    case PENDING_DEPLOY_REQUEST: {
      return {
        ...state,
        pending: true,
        deployAaPrams: action.payload,
        wasIssued: null
      };
    }
    case REQUEST_DEPLOY: {
      return {
        ...state,
        pending: false,
        deployAaPrams: null,
        wasIssued: action.payload
      };
    }
    case CANCEL_PENDING_DEPLOY_REQUEST: {
      return {
        ...state,
        pending: false,
        deployAaPrams: null,
        wasIssued: null
      };
    }
    case RESPONSE_PENDING_DEPLOY: {
      return {
        ...state,
        pending: false,
        deployAaPrams: null,
        wasIssued: null
      };
    }
    default:
      return state;
  }
};
