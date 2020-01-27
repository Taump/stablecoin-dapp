import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import thunk from "redux-thunk";
import { aaReducer } from "./reducers/aa";
import { deployReducer } from "./reducers/deploy";

const rootReducer = combineReducers({
  aa: aaReducer,
  deploy: deployReducer
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
