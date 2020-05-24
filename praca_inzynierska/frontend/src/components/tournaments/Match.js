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
    this.props.getTournamentMatch(
      this.props.match.params.tournamentId,
      this.props.match.params.matchId
    );
  }

  componentDidUpdate(prevProps) {
    // console.log(this.props);
    if (prevProps.tournament != this.props.tournament) {
      this.setState({
        isLoading: this.props.tournament.isLoading,
        match: this.props.tournament.match,
      });
    }
  }

  render() {
    const { isLoading, match } = this.state;
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
          <div className="col-md-4">
            <h3 className="font-weight-bold">
              <Link to={"/gracz/" + match.player2.id}>
                {match.player1.first_name} {match.player1.last_name}
              </Link>
            </h3>
            <h6>{match.player1.birth_date}</h6>
            <h6>{match.player1.residence}</h6>
          </div>
          <div className="col-md-4">
            <h2>{match.score}</h2>
          </div>
          <div className="col-md-4">
            <h3 className="font-weight-bold">
              <Link to={"/gracz/" + match.player2.id}>
                {match.player2.first_name} {match.player2.last_name}
              </Link>
            </h3>
            <h6>{match.player2.birth_date}</h6>
            <h6>{match.player2.residence}</h6>
          </div>
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
