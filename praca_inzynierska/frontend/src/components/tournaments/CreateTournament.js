import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { createTournament } from "../../actions/tournament";

export class CreateTournament extends Component {
  state = {
    name: "",
    city: "",
    address: "",
    date: "",
    drawSize: "",
    description: "",
  };

  static propTypes = {
    createTournament: PropTypes.func.isRequired,
  };

  onSubmit = (e) => {
    e.preventDefault();
    const { name, city, address, date, drawSize, description } = this.state;
    const newTournament = {
      name,
      city,
      address,
      date,
      draw_size: parseInt(drawSize),
      description,
    };
    this.props.createTournament(newTournament);
  };

  onChange = (e) =>
    this.setState({
      [e.target.name]: e.target.value,
    });

  render() {
    const { name, city, address, date, drawSize, description } = this.state;

    return (
      <div className="card card-body">
        <h2>Utwórz turniej</h2>
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label>Nazwa turnieju</label>
            <input
              className="form-control"
              type="text"
              name="name"
              onChange={this.onChange}
              value={name}
            />
          </div>
          <div className="form-group">
            <label>Miejscowość</label>
            <input
              className="form-control"
              type="text"
              name="city"
              onChange={this.onChange}
              value={city}
            />
          </div>
          <div className="form-group">
            <label>Adres</label>
            <input
              className="form-control"
              type="text"
              name="address"
              onChange={this.onChange}
              value={address}
            />
          </div>
          <div className="form-group">
            <label>Data</label>
            <input
              className="form-control"
              type="date"
              name="date"
              onChange={this.onChange}
              value={date}
            />
          </div>
          <div className="form-group">
            <label>Maksymalna ilość uczestników</label>
            <input
              className="form-control"
              type="number"
              name="drawSize"
              onChange={this.onChange}
              value={drawSize}
            />
          </div>
          <div className="form-group">
            <label>Opis turnieju</label>
            <input
              className="form-control"
              type="text"
              name="description"
              onChange={this.onChange}
              value={description}
            />
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-primary">
              Utwórz turniej
            </button>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, { createTournament })(CreateTournament);
