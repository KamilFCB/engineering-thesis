import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "../store";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";

import Header from "./layout/Header";
import MainPage from "./layout/MainPage";
import Login from "./accounts/Login";
import Register from "./accounts/Register";
import PrivateRoute from "./common/PrivateRoute";
import { loadUser } from "../actions/auth";

class App extends React.Component {
  componentDidMount() {
    store.dispatch(loadUser());
  }

  render() {
    return (
      <Provider store={store}>
        <HashRouter>
          <Fragment>
            <Header />
            <div className="container">
              <Switch>
                <Route exact path="/" component={MainPage} />
                <Route exact path="/register" component={Register} />
                <Route exact path="/login" component={Login} />
              </Switch>
            </div>
          </Fragment>
        </HashRouter>
      </Provider>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
