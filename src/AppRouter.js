import React from "react";
import { Router, Route } from "react-router-dom";

import { HomePage, AssetPage, DeployPage } from "./pages";

import history from "./history";

const AppRouter = () => {
  return (
    <Router history={history}>
      <Route exact path="/">
        <HomePage />
      </Route>
      <Route exact path="/asset">
        <AssetPage />
      </Route>
      <Route exact path="/deploy">
        <DeployPage />
      </Route>
    </Router>
  );
};

export default AppRouter;
