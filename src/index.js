import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import "antd/dist/antd.css";

import AppRouter from "./AppRouter";

import store from "./store";

ReactDOM.render(
  <Provider store={store}>
    <AppRouter />
  </Provider>,
  document.getElementById("root")
);
