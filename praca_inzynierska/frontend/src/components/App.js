import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "../store";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import { Provider as AlertProvider, positions, transitions } from "react-alert";
import AlertTemplate from "react-alert-template-basic";

import Header from "./layout/Header";
import Alert from "./layout/Alert";
import MainPage from "./layout/MainPage";
import Login from "./accounts/Login";
import Profile from "./accounts/Profile";
import Register from "./accounts/Register";
import CreateTournament from "./tournaments/CreateTournament";
import Tournaments from "./tournaments/Tournaments";
import PrivateRoute from "./common/PrivateRoute";
import { loadUser } from "../actions/auth";

class App extends React.Component {
  // alert options
  options = {
    position: positions.TOP_CENTER,
    timeout: 4000,
    offset: "5px",
    transition: transitions.SCALE,
  };

  componentDidMount() {
    store.dispatch(loadUser());
  }

  render() {
    return (
      <Provider store={store}>
        <AlertProvider template={AlertTemplate} {...this.options}>
          <HashRouter>
            <Fragment>
              <Header />
              <div className="container">
                <Switch>
                  <Route exact path="/" component={MainPage} />
                  <Route exact path="/register" component={Register} />
                  <Route exact path="/login" component={Login} />
                  <Route exact path="/tournaments" component={Tournaments} />
                  <PrivateRoute exact path="/profile" component={Profile} />
                  <PrivateRoute
                    exact
                    path="/create_tournament"
                    component={CreateTournament}
                  />
                </Switch>
              </div>
              <Alert />
            </Fragment>
          </HashRouter>
        </AlertProvider>
      </Provider>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
