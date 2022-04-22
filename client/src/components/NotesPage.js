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
    this.state = {
      path: "",
      notes: [],
      activeNoteId: "",
      sharedNotesIds: [],
    };
  }

  getNotes = async (token) => {
    const res = await axios.get("/notes-api", {
      headers: { Authorization: token },
    });
    this.setState({ ...this.state, notes: res.data });
  };

  getSharedNotesIds = async (token) => {
    const res = await axios.get("/shared-notes-api", {
      headers: { Authorization: token },
    });
    this.setState({ sharedNotesIds: res.data });
  };

  async componentDidMount() {
    const token = localStorage.getItem("tokenStore");
    if (token) {
      await this.getNotes(token);
      await this.getSharedNotesIds(token);
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
          childPages: [],
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

  addSharedNote = async (url) => {
    let temp = url.split("/");
    let sharenote_id = temp[temp.length - 1];
    const token = localStorage.getItem("tokenStore");
    if (token) {
      const res = await axios.get(`/notes-api/${sharenote_id}`, {
        headers: { Authorization: token },
      });
      if (res.data != null && res.data !== "Note does not exists") {
        const { _id, title } = res.data;
        const newShareNotes = {
          note_id: _id,
          title: title,
        };
        await axios.post("/shared-notes-api/", newShareNotes, {
          headers: { Authorization: token },
        });
        await this.getSharedNotesIds(token);
      }
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
            sharedNotesIds={this.state.sharedNotesIds}
            addSharedNote={this.addSharedNote}
          />
          <section>
            <Route
              path={`${path}/:id`}
              component={(props) => (
                <EditNote
                  {...props}
                  notes={this.state.notes}
                  changeRoute={this.changeRoute}
                />
              )}
              exact
            />
          </section>
        </div>
      </Switch>
    );
  }
}

export default withRouter(NotesPage);
