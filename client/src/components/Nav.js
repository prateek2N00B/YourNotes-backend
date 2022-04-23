import React, { Component } from "react";
import { Link } from "react-router-dom";

class Nav extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  logOutSubmit = () => {
    localStorage.clear();
    this.props.setLoginDetails(false, "");
  };

  render() {
    return (
      <header>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark p-3">
          <div className="mx-5 d-flex flex-row">
            <img
              src={require("../images/Your-notes-logo.jpg")}
              className="navbar-logo"
            ></img>
            <h3>YourNotes</h3>
          </div>
          <div
            className="collapse navbar-collapse flex-row-reverse"
            id="navbarNav"
          >
            <ul className="navbar-nav mx-5">
              <li className="nav-item active mx-2">
                <Link className="nav-link" to="/">
                  Home
                </Link>
              </li>

              <li className="nav-item mx-2">
                <Link className="nav-link" to="/edit">
                  Notes
                </Link>
              </li>
              <li onClick={this.logOutSubmit} className="nav-item mx-2">
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
