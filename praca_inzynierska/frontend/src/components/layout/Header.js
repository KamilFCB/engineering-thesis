import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logout } from "../../actions/auth";

export class Header extends Component {
  /**
   * Application menu component
   */
  static propTypes = {
    auth: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired,
  };

  render() {
    const { isAuthenticated, user } = this.props.auth;
    const userLinks = (
      <ul className="navbar-nav mr-auto">
        <li className="nav-item dropdown">
          <a
            className="nav-link dropdown-toggle"
            id="navbarDropdown"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            {user ? `${user.username}` : ""}
          </a>
          <div className="dropdown-menu" aria-labelledby="navbarDropdown">
            <Link to="/profil" className="dropdown-item">
              Profil
            </Link>
            <Link
              to={user ? `/gracz/${user.id}` : ""}
              className="dropdown-item"
            >
              Historia meczów
            </Link>
            <Link to={user ? "/moje_turnieje" : ""} className="dropdown-item">
              Moje turnieje
            </Link>
            <div className="dropdown-divider"></div>
            <a className="dropdown-item" onClick={this.props.logout}>
              Wyloguj
            </a>
          </div>
        </li>
      </ul>
    );

    const guestLinks = (
      <ul className="navbar-nav mr-auto">
        <li className="nav-item">
          <Link to="/rejestracja" className="nav-link">
            Utwórz konto
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/logowanie" className="nav-link">
            Zaloguj się
          </Link>
        </li>
      </ul>
    );

    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarColor02"
            aria-controls="navbarColor02"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarColor02">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link to="/" className="nav-link">
                  Strona główna
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/turnieje" className="nav-link">
                  Turnieje
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/utworz_turniej" className="nav-link">
                  Utwórz turniej
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/ranking" className="nav-link">
                  Ranking
                </Link>
              </li>
            </ul>
          </div>
          {isAuthenticated ? userLinks : guestLinks}
        </div>
      </nav>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Header);
