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
import PlayerProfile from "./accounts/PlayerProfile";
import Register from "./accounts/Register";
import CreateTournament from "./tournaments/CreateTournament";
import Tournaments from "./tournaments/Tournaments";
import Match from "./tournaments/Match";
import UserTournaments from "./tournaments/UserTournaments";
import Tournament from "./tournaments/Tournament";
import PrivateRoute from "./common/PrivateRoute";
import { loadUser } from "../actions/auth";
import ManageTournament from "./tournaments/ManageTournament";

class App extends React.Component {
  alertOptions = {
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
        <AlertProvider template={AlertTemplate} {...this.alertOptions}>
          <HashRouter>
            <Fragment>
              <Header />
              <div className="container">
                <Switch>
                  <Route exact path="/" component={MainPage} />
                  <Route exact path="/rejestracja" component={Register} />
                  <Route exact path="/logowanie" component={Login} />
                  <Route exact path="/turnieje" component={Tournaments} />
                  <PrivateRoute exact path="/profil" component={Profile} />
                  <PrivateRoute
                    exact
                    path="/utworz_turniej"
                    component={CreateTournament}
                  />
                  <Route exact path="/gracz/:id" component={PlayerProfile} />
                  <Route exact path="/turniej/:id" component={Tournament} />
                  <PrivateRoute
                    exact
                    path="/moje_turnieje"
                    component={UserTournaments}
                  />
                  <PrivateRoute
                    exact
                    path="/zarzadzaj/:id"
                    component={ManageTournament}
                  />
                  <Route
                    exact
                    path="/turniej/:tournamentId/mecz/:matchId"
                    component={Match}
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
