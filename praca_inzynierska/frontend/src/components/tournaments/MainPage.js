import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Spinner } from "../common/Spinner";
import { getMainPageTournaments } from "../../actions/tournaments";
import { Link } from "react-router-dom";

export class MainPage extends Component {
  state = {
    isLoading: true,
    tournaments: [],
  };

  static propTypes = {
    isLoading: PropTypes.bool,
    getMainPageTournaments: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.getMainPageTournaments();
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.tournaments != this.props.tournaments &&
      this.props.tournaments.tournaments
    ) {
      this.setState({
        tournaments: this.props.tournaments.tournaments,
        isLoading: this.props.tournaments.isLoading,
      });
    }
  }

  render() {
    const tournaments = this.state.tournaments;
    const isLoading = this.props.isLoading || this.state.isLoading;
    const spinner = <Spinner />;
    const page = (
      <div className="container">
        <h3 style={{ margin: "25px 0px" }}>Najbliższe turnieje</h3>
        {tournaments.map((tournament) => (
          <div className="row" key={tournament.id}>
            <div className="card border-secondary mb-3">
              <div className="card-header">
                <h3 className="card-title">
                  <Link to={"/turniej/" + tournament.id}>
                    {tournament.name}
                  </Link>
                </h3>
                <h5 className="card-subtitle mb-2 text-muted">
                  {tournament.date}
                </h5>
              </div>
              <div className="card-body">
                <p>{tournament.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
    const noTournaments = (
      <div className="card body">
        <h2 className="text-center">Brak zbliżających się turniejów</h2>
      </div>
    );
    return isLoading ? spinner : tournaments.length ? page : noTournaments;
  }
}

const mapStateToProps = (state) => ({
  isLoading: state.auth.isLoading,
  tournaments: state.tournaments,
});

export default connect(mapStateToProps, { getMainPageTournaments })(MainPage);
