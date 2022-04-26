import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { format } from "timeago.js";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = { token: "", notes: [], sharedNotesIds: [], sharedNotes: [] };
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

  getSharedNotes = async (token) => {
    await this.getSharedNotesIds(token);
    let temp = [];
    for (const id of this.state.sharedNotesIds) {
      const res = await axios.get(`/notes-api/${id}`, {
        headers: { Authorization: token },
      });
      if (res.data !== null) {
        temp.push(res.data);
      }
    }
    this.setState({ sharedNotes: temp });
    console.log(this.state.sharedNotes);
  };

  async componentDidMount() {
    const token = localStorage.getItem("tokenStore");
    this.setState({ ...this.state, token: token });
    if (token) {
      this.getNotes(token);
      this.getSharedNotes(token);
    }
  }

  deleteNote = async (id) => {
    try {
      if (this.state.token) {
        await axios.delete(`notes-api/${id}`, {
          headers: { Authorization: this.state.token },
        });
        this.getNotes(this.state.token);
      }
    } catch (err) {
      window.location.href = "/";
    }
  };

  render() {
    return (
      <div className="note-wrapper">
        {this.state.notes.map((note) => {
          if (note.parentPages.length == 0) {
            return (
              <div className="card" key={note._id}>
                <div className="card-title">
                  <h5>{note.title}</h5>
                </div>
                <div className="card-text">
                  {note.blocks.map((block) => {
                    if (block.tag == "p") return <p>{block.html}</p>;
                    else if (block.tag == "h2") return <h2>{block.html}</h2>;
                    else if (block.tag == "h3") return <h3>{block.html}</h3>;
                  })}
                  <p>{note.content}</p>
                </div>
                <p className="card-date">last edited {format(note.date)}</p>
                <div className="card-footer">
                  {note.name}
                  <Link to={`edit/${note._id}`}>Edit</Link>
                </div>
                <button
                  className="card-delete"
                  onClick={() => this.deleteNote(note._id)}
                >
                  X
                </button>
              </div>
            );
          }
        })}

        {this.state.sharedNotes.map((note) => {
          return (
            <div className="card" key={note._id}>
              <div className="card-title">
                <h5>{note.title}</h5>
              </div>
              <div className="card-text">
                <p>{note.content}</p>
              </div>
              <p className="card-date">last edited {format(note.date)}</p>
              <div className="card-footer">
                {note.name}
                <Link to={`edit/${note._id}`}>Edit</Link>
              </div>
              {/* <button
                className="card-delete"
                onClick={() => this.deleteNote(note._id)}
              >
                X
              </button> */}
            </div>
          );
        })}
      </div>
    );
  }
}

export default Home;
