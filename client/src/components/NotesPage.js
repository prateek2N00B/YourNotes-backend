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

const unique_id = () => {
  return Date.now().toString(36);
};

class NotesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      path: "",
      notes: [],
      activeNoteId: "",
      sharedNotesIds: [],
      sharedNotes: [],
    };
  }

  getNotes = async () => {
    const token = localStorage.getItem("tokenStore");
    if (token) {
      const res = await axios.get("/notes-api", {
        headers: { Authorization: token },
      });
      this.setState({ ...this.state, notes: res.data });
    }
  };

  getSharedNotesIds = async () => {
    const token = localStorage.getItem("tokenStore");
    if (token) {
      const res = await axios.get("/shared-notes-api", {
        headers: { Authorization: token },
      });
      this.setState({ sharedNotesIds: res.data });
    }
  };

  getSharedNoteTitleFromIds = async (ids) => {
    const token = localStorage.getItem("tokenStore");
    if (token) {
      const newIds = {
        notes_id: ids,
      };
      const res = await axios.post("/notes-api/get-title", newIds, {
        headers: { Authorization: token },
      });
      // return res.data;
      console.log(res.data);
      this.setState({ sharedNotes: res.data });
    }
  };

  getSharedNotes = async () => {
    await this.getSharedNotesIds();
    await this.getSharedNoteTitleFromIds(this.state.sharedNotesIds);
  };

  async componentDidMount() {
    // const token = localStorage.getItem("tokenStore");
    // if (token) {
    await this.getNotes();
    await this.getSharedNotes();
    console.log(this.state);
    // }

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
    let path = this.props.match.url + "/" + id;
    this.props.history.push(path);
  };

  changeRootNote = (id) => {
    this.setState({ ...this.state, activeNoteId: id });
    this.changeRoute(id);
  };

  addNote = async () => {
    try {
      const token = localStorage.getItem("tokenStore");
      if (token) {
        const note_id = await this.createNote([]);
        await this.getNotes();
        this.changeRootNote(note_id);
      }
    } catch (err) {
      window.location.href = "/";
    }
  };

  createNote = async (parentArray) => {
    try {
      const token = localStorage.getItem("tokenStore");
      if (token) {
        const date = new Date().toLocaleString();
        const newNote = {
          title: "Untitled",
          blocks: [{ id: unique_id(), tag: "p", content: "" }],
          date: date,
          childPages: [],
          parentPages: parentArray,
        };

        let res = await axios.post("/notes-api", newNote, {
          headers: { Authorization: token },
        });

        return res.data.id;
      }
    } catch (err) {
      window.location.href = "/";
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
        const { _id } = res.data;
        const newShareNotes = {
          note_id: _id,
        };
        await axios.post("/shared-notes-api/", newShareNotes, {
          headers: { Authorization: token },
        });
        await this.getSharedNotes();
      }
    }
  };

  deleteSharedNote = async (id) => {
    const token = localStorage.getItem("tokenStore");
    if (token) {
      const newShareNotes = {
        note_id: id,
      };
      await axios.post("/shared-notes-api/delete", newShareNotes, {
        headers: { Authorization: token },
      });
      await this.getSharedNotes();
    }
  };

  render() {
    let path = this.props.match.url;
    return (
      <Switch>
        <div className="main-notes d-flex flex-row">
          <Sidebar
            changeRootNote={this.changeRootNote}
            addNote={this.addNote}
            id={this.state.activeNoteId}
            notes={this.state.notes}
            username={this.props.username}
            sharedNotes={this.state.sharedNotes}
            addSharedNote={this.addSharedNote}
            deleteSharedNote={this.deleteSharedNote}
          />
          <section>
            <Route
              path={`${path}/:id`}
              component={(props) => (
                <EditNote
                  {...props}
                  notes={this.state.notes}
                  changeRoute={this.changeRoute}
                  createNote={this.createNote}
                  getNotes={this.getNotes}
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
