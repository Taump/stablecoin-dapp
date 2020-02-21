import React from "react";
import { Router, Route } from "react-router-dom";

import { HomePage, DeployPage, AuctionPage } from "./pages";

import history from "./history";

const AppRouter = () => {
  return (
    <Router history={history}>
      <Route exact path="/">
        <HomePage />
      </Route>
      <Route exact path="/deploy">
        <DeployPage />
      </Route>
      <Route exact path="/auction">
        <AuctionPage />
      </Route>
    </Router>
  );
};

export default AppRouter;
