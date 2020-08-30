import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getTournamentMatches } from "../../actions/tournament";
import { Spinner } from "../common/Spinner";
import { Link } from "react-router-dom";
import { parseInt } from "lodash";

export class TournamentMatches extends Component {
  /**
   * Shows tournament matches grouped by round
   */
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

  previousMatchNumber(round, drawSize, match, isPlayer2) {
    const matchesInPreviousRound = drawSize / 2 ** (round - 1);
    let firstMatchNumberInRound = 0;
    for (let i = 1; i < round; i++) {
      drawSize /= 2;
      firstMatchNumberInRound += drawSize;
    }
    firstMatchNumberInRound = parseInt(firstMatchNumberInRound + 1);

    return (
      parseInt(
        match - matchesInPreviousRound + (match - firstMatchNumberInRound)
      ) + isPlayer2
    );
  }

  render() {
    const { isLoading, matches } = this.state;
    let round_matches = {};
    matches.forEach((match) => {
      let round = match.tournament.draw_size / 2 ** match.round;
      if (round == 1) {
        round_matches["Finał"] = [match];
      } else {
        if (Object.keys(round_matches).includes(`1/${round} finału`)) {
          round_matches[`1/${round} finału`].push(match);
        } else {
          round_matches[`1/${round} finału`] = [match];
        }
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
                <thead>
                  <tr>
                    <td>Numer meczu</td>
                    <td>Data</td>
                    <td>Godzina</td>
                    <td>Gracz #1</td>
                    <td>Gracz #2</td>
                    <td>Wynik</td>
                  </tr>
                </thead>
                <tbody>
                  {value.map((match) => (
                    <tr key={match.id}>
                      <td>{match.match_number}</td>
                      <td>{match.date}</td>
                      <td>{match.time.substring(0, 5)}</td>
                      <td>
                        {match.player1 ? (
                          <Link to={"/gracz/" + match.player1.id}>
                            {match.player1.first_name} {match.player1.last_name}
                          </Link>
                        ) : match.round == 1 ? (
                          "Wolny los"
                        ) : (
                          "Zwycięzca meczu #" +
                          this.previousMatchNumber(
                            match.round,
                            match.tournament.draw_size,
                            match.match_number,
                            0
                          )
                        )}
                      </td>
                      <td>
                        {match.player2 ? (
                          <Link to={"/gracz/" + match.player2.id}>
                            {match.player2.first_name} {match.player2.last_name}
                          </Link>
                        ) : match.round == 1 ? (
                          "Wolny los"
                        ) : (
                          "Zwycięzca meczu #" +
                          this.previousMatchNumber(
                            match.round,
                            match.tournament.draw_size,
                            match.match_number,
                            1
                          )
                        )}
                      </td>
                      <td>
                        <Link to={"/mecz/" + match.id}>{match.score}</Link>
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
    const noMatches = (
      <div className="tab-pane fade" id="matches">
        <div className="card card-body">
          <h2 className="text-center">Brak spotkań</h2>
        </div>
      </div>
    );
    return isLoading ? spinner : matches.length ? page : noMatches;
  }
}

const mapStateToProps = (state) => ({
  tournament: state.tournament,
});

export default connect(mapStateToProps, { getTournamentMatches })(
  TournamentMatches
);
