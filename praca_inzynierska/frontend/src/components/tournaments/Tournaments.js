import React, { Component, Fragment } from "react";
import IncomingTournaments from "./IncomingTournaments";
import TournamentsHistory from "./TournamentsHistory";

export class Tournaments extends Component {
  render() {
    return (
      <div className="container">
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <a
              className="nav-link active"
              data-toggle="tab"
              href="#incomingTournaments"
            >
              Nadchodzące turnieje
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              data-toggle="tab"
              href="#tournamentsHistory"
            >
              Historia turniejów
            </a>
          </li>
        </ul>
        <div id="myTabContent" className="tab-content">
          <Fragment>
            <IncomingTournaments />
            <TournamentsHistory />
          </Fragment>
        </div>
      </div>
    );
  }
}

export default Tournaments;
