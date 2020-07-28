import React, { Component, Fragment } from "react";
import TournamentInformation from "./TournamentInformation";
import TournamentParticipants from "./TournamentParticipants";
import TournamentMatches from "./TournamentMatches";

export class Tournament extends Component {
  render() {
    const tournamentId = this.props.match.params.id;
    return (
      <div className="container">
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <a
              className="nav-link active"
              data-toggle="tab"
              href="#information"
            >
              Informacje
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" data-toggle="tab" href="#draw">
              Drabinka
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" data-toggle="tab" href="#matches">
              Mecze
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" data-toggle="tab" href="#participants">
              Uczestnicy
            </a>
          </li>
        </ul>
        <div id="myTabContent" className="tab-content">
          <Fragment>
            <TournamentInformation tournamentId={tournamentId} />
            <TournamentMatches tournamentId={tournamentId} />
            <TournamentParticipants tournamentId={tournamentId} />
          </Fragment>
        </div>
      </div>
    );
  }
}

export default Tournament;
