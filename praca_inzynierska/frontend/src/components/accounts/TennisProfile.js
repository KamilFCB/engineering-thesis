import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Spinner } from "../common/Spinner";
import { getTennisProfile, updateTennisProfile } from "../../actions/profile";

export class TennisProfile extends Component {
  /**
   * Tennis profile management view
   */
  state = {
    residence: "",
    birthDate: "",
    weight: "",
    height: "",
    forehand: "-",
    backhand: "-",
  };

  static propTypes = {
    profile: PropTypes.object.isRequired,
    getTennisProfile: PropTypes.func.isRequired,
    updateTennisProfile: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.getTennisProfile();
  }

  componentDidUpdate(previousProps) {
    if (
      previousProps.profile != this.props.profile &&
      this.props.profile.tennisProfile
    ) {
      this.setState({
        residence: this.props.profile.tennisProfile.residence,
        birthDate: this.props.profile.tennisProfile.birth_date,
        weight: this.props.profile.tennisProfile.weight,
        height: this.props.profile.tennisProfile.height,
        forehand: this.props.profile.tennisProfile.forehand,
        backhand: this.props.profile.tennisProfile.backhand,
      });
    }
  }

  onChange = (e) =>
    this.setState({
      [e.target.name]: e.target.value,
    });

  onSubmit = (e) => {
    e.preventDefault();
    const {
      residence,
      birthDate,
      weight,
      height,
      forehand,
      backhand,
    } = this.state;
    const newUserProfile = {
      residence,
      birth_date: birthDate,
      weight,
      height,
      forehand,
      backhand,
    };
    this.props.updateTennisProfile(newUserProfile);
  };

  render() {
    const {
      residence,
      birthDate,
      weight,
      height,
      forehand,
      backhand,
    } = this.state;
    const isLoading = this.props.profile.isLoading;
    const spinner = <Spinner />;
    const tennisProfile = (
      <div className="tab-pane fade" id="tennisProfile">
        <div className="card card-body">
          <h2>Profil tenisowy</h2>
          <form onSubmit={this.onSubmit}>
            <div className="form-group">
              <label>Miasto</label>
              <input
                className="form-control"
                type="text"
                name="residence"
                onChange={this.onChange}
                value={residence || ""}
              />
            </div>
            <div className="form-group">
              <label>Data urodzenia</label>
              <input
                className="form-control"
                type="date"
                name="birthDate"
                onChange={this.onChange}
                value={birthDate || ""}
              />
            </div>
            <div className="form-group">
              <label>Wzrost</label>
              <input
                className="form-control"
                type="number"
                name="height"
                onChange={this.onChange}
                value={height || ""}
              />
            </div>
            <div className="form-group">
              <label>Waga</label>
              <input
                className="form-control"
                type="number"
                name="weight"
                onChange={this.onChange}
                value={weight || ""}
              />
            </div>
            <div className="form-group">
              <label>Forehend</label>
              <select
                name="forehand"
                className="form-control"
                onChange={this.onChange}
                value={forehand || "-"}
              >
                <option value="-">-</option>
                <option value="Praworęczny">Praworęczny</option>
                <option value="Leworęczny">Leworęczny</option>
              </select>
            </div>
            <div className="form-group">
              <label>Backhand</label>
              <select
                name="backhand"
                className="form-control"
                onChange={this.onChange}
                value={backhand || "-"}
              >
                <option value="-">-</option>
                <option value="Jednoręczny">Jednoręczny</option>
                <option value="Dwuręczny">Dwuręczny</option>
              </select>
            </div>
            <div className="form-group">
              <button type="submit" className="btn btn-primary">
                Aktualizuj
              </button>
            </div>
          </form>
        </div>
      </div>
    );

    return isLoading ? spinner : tennisProfile;
  }
}

const mapStateToProps = (state) => ({
  profile: state.profile,
});

export default connect(mapStateToProps, {
  getTennisProfile,
  updateTennisProfile,
})(TennisProfile);
