import axios from "axios";
import React, { Component } from "react";

class EditNotes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      title: "",
      content: "",
    };
  }

  componentDidMount() {
    const getNote = async () => {
      const token = localStorage.getItem("tokenStore");
      if (this.props.match.params.id) {
        const res = await axios.get(
          `/notes-api/${this.props.match.params.id}`,
          {
            headers: { Authorization: token },
          }
        );
        console.log(res);
        this.setState({
          ...this.state,
          id: res.data._id,
          title: res.data.title,
          content: res.data.content,
        });
      }
    };
    getNote();
  }

  OnChangeInput = (e) => {
    const { name, value } = e.target;
    this.setState({ ...this.state, [name]: value });
  };

  EditNotes = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("tokenStore");
      if (token) {
        const date = new Date().toLocaleString();
        const newNote = {
          title: this.state.title,
          content: this.state.content,
          date: date,
        };

        const res = await axios.put(`/notes-api/${this.state.id}`, newNote, {
          headers: { Authorization: token },
        });
        console.log(res);
        return this.props.history.push("/");
      }
    } catch {
      window.location.href = "";
    }
  };

  render() {
    return (
      <div className="create-note">
        <h2>Create Note</h2>
        <br></br>
        <form onSubmit={this.EditNotes}>
          <div className="create-notes-preview d-flex justify-content-md-center align-items-center">
            <input
              id="edit-notes-title"
              name="title"
              className="create-notes-title"
              type="text"
              placeholder="Untitled"
              required
              value={this.state.title}
              onChange={this.OnChangeInput}
            ></input>
            <textarea
              id="edit-notes-content"
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

export default EditNotes;
