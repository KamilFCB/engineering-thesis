import React, { Component } from "react";
import PropTypes from "prop-types";
import { Spinner } from "../common/Spinner";
import { connect } from "react-redux";
import { getTournamentInformations } from "../../actions/tournament";
import { joinTournament, leaveTournament } from "../../actions/tournaments";

export class TournamentInformation extends Component {
  state = {
    id: null,
    name: null,
    city: null,
    address: null,
    date: null,
    drawSize: null,
    description: null,
    isLoading: true,
    endOfRegistration: null,
    participate: false,
    canJoin: false,
  };

  static propTypes = {
    getTournamentInformations: PropTypes.func.isRequired,
    joinTournament: PropTypes.func.isRequired,
    leaveTournament: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.getTournamentInformations(this.props.tournamentId);
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.tournament.informations != prevProps.tournament.informations
    ) {
      this.setState({
        id: this.props.tournament.informations.id,
        isLoading: this.props.tournament.isLoading,
        name: this.props.tournament.informations.name,
        city: this.props.tournament.informations.city,
        address: this.props.tournament.informations.address,
        date: this.props.tournament.informations.date,
        drawSize: this.props.tournament.informations.draw_size,
        description: this.props.tournament.informations.description,
        endOfRegistration: this.props.tournament.informations
          .end_of_registration,
        participate: this.props.tournament.informations.participate,
        canJoin: this.props.tournament.informations.can_join,
      });
    }
    if (
      this.props.tournaments.updatedTournament !=
        prevProps.tournaments.updatedTournament &&
      this.props.tournaments.updatedTournament
    ) {
      this.setState({
        participate: this.props.tournaments.updatedTournament.participate,
      });
    }
  }

  getButton = (participate, tournamentId, canJoin) => {
    const joinButton = (
      <button
        type="button"
        className={canJoin ? "btn btn-primary" : "btn btn-primary disabled"}
        onClick={() => this.props.joinTournament(tournamentId)}
      >
        Zapisz się
      </button>
    );
    const leaveButton = (
      <button
        type="button"
        className={canJoin ? "btn btn-primary" : "btn btn-primary disabled"}
        onClick={() =>
          canJoin ? this.props.leaveTournament(tournamentId) : {}
        }
      >
        Opuść turniej
      </button>
    );
    const registrationFinished = (
      <button type="button" className="btn btn-primary disabled">
        Zapisy zakończone
      </button>
    );

    if (participate) {
      return leaveButton;
    } else {
      if (canJoin) return joinButton;
      return registrationFinished;
    }
  };

  render() {
    const {
      id,
      isLoading,
      name,
      city,
      address,
      date,
      drawSize,
      description,
      canJoin,
      participate,
      endOfRegistration,
    } = this.state;
    const spinner = <Spinner />;
    const page = (
      <div className="tab-pane fade active show" id="information">
        <div className="card card-body">
          <table className="table table-striped table-dark table-bordered text-center">
            <thead>
              <tr>
                <th scope="col">Nazwa turnieju</th>
                <th scope="col">Data</th>
                <th scope="col">Miejscowość</th>
                <th scope="col">Adres</th>
                <th scope="col">Rozmiar drabinki</th>
                <th scope="col">Koniec zapisów</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{name}</td>
                <td>{date}</td>
                <td>{city}</td>
                <td>{address}</td>
                <td>{drawSize}</td>
                <td>{endOfRegistration}</td>
              </tr>
            </tbody>
          </table>
          <div className="row">
            <div className="col-md-4 offset-md-4 text-center">
              {this.getButton(participate, id, canJoin)}
            </div>
          </div>

          <p>{description}</p>
        </div>
      </div>
    );

    return isLoading ? spinner : page;
  }
}

const mapStateToProps = (state) => ({
  tournament: state.tournament,
  tournaments: state.tournaments,
});

export default connect(mapStateToProps, {
  joinTournament,
  leaveTournament,
  getTournamentInformations,
})(TournamentInformation);
