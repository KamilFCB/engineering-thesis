import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getTournamentParticipants } from "../../actions/tournament";
import { Spinner } from "../common/Spinner";
import { zip, range } from "lodash";
import { Link } from "react-router-dom";

export class TournamentParticipants extends Component {
  state = {
    participants: [],
    isLoading: true,
  };

  static propTypes = {
    getTournamentParticipants: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.getTournamentParticipants(this.props.tournamentId);
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.tournament.participants != prevProps.tournament.participants
    ) {
      this.setState({
        isLoading: this.props.tournament.isLoading,
        participants: this.props.tournament.participants.participants,
      });
    }
  }

  render() {
    const { isLoading } = this.state;
    let participants = [];
    if (this.state.participants) {
      participants = zip(
        this.state.participants,
        range(1, this.state.participants.length + 1)
      );
    }
    const spinner = <Spinner />;
    const page = (
      <div className="tab-pane fade" id="participants">
        <div className="card card-body">
          <table className="table table-striped table-dark">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Imię</th>
                <th scope="col">Nazwisko</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((participant) => (
                <tr key={participant[1]}>
                  <td>{participant[1]}</td>
                  <td>
                    <Link to={"/gracz/" + participant[0].id}>
                      {participant[0].first_name}
                    </Link>
                  </td>
                  <td>
                    <Link to={"/gracz/" + participant[0].id}>
                      {participant[0].last_name}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );

    return isLoading ? spinner : page;
  }
}

const mapStateToProps = (state) => ({
  tournament: state.tournament,
});

export default connect(mapStateToProps, {
  getTournamentParticipants,
})(TournamentParticipants);
