import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  withRouter,
} from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";
import EditNote from "./EditNote";

class NotesPage extends Component {
  constructor(props) {
    super(props);
    this.state = { path: "", notes: [], activeNoteId: "" };
  }

  // componentDidMount() {
  //   //need to check id url /create than only perform below code else note

  //   console.log("MainNotes - didMount");
  //   const token = localStorage.getItem("tokenStore");
  //   const firstStartUp = async (token) => {
  //     const res = await axios.get("/notes-api", {
  //       headers: { Authorization: token },
  //     });
  //     if (res.data.length > 0) {
  //       this.setState({ ...this.state, id: res.data[0]._id });
  //       let path = this.props.match.url + "/" + this.state.id;
  //       this.props.history.push(path);
  //     }
  //   };
  //   firstStartUp(token);
  // }

  getNotes = async (token) => {
    const res = await axios.get("/notes-api", {
      headers: { Authorization: token },
    });
    this.setState({ ...this.state, notes: res.data });
  };

  async componentDidMount() {
    const token = localStorage.getItem("tokenStore");
    if (token) {
      await this.getNotes(token);
    }

    if (this.props.location.pathname === "/edit") {
      if (this.state.notes.length > 0) {
        this.setState({ ...this.state, activeNoteId: this.state.notes[0]._id });
        let path = this.props.match.url + "/" + this.state.activeNoteId;
        this.props.history.push(path);
      } else {
        this.addNote();
      }
    } else {
      let temp = this.props.location.pathname.split("/")[2];
      this.setState({ ...this.state, activeNoteId: temp });
    }
  }

  changeRoute = (id) => {
    this.setState({ ...this.state, activeNoteId: id });
    let path = this.props.match.url + "/" + id;
    this.props.history.push(path);
  };

  addNote = async () => {
    try {
      const token = localStorage.getItem("tokenStore");
      if (token) {
        const date = new Date().toLocaleString();
        const newNote = {
          title: "Untitled",
          content: "",
          date: date,
        };

        let res = await axios.post("/notes-api", newNote, {
          headers: { Authorization: token },
        });

        if (token) {
          await this.getNotes(token);
        }
        this.changeRoute(res.data.id);
      }
    } catch (err) {
      // window.location.href = "/";
    }
  };

  render() {
    let path = this.props.match.url;
    return (
      <Switch>
        <div className="main-notes d-flex flex-row">
          <Sidebar
            changeRoute={this.changeRoute}
            addNote={this.addNote}
            id={this.state.activeNoteId}
            notes={this.state.notes}
            username={this.props.username}
          />
          <section>
            <Route path={`${path}/:id`} component={EditNote} exact />
          </section>
        </div>
      </Switch>
    );
  }
}

export default withRouter(NotesPage);
