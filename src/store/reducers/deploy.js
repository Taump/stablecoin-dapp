import {
  PENDING_DEPLOY_REQUEST,
  REQUEST_DEPLOY,
  CANCEL_PENDING_DEPLOY_REQUEST,
  RESPONSE_PENDING_DEPLOY,
  ADD_TO_TOKEN_REGISTRY_SWITCH,
  CHECK_TOKEN_PENDING,
  CHECK_TOKEN,
  CHECK_TOKEN_CLEAR,
  ADD_TO_TOKEN_REGISTRY_CLOSE
} from "../types/deploy";

const initialState = {
  pending: false,
  deployAaPrams: null,
  wasIssued: null,
  registryToken: false,
  checkToken: null,
  checkTokenPending: false
};

export const deployReducer = (state = initialState, action) => {
  switch (action.type) {
    case PENDING_DEPLOY_REQUEST: {
      return {
        ...state,
        pending: true,
        deployAaPrams: action.payload,
        wasIssued: null,
        registryToken: false
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
        wasIssued: null,
        registryToken: false
      };
    }
    case RESPONSE_PENDING_DEPLOY: {
      return {
        ...state,
        pending: false,
        deployAaPrams: null,
        wasIssued: null,
        registryToken: false
      };
    }
    case ADD_TO_TOKEN_REGISTRY_SWITCH: {
      return {
        ...state,
        registryToken: action.payload
      };
    }
    case CHECK_TOKEN_PENDING: {
      return {
        ...state,
        checkTokenPending: true
      };
    }
    case CHECK_TOKEN: {
      return {
        ...state,
        checkTokenPending: false,
        checkToken: action.payload
      };
    }
    case CHECK_TOKEN_CLEAR: {
      return {
        ...state,
        checkToken: null
      };
    }
    case ADD_TO_TOKEN_REGISTRY_CLOSE: {
      return {
        ...state,
        registryToken: false,
        checkToken: null,
        checkTokenPending: false
      };
    }
    default:
      return state;
  }
};
