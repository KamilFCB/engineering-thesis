import React, { Component, Fragment } from "react";
import TennisProfile from "./TennisProfile";
import UserProfile from "./UserProfile";

export class Profile extends Component {
  render() {
    return (
      <div className="container">
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <a
              className="nav-link active"
              data-toggle="tab"
              href="#userProfile"
            >
              Dane użytkownika
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" data-toggle="tab" href="#tennisProfile">
              Profil tenisowy
            </a>
          </li>
        </ul>
        <div id="myTabContent" className="tab-content">
          <Fragment>
            <UserProfile />
            <TennisProfile />
          </Fragment>
        </div>
      </div>
    );
  }
}

export default Profile;
