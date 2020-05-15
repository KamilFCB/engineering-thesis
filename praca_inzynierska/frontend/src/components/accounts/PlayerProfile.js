import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Spinner } from "../common/Spinner";
import { getPlayerInformations } from "../../actions/player";

export class PlayerProfile extends Component {
  state = {
    isLoading: true,
    profile: {},
    matches: [],
  };

  static propTypes = {
    getPlayerInformations: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.getPlayerInformations(this.props.match.params.id);
  }

  componentDidUpdate(prevProps) {
    if (this.props.player != prevProps.player) {
      this.setState({
        isLoading: this.props.player.isLoading,
        profile: this.props.player.profile,
      });
    }
  }

  render() {
    const { isLoading, profile } = this.state;
    const spinner = <Spinner />;
    const page = (
      <div className="card card-body">
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
            <tr>
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
    return isLoading ? spinner : page;
  }
}

const mapStateToProps = (state) => ({
  player: state.player,
});

export default connect(mapStateToProps, { getPlayerInformations })(
  PlayerProfile
);
