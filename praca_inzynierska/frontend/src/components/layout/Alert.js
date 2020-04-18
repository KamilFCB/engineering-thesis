import React, { Component, Fragment } from "react";
import { withAlert } from "react-alert";
import { connect } from "react-redux";
import PropTypes from "prop-types";

export class Alert extends Component {
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
