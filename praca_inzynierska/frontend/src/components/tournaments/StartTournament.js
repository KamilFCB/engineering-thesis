import React, { Component } from "react";
import PropTypes from "prop-types";
import { Spinner } from "../common/Spinner";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import {
  getTournamentInformations,
  getTournamentOrganizer,
  startTournament,
} from "../../actions/tournament";

export class StartTournament extends Component {
  /**
   * Shows tournament informations and button to start tournament
   */
  state = {
    tournamentOrganizer: null,
    name: null,
    city: null,
    address: null,
    date: null,
    drawSize: null,
    description: null,
    started: null,
    isLoading: true,
  };

  static propTypes = {
    getTournamentOrganizer: PropTypes.func.isRequired,
    getTournamentInformations: PropTypes.func.isRequired,
    startTournament: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.getTournamentInformations(this.props.tournamentId);
  }

  componentDidUpdate(previousProps) {
    if (
      previousProps.tournament.organizer != this.props.tournament.organizer &&
      this.props.tournament.organizer
    ) {
      this.setState({
        tournamentOrganizer: this.props.tournament.organizer,
        isLoading: false,
      });
    }
    if (
      this.props.tournament.informations !=
        previousProps.tournament.informations &&
      this.props.tournament.informations
    ) {
      this.setState({
        name: this.props.tournament.informations.name,
        city: this.props.tournament.informations.city,
        address: this.props.tournament.informations.address,
        date: this.props.tournament.informations.date,
        drawSize: this.props.tournament.informations.draw_size,
        description: this.props.tournament.informations.description,
        started: this.props.tournament.informations.started,
      });
      this.props.getTournamentOrganizer(this.props.tournamentId);
    }
    if (
      this.props.tournament.started != previousProps.tournament.started &&
      this.props.tournament.started
    ) {
      this.setState({
        started: this.props.tournament.started,
      });
    }
  }

  render() {
    const {
      tournamentOrganizer,
      isLoading,
      name,
      city,
      address,
      date,
      drawSize,
      description,
      started,
    } = this.state;
    const userId = this.props.auth.user.id;
    const spinner = <Spinner />;
    const accessDenied = <Redirect to="/" />;
    const page = (
      <div className="tab-pane fade active show" id="startTournament">
        <div className="card card-body">
          <table className="table table-striped table-dark table-bordered text-center">
            <thead>
              <tr>
                <th scope="col">Nazwa turnieju</th>
                <th scope="col">Data</th>
                <th scope="col">Miejscowość</th>
                <th scope="col">Adres</th>
                <th scope="col">Rozmiar drabinki</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{name ? name : ""}</td>
                <td>{date ? date : ""}</td>
                <td>{city ? city : ""}</td>
                <td>{address ? address : ""}</td>
                <td>{drawSize ? drawSize : ""}</td>
              </tr>
            </tbody>
          </table>
          <p>{description ? description : ""}</p>
          {started ? (
            <button type="button" className="btn btn-primary btn-lg disabled">
              Turniej rozpoczęty
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={() =>
                this.props.startTournament(this.props.tournamentId)
              }
            >
              Rozpocznij turniej
            </button>
          )}
        </div>
      </div>
    );
    return isLoading
      ? spinner
      : tournamentOrganizer == userId
      ? page
      : accessDenied;
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  tournament: state.tournament,
});

export default connect(mapStateToProps, {
  getTournamentOrganizer,
  getTournamentInformations,
  startTournament,
})(StartTournament);
