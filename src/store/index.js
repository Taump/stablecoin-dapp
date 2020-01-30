import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import thunk from "redux-thunk";
import { aaReducer } from "./reducers/aa";
import { deployReducer } from "./reducers/deploy";
import { notificationsReducer } from "./reducers/notifications";
const rootReducer = combineReducers({
  aa: aaReducer,
  deploy: deployReducer,
  notifications: notificationsReducer
});

export default createStore(
  rootReducer,
  compose(
    applyMiddleware(thunk),
    window.__REDUX_DEVTOOLS_EXTENSION__
      ? window.__REDUX_DEVTOOLS_EXTENSION__()
      : f => f
  )
);
