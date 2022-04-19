import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { format } from "timeago.js";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = { token: "", notes: [] };
  }

  getNotes = async (token) => {
    const res = await axios.get("/notes-api", {
      headers: { Authorization: token },
    });
    console.log(res.data);
    this.setState({ ...this.state, notes: res.data });
  };

  componentDidMount() {
    const token = localStorage.getItem("tokenStore");
    this.setState({ ...this.state, token: token });
    if (token) {
      this.getNotes(token);
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
        {this.state.notes.map((note) => (
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
            <button
              className="card-delete"
              onClick={() => this.deleteNote(note._id)}
            >
              X
            </button>
          </div>
        ))}
      </div>
    );
  }
}

export default Home;



