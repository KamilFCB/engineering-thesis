import React, { Component } from "react";
import PropTypes from "prop-types";
import { updateUserProfile } from "../../actions/profile";
import { connect } from "react-redux";
import { getUserProfile } from "../../actions/profile";
import { Spinner } from "../common/Spinner";

export class UserProfile extends Component {
  state = {
    username: "",
    email: "",
    firstName: "",
    lastName: "",
  };

  static propTypes = {
    profile: PropTypes.object.isRequired,
    updateUserProfile: PropTypes.func.isRequired,
    getUserProfile: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.getUserProfile();
  }

  componentDidUpdate(previousProps) {
    if (
      previousProps.profile != this.props.profile &&
      this.props.profile.userProfile
    ) {
      this.setState({
        username: this.props.profile.userProfile.username,
        email: this.props.profile.userProfile.email,
        firstName: this.props.profile.userProfile.first_name,
        lastName: this.props.profile.userProfile.last_name,
      });
    }
  }

  onChange = (e) =>
    this.setState({
      [e.target.name]: e.target.value,
    });

  onSubmit = (e) => {
    e.preventDefault();
    const { username, email, firstName, lastName } = this.state;
    const newUserProfile = {
      username,
      email,
      first_name: firstName,
      last_name: lastName,
    };
    this.props.updateUserProfile(newUserProfile);
  };

  render() {
    const { username, email, firstName, lastName } = this.state;
    const isLoading = this.props.profile.isLoading;
    const spinner = <Spinner />;
    const userProfile = (
      <div className="tab-pane fade active show" id="userProfile">
        <div className="card card-body">
          <h2>{username}</h2>
          <form onSubmit={this.onSubmit}>
            <div className="form-group">
              <label>Imię</label>
              <input
                className="form-control"
                type="text"
                name="firstName"
                onChange={this.onChange}
                value={firstName || ""}
              />
            </div>
            <div className="form-group">
              <label>Nazwisko</label>
              <input
                className="form-control"
                type="text"
                name="lastName"
                onChange={this.onChange}
                value={lastName || ""}
              />
            </div>
            <div className="form-group">
              <label>E-mail</label>
              <input
                className="form-control"
                type="email"
                name="email"
                onChange={this.onChange}
                value={email || ""}
              />
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

    return isLoading ? spinner : userProfile;
  }
}

const mapStateToProps = (state) => ({
  profile: state.profile,
});

export default connect(mapStateToProps, { updateUserProfile, getUserProfile })(
  UserProfile
);
