import React, { Component } from "react";
import PropTypes from "prop-types";
import { Spinner } from "../common/Spinner";
import { connect } from "react-redux";
import { getTournamentInformations } from "../../actions/tournament";

export class TournamentInformation extends Component {
  state = {
    name: null,
    city: null,
    address: null,
    date: null,
    drawSize: null,
    description: null,
    isLoading: true,
  };

  static propTypes = {
    getTournamentInformations: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.getTournamentInformations(this.props.tournamentId);
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.tournament.informations != prevProps.tournament.informations
    ) {
      this.setState({
        isLoading: this.props.tournament.isLoading,
        name: this.props.tournament.informations.name,
        city: this.props.tournament.informations.city,
        address: this.props.tournament.informations.address,
        date: this.props.tournament.informations.date,
        drawSize: this.props.tournament.informations.draw_size,
        description: this.props.tournament.informations.description,
      });
    }
  }

  render() {
    const {
      isLoading,
      name,
      city,
      address,
      date,
      drawSize,
      description,
    } = this.state;
    const spinner = <Spinner />;
    const page = (
      <div className="tab-pane fade active show" id="information">
        <div className="card card-body">
          <table className="table table-striped table-dark table-bordered text-center">
            <thead>
              <tr>
                <th scope="col">Nazwa turnieju</th>
                <th scope="col">Data</th>
                <th scope="col">Miejscowość</th>
                <th scope="col">Adres</th>
                <th scope="col">Rozmiar drabinki</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{name}</td>
                <td>{date}</td>
                <td>{city}</td>
                <td>{address}</td>
                <td>{drawSize}</td>
              </tr>
            </tbody>
          </table>
          <p>{description}</p>
        </div>
      </div>
    );

    return isLoading ? spinner : page;
  }
}

const mapStateToProps = (state) => ({
  tournament: state.tournament,
});

export default connect(mapStateToProps, { getTournamentInformations })(
  TournamentInformation
);
