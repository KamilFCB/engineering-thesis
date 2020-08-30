import React, { Component, Fragment } from "react";
import ManageTournamentMatches from "./ManageTournamentMatches";
import StartTournament from "./StartTournament";

export class ManageTournament extends Component {
  /**
   * Tournament management view
   */
  render() {
    const tournamentId = this.props.match.params.id;
    return (
      <div className="container">
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <a
              className="nav-link active"
              data-toggle="tab"
              href="#startTournament"
            >
              Rozpocznij turniej
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" data-toggle="tab" href="#matches">
              Wyniki meczów
            </a>
          </li>
        </ul>
        <div id="myTabContent" className="tab-content">
          <Fragment>
            <StartTournament tournamentId={tournamentId} />
            <ManageTournamentMatches tournamentId={tournamentId} />
          </Fragment>
        </div>
      </div>
    );
  }
}

export default ManageTournament;
