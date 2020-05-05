import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Spinner } from "../common/Spinner";
import { getHistoryTournamentsPage } from "../../actions/tournaments";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link } from "react-router-dom";

export class TournamentsHistory extends Component {
  state = {
    isLoading: true,
    tournaments: [],
    hasMore: true,
    nextPage: 1,
  };

  static propTypes = {
    tournaments: PropTypes.object.isRequired,
    getHistoryTournamentsPage: PropTypes.func.isRequired,
  };

  fetchMoreData = () => {
    this.props.getHistoryTournamentsPage(this.state.nextPage);
  };

  componentDidMount() {
    this.props.getHistoryTournamentsPage(1);
  }

  componentDidUpdate(previousProps) {
    if (
      previousProps.tournaments.historyTournaments !=
      this.props.tournaments.historyTournaments
    ) {
      this.setState({
        tournaments: this.state.tournaments.concat(
          this.props.tournaments.historyTournaments
        ),
        isLoading: this.props.tournaments.isLoading,
        hasMore: this.props.tournaments.hasMore,
        nextPage: this.props.tournaments.nextPage,
      });
    }
  }

  render() {
    const { isLoading, tournaments } = this.state;
    const spinner = <Spinner />;
    const page = (
      <div className="tab-pane fade" id="tournamentsHistory">
        <div className="card card-body">
          <InfiniteScroll
            dataLength={tournaments.length}
            next={this.fetchMoreData}
            hasMore={this.state.hasMore}
            loader={spinner}
          >
            <table className="table table-striped table-dark table-bordered">
              <thead>
                <tr>
                  <th scope="col">Nazwa turnieju</th>
                  <th scope="col">Miasto</th>
                  <th scope="col">Data</th>
                  <th scope="col">Rozmiar drabinki</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {tournaments.map((tournament) => (
                  <tr key={tournament.id}>
                    <td>
                      <Link to={"/tournament/" + tournament.id}>
                        {tournament.name}
                      </Link>
                    </td>
                    <td>{tournament.city}</td>
                    <td>{tournament.date}</td>
                    <td>{tournament.draw_size}</td>
                    <td>Wyniki</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </InfiniteScroll>
        </div>
      </div>
    );
    return isLoading ? spinner : page;
  }
}

const mapStateToProps = (state) => ({
  tournaments: state.tournaments,
});

export default connect(mapStateToProps, { getHistoryTournamentsPage })(
  TournamentsHistory
);
