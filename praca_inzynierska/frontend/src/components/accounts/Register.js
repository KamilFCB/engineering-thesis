import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { register } from "../../actions/auth";

export class Register extends Component {
  state = {
    username: "",
    email: "",
    password: "",
    password2: "",
  };

  static propTypes = {
    register: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
  };

  onSubmit = (e) => {
    e.preventDefault();
    const { username, email, password, password2 } = this.state;
    if (password !== password2) {
      // TODO
      console.log("error");
    } else {
      const newUser = {
        username,
        email,
        password,
      };
      this.props.register(newUser);
    }
  };

  onChange = (e) =>
    this.setState({
      [e.target.name]: e.target.value,
    });

  render() {
    if (this.props.isAuthenticated) {
      return <Redirect to="/" />;
    }

    const { username, email, password, password2 } = this.state;

    return (
      <div className="card card-body">
        <h2>Rejestracja</h2>
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label>Nazwa użytkownika</label>
            <input
              className="form-control"
              type="text"
              name="username"
              onChange={this.onChange}
              value={username}
            />
          </div>
          <div className="form-group">
            <label>E-mail</label>
            <input
              className="form-control"
              type="email"
              name="email"
              onChange={this.onChange}
              value={email}
            />
          </div>
          <div className="form-group">
            <label>Hasło</label>
            <input
              className="form-control"
              type="password"
              name="password"
              onChange={this.onChange}
              value={password}
            />
          </div>
          <div className="form-group">
            <label>Powtórz hasło</label>
            <input
              className="form-control"
              type="password"
              name="password2"
              onChange={this.onChange}
              value={password2}
            />
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-primary">
              Utwórz konto
            </button>
          </div>
          <p>
            Masz już konto? <Link to="/logowanie">Zaloguj się</Link>
          </p>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { register })(Register);
