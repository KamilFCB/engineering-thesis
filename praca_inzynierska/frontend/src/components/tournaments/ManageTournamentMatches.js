import React, { Component } from "react";
import PropTypes from "prop-types";
import { Spinner } from "../common/Spinner";
import { connect } from "react-redux";
import { getTournamentMatches } from "../../actions/tournament";
import { Link } from "react-router-dom";

export class ManageTournamentMatches extends Component {
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
    if (
      this.props.tournament.matches != prevProps.tournament.matches &&
      this.props.tournament.matches &&
      this.props.tournament.matches.matches
    ) {
      this.setState({
        isLoading: this.props.tournament.isLoading,
        matches: this.props.tournament.matches.matches,
      });
    }
  }

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
                        {match.player1 ? (
                          <Link to={"/gracz/" + match.player1.id}>
                            {match.player1.first_name} {match.player1.last_name}
                          </Link>
                        ) : (
                          "Wolny los"
                        )}
                      </td>
                      <td>
                        {match.player2 ? (
                          <Link to={"/gracz/" + match.player2.id}>
                            {match.player2.first_name} {match.player2.last_name}
                          </Link>
                        ) : (
                          "Wolny los"
                        )}
                      </td>
                      <td>
                        <Link to={"/mecz/" + match.id}>
                          {match.score ? match.score : "Brak wyniku"}
                        </Link>
                      </td>
                      <td>
                        <Link to={"/zarzadzaj/mecz/" + match.id}>
                          <button type="button" className="btn btn-primary">
                            Edytuj
                          </button>
                        </Link>
                      </td>
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
  ManageTournamentMatches
);
