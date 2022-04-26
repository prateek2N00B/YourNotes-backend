import React, { Component } from "react";
import Home from "./Home";
import Nav from "./Nav";
import NotesPage from "./NotesPage";
import { BrowserRouter as Router, Route } from "react-router-dom";

class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    console.log("MainPage - construct");
  }

  render() {
    console.log("MainPage - render");
    return (
      <Router>
        <div className="notes-page">
          <Nav setLoginDetails={this.props.setLoginDetails} />
          <section>
            <Route path="/" component={Home} exact />
            <Route
              path="/edit"
              component={() => <NotesPage username={this.props.username} />}
            />
          </section>
        </div>
      </Router>
    );
  }
}

export default MainPage;
