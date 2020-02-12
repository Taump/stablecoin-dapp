import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import "antd/dist/antd.css";
import "./i18n";
import AppRouter from "./AppRouter";
import store from "./store";
import { WatcherUpdate } from "./components/WatcherUpdate/WatcherUpdate";

ReactDOM.render(
  <Provider store={store}>
    <WatcherUpdate>
      <AppRouter />
    </WatcherUpdate>
  </Provider>,
  document.getElementById("root")
);
