import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Spinner } from "../common/Spinner";
import {
  getIncomingTournamentsPage,
  joinTournament,
  leaveTournament,
} from "../../actions/tournaments";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link } from "react-router-dom";

export class IncomingTournaments extends Component {
  /**
   * View of incoming tournaments with infinite scroll loading
   */
  state = {
    isLoading: true,
    tournaments: [],
    hasMore: true,
    nextPage: 1,
  };

  static propTypes = {
    tournaments: PropTypes.object.isRequired,
    getTournamentsPage: PropTypes.func.isRequired,
    joinTournament: PropTypes.func.isRequired,
    leaveTournament: PropTypes.func.isRequired,
  };

  fetchMoreData = () => {
    this.props.getIncomingTournamentsPage(this.state.nextPage);
  };

  getButton = (participate, tournamentId, canJoin) => {
    const joinButton = (
      <button
        type="button"
        className={
          canJoin
            ? "btn btn-outline-primary"
            : "btn btn-outline-primary disabled"
        }
        onClick={() => this.props.joinTournament(tournamentId)}
      >
        Zapisz się
      </button>
    );
    const leaveButton = (
      <button
        type="button"
        className={
          canJoin
            ? "btn btn-outline-primary"
            : "btn btn-outline-primary disabled"
        }
        onClick={() =>
          canJoin ? this.props.leaveTournament(tournamentId) : {}
        }
      >
        Opuść turniej
      </button>
    );
    const registrationFinished = (
      <button type="button" className="btn btn-outline-primary disabled">
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

  componentDidMount() {
    this.props.getTournamentsPage(1);
  }

  componentDidUpdate(previousProps) {
    if (
      previousProps.tournaments != this.props.tournaments &&
      this.props.tournaments.incomingTournaments
    ) {
      if (this.props.tournaments.join) {
        let tournaments = this.state.tournaments;
        tournaments.forEach((tournament) => {
          if (
            tournament.name == this.props.tournaments.updatedTournament.name
          ) {
            tournament.participate = this.props.tournaments.updatedTournament.participate;
          }
        });
        this.setState({
          tournaments: tournaments,
        });
      } else if (this.props.tournaments.leave) {
        let tournaments = this.state.tournaments;
        tournaments.forEach((tournament) => {
          if (
            tournament.name == this.props.tournaments.updatedTournament.name
          ) {
            tournament.participate = this.props.tournaments.updatedTournament.participate;
          }
        });
        this.setState({
          tournaments: tournaments,
        });
      } else if (
        previousProps.tournaments.incomingTournaments !=
        this.props.tournaments.incomingTournaments
      ) {
        this.setState({
          tournaments: this.state.tournaments.concat(
            this.props.tournaments.incomingTournaments
          ),
          isLoading: this.props.tournaments.isLoading,
          hasMore: this.props.tournaments.hasMore,
          nextPage: this.props.tournaments.nextPage,
        });
      }
    }
  }

  render() {
    const { isLoading, tournaments } = this.state;
    const spinner = <Spinner />;
    const noTournaments = (
      <div className="tab-pane fade" id="incomingTournaments">
        <div className="card card-body">
          <h2 className="text-center">Brak turniejów</h2>
        </div>
      </div>
    );
    const page = (
      <div className="tab-pane fade active show" id="incomingTournaments">
        <div className="card card-body">
          <InfiniteScroll
            dataLength={tournaments.length}
            next={this.fetchMoreData}
            hasMore={this.state.hasMore}
            loader={spinner}
          >
            <table className="table table-striped table-dark table-bordered text-center">
              <thead>
                <tr>
                  <th scope="col">Nazwa turnieju</th>
                  <th scope="col">Miasto</th>
                  <th scope="col">Data</th>
                  <th scope="col">Rozmiar drabinki</th>
                  <th scope="col">Koniec zapisów</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {tournaments.map((tournament) => (
                  <tr key={tournament.id}>
                    <td>
                      <Link to={"/turniej/" + tournament.id}>
                        {tournament.name}
                      </Link>
                    </td>
                    <td>{tournament.city}</td>
                    <td>{tournament.date}</td>
                    <td>{tournament.draw_size}</td>
                    <td>{tournament.end_of_registration}</td>
                    <td>
                      {this.getButton(
                        tournament.participate,
                        tournament.id,
                        tournament.can_join
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </InfiniteScroll>
        </div>
      </div>
    );
    return isLoading ? spinner : tournaments.length ? page : noTournaments;
  }
}

const mapStateToProps = (state) => ({
  tournaments: state.tournaments,
});

export default connect(mapStateToProps, {
  getTournamentsPage: getIncomingTournamentsPage,
  joinTournament,
  leaveTournament,
})(IncomingTournaments);
