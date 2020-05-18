import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getTournamentMatches } from "../../actions/tournament";
import { Spinner } from "../common/Spinner";
import { Link } from "react-router-dom";

export class TournamentMatches extends Component {
  state = {
    isLoading: true,
    matches: [],
  };

  static propTypes = {
    getTournamentMatches: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.getTournamentMatches(this.props.tournamentId);
  }

  componentDidUpdate(prevProps) {
    if (this.props.tournament.matches != prevProps.tournament.matches) {
      this.setState({
        isLoading: this.props.tournament.isLoading,
        matches: this.props.tournament.matches.matches,
      });
    }
  }

  dd = (matches) => {
    return <h3>{matches.length}</h3>;
  };

  render() {
    const { isLoading, matches } = this.state;
    let round_matches = {};
    matches.forEach((match) => {
      if (Object.keys(round_matches).includes("Runda" + match.round)) {
        round_matches["Runda" + match.round].push(match);
      } else {
        round_matches["Runda" + match.round] = [match];
      }
    });
    const spinner = <Spinner />;
    const page = (
      <div className="tab-pane fade" id="matches">
        <div className="card card-body">
          {Object.entries(round_matches).map(([key, value]) => (
            <div key={key}>
              <h3>{key}</h3>
              <table className="table table-striped table-dark text-center">
                <tbody>
                  {value.map((match) => (
                    <tr key={match.id}>
                      <td>{match.date}</td>
                      <td>
                        <Link to={"/gracz/" + match.player1.id}>
                          {match.player1.first_name} {match.player1.last_name}
                        </Link>
                      </td>
                      <td>
                        <Link to={"/gracz/" + match.player2.id}>
                          {match.player2.first_name} {match.player2.last_name}
                        </Link>
                      </td>
                      <td>{match.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    );
    return isLoading ? spinner : page;
  }
}

const mapStateToProps = (state) => ({
  tournament: state.tournament,
});

export default connect(mapStateToProps, { getTournamentMatches })(
  TournamentMatches
);
