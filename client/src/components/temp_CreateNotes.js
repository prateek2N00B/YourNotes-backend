import React, { Component } from "react";
import axios from "axios";

class CreateNotes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      content: "",
    };
  }

  OnChangeInput = (e) => {
    const { name, value } = e.target;
    this.setState({ ...this.state, [name]: value });
  };

  CreateNotes = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("tokenStore");
      if (token) {
        const { title, content } = this.state;
        const date = new Date().toLocaleString();
        const newNote = {
          title: title,
          content: content,
          date: date,
        };

        await axios.post("/notes-api", newNote, {
          headers: { Authorization: token },
        });

        return this.props.history.push("/");
      }
    } catch (err) {
      window.location.href = "/";
    }
  };

  render() {
    return (
      <div className="create-note">
        <h2>Create Note</h2>
        <br></br>
        <form onSubmit={this.CreateNotes}>
          <div className="create-notes-preview d-flex justify-content-md-center align-items-center">
            <input
              id="create-notes-title"
              name="title"
              className="create-notes-title"
              type="text"
              placeholder="Untitled"
              required
              value={this.state.title}
              onChange={this.OnChangeInput}
            ></input>
            <textarea
              id="create-notes-content"
              name="content"
              className="create-notes-body"
              placeholder="Type your notes here"
              rows="20"
              required
              value={this.state.content}
              onChange={this.OnChangeInput}
            ></textarea>
            <button type="submit" className="btn btn-primary">
              Save
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default CreateNotes;
