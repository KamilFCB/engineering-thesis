import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Spinner } from "../common/Spinner";
import { getPlayerInformations, getPlayerMatches } from "../../actions/player";
import { Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";

export class PlayerProfile extends Component {
  state = {
    isLoadingProfile: true,
    isLoadingMatches: true,
    profile: {},
    matches: [],
    hasMore: true,
    nextPage: 1,
  };

  static propTypes = {
    getPlayerInformations: PropTypes.func.isRequired,
    getPlayerMatches: PropTypes.func.isRequired,
  };

  fetchMoreData = () => {
    this.props.getPlayerMatches(
      this.props.match.params.id,
      this.state.nextPage
    );
  };

  componentDidMount() {
    this.props.getPlayerInformations(this.props.match.params.id);
    this.props.getPlayerMatches(this.props.match.params.id, 1);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id != this.props.match.params.id) {
      this.setState(
        {
          isLoadingProfile: true,
          isLoadingMatches: true,
          nextPage: 1,
          hasMore: true,
          matches: [],
        },
        () => {
          this.props.getPlayerMatches(this.props.match.params.id, 1);
          this.props.getPlayerInformations(this.props.match.params.id);
        }
      );
    }
    if (this.props.player != prevProps.player) {
      if (this.props.player.profile) {
        this.setState({
          isLoadingProfile: this.props.player.isLoadingProfile,
          profile: this.props.player.profile,
        });
      }
      if (this.props.player.matches != prevProps.player.matches) {
        this.setState({
          matches: this.state.matches.concat(this.props.player.matches),
          isLoadingMatches: this.props.player.isLoadingMatches,
          nextPage: this.props.player.nextPage,
          hasMore: this.props.player.hasMore,
        });
      }
    }
  }

  render() {
    const {
      isLoadingProfile,
      isLoadingMatches,
      profile,
      matches,
      hasMore,
    } = this.state;
    const spinner = <Spinner />;
    const profileComponent = (
      <div>
        <h2>
          {profile.first_name} {profile.last_name}
        </h2>
        <table className="table table-striped table-dark text-center">
          <thead>
            <tr>
              <th scope="col">Miasto</th>
              <th scope="col">Data urodzenia</th>
              <th scope="col">Wzrost</th>
              <th scope="col">Waga</th>
              <th scope="col">Forehand</th>
              <th scope="col">Backhand</th>
            </tr>
          </thead>
          <tbody>
            <tr key={profile.id}>
              <td>{profile.residence ? profile.residence : "-"}</td>
              <td>{profile.birth_date ? profile.birth_date : "-"}</td>
              <td>{profile.height ? profile.height : "-"}</td>
              <td>{profile.weight ? profile.weight : "-"}</td>
              <td>{profile.forehand ? profile.forehand : "-"}</td>
              <td>{profile.backhand ? profile.backhand : "-"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );

    const matchesTable = (
      <InfiniteScroll
        dataLength={matches.length}
        next={this.fetchMoreData}
        hasMore={hasMore}
        loader={spinner}
      >
        <table className="table table-striped table-dark text-center">
          <thead>
            <tr>
              <th scope="col">Data</th>
              <th scope="col">Turniej</th>
              <th scope="col">Runda</th>
              <th scope="col">Przeciwnik</th>
              <th scope="col">Wynik</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((match) => (
              <tr key={String(match.player2.id) + match.id}>
                <td>{match.date}</td>
                <td>
                  <Link to={"/turniej/" + match.tournament.id}>
                    {match.tournament.name}
                  </Link>
                </td>
                <td>{match.round}</td>
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
      </InfiniteScroll>
    );
    return (
      <div className="card card-body">
        {isLoadingProfile ? spinner : profileComponent}
        <div>
          <h2>Ostatnie mecze</h2>
          {isLoadingMatches ? spinner : matchesTable}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  player: state.player,
});

export default connect(mapStateToProps, {
  getPlayerInformations,
  getPlayerMatches,
})(PlayerProfile);
