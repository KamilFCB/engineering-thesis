import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Spinner } from "../common/Spinner";

export class MainPage extends Component {
  static propTypes = {
    isLoading: PropTypes.bool,
  };

  render() {
    const isLoading = this.props.isLoading;
    const spinner = <Spinner />;
    const page = <div>Strona główna</div>;
    return isLoading ? spinner : page;
  }
}

const mapStateToProps = (state) => ({
  isLoading: state.auth.isLoading,
});

export default connect(mapStateToProps)(MainPage);
