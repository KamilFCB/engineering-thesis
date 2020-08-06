import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Redirect, Link } from "react-router-dom";
import {
  getTournamentMatch,
  getTournamentOrganizer,
  prevMatchWinner,
  updateMatch,
} from "../../actions/tournament";
import Spinner from "../common/Spinner";
import { isEmpty } from "lodash";

export class ManageMatch extends Component {
  state = {
    isLoading: true,
    matchId: null,
    player1: {},
    player2: {},
    prevPlayer1: {},
    prevPlayer2: {},
    tournament: {},
    time: null,
    score: "",
    round: null,
    tournamentOrganizer: false,
    matchNumber: null,
  };

  static propTypes = {
    getTournamentMatch: PropTypes.func.isRequired,
    getTournamentOrganizer: PropTypes.func.isRequired,
    prevMatchWinner: PropTypes.func.isRequired,
    updateMatch: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.getTournamentMatch(this.props.match.params.matchId);
    this.props.prevMatchWinner(this.props.match.params.matchId, "1");
    this.props.prevMatchWinner(this.props.match.params.matchId, "2");
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.tournament.match != this.props.tournament.match &&
      this.props.tournament.match
    ) {
      this.setState({
        matchId: this.props.tournament.match.id,
        player1: this.props.tournament.match.player1,
        player2: this.props.tournament.match.player2,
        tournament: this.props.tournament.match.tournament,
        round: this.props.tournament.match.round,
        score: this.props.tournament.match.score,
        time: this.props.tournament.match.time,
        matchNumber: this.props.tournament.match.match_number,
      });
      this.props.getTournamentOrganizer(
        this.props.tournament.match.tournament.id
      );
    }
    if (
      this.props.tournament.organizer &&
      prevProps.tournament.organizer != this.props.tournament.organizer
    ) {
      this.setState({
        isLoading: this.props.tournament.isLoading,
        tournamentOrganizer: this.props.tournament.organizer,
      });
    }
    if (
      this.props.tournament.prevMatchWinner &&
      prevProps.tournament.prevMatchWinner !=
        this.props.tournament.prevMatchWinner
    ) {
      if (this.props.tournament.prevMatchWinner.playerNumber == 1) {
        this.setState({
          prevPlayer1: this.props.tournament.prevMatchWinner.player,
        });
      } else {
        this.setState({
          prevPlayer2: this.props.tournament.prevMatchWinner.player,
        });
      }
    }
  }

  onChange = (e) => {
    if (
      e.target.value == "-" ||
      e.target.name == "score" ||
      e.target.name == "time"
    ) {
      this.setState({
        [e.target.name]: e.target.value,
      });
    } else {
      if (e.target.name == "player1") {
        this.setState({
          [e.target.name]: this.state.prevPlayer1,
        });
      } else {
        this.setState({
          [e.target.name]: this.state.prevPlayer2,
        });
      }
    }
  };

  onSubmit = (e) => {
    e.preventDefault();
    const newMatch = {
      matchId: this.state.matchId,
      player1:
        this.state.player1 && this.state.player1 != "-"
          ? this.state.player1.id
          : null,
      player2:
        this.state.player2 && this.state.player2 != "-"
          ? this.state.player2.id
          : null,
      score: this.state.score,
      time: this.state.time,
    };
    this.props.updateMatch(newMatch);
  };

  render() {
    const {
      isLoading,
      player1,
      player2,
      prevPlayer1,
      prevPlayer2,
      tournament,
      tournamentOrganizer,
      score,
      round,
      time,
      matchNumber,
    } = this.state;
    const userId = this.props.auth.user.id;
    const spinner = <Spinner />;
    const page = (
      <div className="card card-body">
        {tournament ? (
          <Link to={"/zarzadzaj/" + tournament.id}>Powrót</Link>
        ) : (
          ""
        )}
        <div className="row text-center">
          <div className="col-md-4 offset-md-4">
            <h2>{tournament.name}</h2>
          </div>
        </div>
        <h2>{`Edytuj mecz #${matchNumber}`}</h2>
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label>Gracz #1</label>
            <select
              name="player1"
              className="form-control"
              onChange={this.onChange}
              value={player1 ? player1.id : "-"}
            >
              {!isEmpty(prevPlayer1) ? (
                <option value={prevPlayer1.id}>
                  {prevPlayer1.first_name + " " + prevPlayer1.last_name}
                </option>
              ) : (
                <option value="-">{round == 1 ? "Wolny los" : "-"}</option>
              )}
            </select>
          </div>
          <div className="form-group">
            <label>Gracz #2</label>
            <select
              name="player2"
              className="form-control"
              onChange={this.onChange}
              value={player2 ? player2.id : "-"}
            >
              {!isEmpty(prevPlayer2) ? (
                <option value={prevPlayer2.id}>
                  {prevPlayer2.first_name + " " + prevPlayer2.last_name}
                </option>
              ) : (
                <option value="-">{round == 1 ? "Wolny los" : "-"}</option>
              )}
            </select>
          </div>
          <div className="form-group">
            <label>Godzina</label>
            <input
              className="form-control"
              type="time"
              name="time"
              onChange={this.onChange}
              value={time ? time : ""}
            />
          </div>
          <div className="form-group">
            <label>Wynik</label>
            <input
              className="form-control"
              type="text"
              name="score"
              onChange={this.onChange}
              value={score || ""}
            />
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-primary">
              Aktualizuj
            </button>
          </div>
        </form>
      </div>
    );
    const accessDenied = <Redirect to="/" />;
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
  getTournamentMatch,
  getTournamentOrganizer,
  prevMatchWinner,
  updateMatch,
})(ManageMatch);
