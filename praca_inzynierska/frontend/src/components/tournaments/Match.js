import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { getTournamentMatch } from "../../actions/tournament";
import Spinner from "../common/Spinner";

export class Match extends Component {
  state = {
    isLoading: true,
    match: {},
  };

  static propTypes = {
    getTournamentMatch: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.getTournamentMatch(this.props.match.params.matchId);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.tournament != this.props.tournament) {
      console.log(this.props.tournament.match);
      this.setState({
        isLoading: this.props.tournament.isLoading,
        match: this.props.tournament.match,
      });
    }
  }

  render() {
    const { isLoading, match } = this.state;
    console.log(match);
    if (isLoading) return <Spinner />;
    const page = (
      <div className="card card-body">
        <h1 className="text-center">
          <Link to={"/turniej/" + match.tournament.id}>
            {match.tournament.name}
          </Link>
        </h1>
        <hr />
        <div className="row text-center">
          {match.player1 ? (
            <div className="col-md-4">
              <h3 className="font-weight-bold">
                <Link to={"/gracz/" + match.player1.id}>
                  {match.player1.first_name} {match.player1.last_name}
                </Link>
              </h3>
              <h6>{match.player1.birth_date}</h6>
              <h6>{match.player1.residence}</h6>
            </div>
          ) : (
            <div className="col-md-4">
              <h3 className="font-weight-bold">Wolny los</h3>
            </div>
          )}
          <div className="col-md-4">
            <h5>
              {match.time ? "Godzina: " + match.time.substring(0, 5) : ""}
            </h5>
            <h2>{match.score ? match.score : "Brak wyniku"}</h2>
          </div>
          {match.player2 ? (
            <div className="col-md-4">
              <h3 className="font-weight-bold">
                <Link to={"/gracz/" + match.player2.id}>
                  {match.player2.first_name} {match.player2.last_name}
                </Link>
              </h3>
              <h6>{match.player2.birth_date}</h6>
              <h6>{match.player2.residence}</h6>
            </div>
          ) : (
            <div className="col-md-4">
              <h3 className="font-weight-bold">Wolny los</h3>
            </div>
          )}
        </div>
      </div>
    );

    return page;
  }
}

const mapStateToProps = (state) => ({
  tournament: state.tournament,
});

export default connect(mapStateToProps, { getTournamentMatch })(Match);
