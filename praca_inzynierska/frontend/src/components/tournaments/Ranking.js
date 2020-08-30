import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getPlayersRanking } from "../../actions/tournaments";
import Spinner from "../common/Spinner";

export class Ranking extends Component {
  /**
   * Shows list of players with at least one won match in last 365 days sorted desceding by ranking points
   */
  state = {
    ranking: [],
    startDate: null,
    endDate: null,
    isLoading: true,
  };

  static propTypes = {
    getPlayersRanking: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.getPlayersRanking();
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.tournaments.ranking != this.props.tournaments.ranking &&
      this.props.tournaments.ranking
    ) {
      this.setState({
        ranking: this.props.tournaments.ranking,
        startDate: this.props.tournaments.startDate,
        endDate: this.props.tournaments.endDate,
        isLoading: this.props.tournaments.isLoading,
      });
    }
  }

  render() {
    const { ranking, startDate, endDate, isLoading } = this.state;
    const spinner = <Spinner />;
    const page = (
      <div className="card card-body">
        <h2 className="text-center">Ranking</h2>
        <h6 className="text-center">{`${startDate} - ${endDate}`}</h6>
        <table className="table table-striped table-dark text-center">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Imię nazwisko</th>
              <th scope="col">Punkty</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((player) => (
              <tr key={player.id}>
                <td>{player.place}</td>
                <td>{`${player.first_name} ${player.last_name}`}</td>
                <td>{player.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    return isLoading ? spinner : page;
  }
}

const mapStateToProps = (state) => ({
  tournaments: state.tournaments,
});

export default connect(mapStateToProps, { getPlayersRanking })(Ranking);
