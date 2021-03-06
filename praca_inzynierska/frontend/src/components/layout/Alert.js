import React, { Component, Fragment } from "react";
import { withAlert } from "react-alert";
import { connect } from "react-redux";
import PropTypes from "prop-types";

export class Alert extends Component {
  /**
   * Informs user about result of action
   */
  static propTypes = {
    error: PropTypes.object.isRequired,
    message: PropTypes.object.isRequired,
  };

  componentDidUpdate(previousProps) {
    const { error, alert, message } = this.props;
    if (error !== previousProps.error) {
      if (error.message.username) {
        if (
          error.message.username == "A user with that username already exists."
        ) {
          alert.error("Użytkownik o takiej nazwie już istnieje");
        } else {
          alert.error("Nazwa użytkownika nie może być pusta");
        }
      }
      if (error.message.password) {
        alert.error("Hasło nie może być puste");
      }
      if (error.message.name) {
        if (error.message.name == "tournament with this name already exists.") {
          alert.error("Turniej o takiej nazwie już istnieje");
        } else {
          alert.error("Nazwa turnieju nie może być pusta");
        }
      }
      if (error.message.city) {
        alert.error("Miasto nie może być puste");
      }
      if (error.message.address) {
        alert.error("Adres nie może być pusty");
      }
      if (error.message.date) {
        alert.error("Niewłaściwy format daty");
      }
      if (error.message.description) {
        alert.error("Opis nie może być pusty");
      }
      if (error.message.draw_size) {
        alert.error(
          "Rozmiar drabinki turniejowej musi być potęgą dwójki oraz dodatnią liczbą nie większą niż 64"
        );
      }
      if (error.message.non_field_errors) {
        alert.error(error.message.non_field_errors);
      }
    }

    if (message !== previousProps.message) {
      if (message.logoutSuccess) {
        alert.success(message.logoutSuccess);
      }
      if (message.loginSuccess) {
        alert.success(message.loginSuccess);
      }
      if (message.registerSuccess) {
        alert.success(message.registerSuccess);
      }
      if (message.profileLoadError) {
        alert.error(message.profileLoadError);
      }
      if (message.updateError) {
        alert.error(message.updateError);
      }
      if (message.updateSuccess) {
        alert.success(message.updateSuccess);
      }
      if (message.tournamentCreateSuccess) {
        alert.success(message.tournamentCreateSuccess);
      }
      if (message.getTournamentsError) {
        alert.error(message.getTournamentsError);
      }
      if (message.joinTournamentsError) {
        alert.error(message.joinTournamentsError);
      }
      if (message.getTournamentParticipantsError) {
        alert.error(message.getTournamentParticipantsError);
      }
      if (message.getTournamentInformationsError) {
        alert.error(message.getTournamentInformationsError);
      }
      if (message.getTournamentMatchesError) {
        alert.error(message.getTournamentMatchesError);
      }
      if (message.getTournamentMatchError) {
        alert.error(message.getTournamentMatchError);
      }
      if (message.getOrganizerError) {
        alert.error(message.getOrganizerError);
      }
      if (message.startTournamentError) {
        alert.error(message.startTournamentError);
      }
      if (message.startTournamentSuccess) {
        alert.success(message.startTournamentSuccess);
      }
      if (message.matchUpdateError) {
        alert.error(message.matchUpdateError);
      }
      if (message.getRankingError) {
        alert.error(message.getRankingError);
      }
    }
  }

  render() {
    return <Fragment />;
  }
}

const mapStateToProps = (state) => ({
  error: state.errors,
  message: state.messages,
});

export default connect(mapStateToProps)(withAlert()(Alert));
