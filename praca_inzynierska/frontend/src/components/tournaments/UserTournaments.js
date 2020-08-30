import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Spinner } from "../common/Spinner";
import { getUserOrganizedTournaments } from "../../actions/tournaments";
import { Link } from "react-router-dom";

export class UserTournaments extends Component {
  /**
   * Shows list of user tournaments
   */
  state = {
    tournaments: [],
    isLoading: true,
  };

  static propTypes = {
    getUserOrganizedTournaments: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.getUserOrganizedTournaments(this.props.auth.user.id);
  }

  componentDidUpdate(previousProps) {
    if (
      previousProps.tournaments != this.props.tournaments &&
      this.props.tournaments.organizedTournaments
    ) {
      this.setState({
        tournaments: this.props.tournaments.organizedTournaments,
        isLoading: this.props.tournaments.isLoading,
      });
    }
  }

  render() {
    const { isLoading, tournaments } = this.state;
    const spinner = <Spinner />;
    const page = (
      <div className="card card-body">
        <h3>Organizowane turnieje</h3>
        <table className="table table-striped table-dark table-bordered text-center">
          <thead>
            <tr>
              <th scope="col">Nazwa turnieju</th>
              <th scope="col">Miasto</th>
              <th scope="col">Data</th>
              <th scope="col">Rozmiar drabinki</th>
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
                <td>
                  <Link to={"/zarzadzaj/" + tournament.id}>Zarządzaj</Link>
                </td>
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
  auth: state.auth,
});

export default connect(mapStateToProps, { getUserOrganizedTournaments })(
  UserTournaments
);
