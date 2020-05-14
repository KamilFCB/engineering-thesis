import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getTournamentMatches } from "../../actions/tournament";
import { Spinner } from "../common/Spinner";

export class TournamentMatches extends Component {
  state = {
    isLoading: false, // ZMIENIC!!!
    matches: [],
  };

  static propTypes = {
    getTournamentMatches: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.getTournamentMatches(this.props.tournamentId);
  }

  componentDidUpdate(prevProps) {
    if (this.props.tournament.matches != prevProps.tournament.matches) {
      this.setState({
        isLoading: this.props.tournament.isLoading,
        matches: this.props.tournament.matches,
      });
    }
  }

  render() {
    const { isLoading, matches } = this.state;
    const spinner = <Spinner />;
    const page = (
      <div className="tab-pane fade" id="matches">
      </div>
    );
    return isLoading ? spinner : page;
  }
}

const mapStateToProps = (state) => ({
  tournament: state.tournament,
});

export default connect(mapStateToProps, { getTournamentMatches })(
  TournamentMatches
);
