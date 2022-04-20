import React, { Component } from "react";
import axios from "axios";

class EditNote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      title: "",
      content: "",
    };
  }

  OnChangeInput = (e) => {
    const { name, value } = e.target;
    this.setState({ ...this.state, [name]: value });
  };

  getNote = async () => {
    const token = localStorage.getItem("tokenStore");
    if (this.props.match.params.id) {
      const res = await axios.get(`/notes-api/${this.props.match.params.id}`, {
        headers: { Authorization: token },
      });
      this.setState({
        ...this.state,
        id: res.data._id,
        title: res.data.title,
        content: res.data.content,
      });
    }
  };

  componentDidMount() {
    this.getNote();
  }

  componentDidUpdate() {
    if (this.props.match.params.id !== this.state.id) {
      this.getNote();
    }
  }

  CreateNotes = async (e) => {
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
      }
    } catch {
      window.location.href = "";
    }
  };

  render() {
    // console.log("MainCreateNotes -- render");
    return (
      <div className="editnote">
        <form onSubmit={this.CreateNotes}>
          <div className="editnote-preview d-flex justify-content-md-center align-items-center">
            <input
              id="editnote-title"
              name="title"
              className="editnote-title"
              type="text"
              placeholder="Untitled"
              required
              value={this.state.title}
              onChange={this.OnChangeInput}
            ></input>
            <textarea
              id="editnote-content"
              name="content"
              className="editnote-content"
              placeholder="Type your notes here"
              rows="25"
              required
              value={this.state.content}
              onChange={this.OnChangeInput}
            ></textarea>
            <button type="submit" className="btn btn-primary mt-2">
              Save
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default EditNote;
