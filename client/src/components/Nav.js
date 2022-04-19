import React, { Component } from "react";
import { Link } from "react-router-dom";

class Nav extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  logOutSubmit = () => {
    localStorage.clear();
    this.props.setIsLogin(false);
  };

  render() {
    return (
      <header>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark p-3">
          <div className="mx-5">
            <h3>Navbar</h3>
          </div>
          <div
            className="collapse navbar-collapse flex-row-reverse"
            id="navbarNav"
          >
            <ul className="navbar-nav">
              <li className="nav-item active">
                <Link className="nav-link" to="/">
                  Home
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/edit">
                  Notes
                </Link>
              </li>
              <li onClick={this.logOutSubmit} className="nav-item">
                <Link className="nav-link" to="/">
                  Logout
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </header>
    );
  }
}

export default Nav;

