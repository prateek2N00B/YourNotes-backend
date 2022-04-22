import React, { Component } from "react";
import axios from "axios";

class EditNote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      title: "",
      content: "",
      childPages: [],
      dropdownVisible: false,
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
        childPages: res.data.childPages,
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

  EditNote = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("tokenStore");
      if (token) {
        const date = new Date().toLocaleString();
        const newNote = {
          title: this.state.title,
          content: this.state.content,
          date: date,
          childPages: this.state.childPages,
        };

        const res = await axios.put(`/notes-api/${this.state.id}`, newNote, {
          headers: { Authorization: token },
        });
        this.getNote();
      }
    } catch {
      window.location.href = "";
    }
  };

  dropdownClicked = () => {
    let temp = this.state.dropdownVisible;
    this.setState({ dropdownVisible: !temp });
  };

  childPageSelected = (id, title) => {
    let temp = this.state.childPages;
    temp.push({ id: id, title: title });
    this.setState({
      childPages: temp,
    });
  };

  childPagesLinkClicked = (id) => {};

  render() {
    // console.log("MainCreateNotes -- render");
    return (
      <div className="editnote">
        <form onSubmit={this.EditNote}>
          <div className="editnote-preview d-flex justify-content-md-center align-items-center">
            <div className="editnote-header">
              <div className="editnote-dropdown-parent">
                <img
                  src={require("../images/square-plus-icon.png")}
                  className={"sidebar-title-plus-image"}
                  width={20}
                  onClick={this.dropdownClicked}
                ></img>
                {this.state.dropdownVisible ? (
                  <div className="editnote-dropdown-content">
                    <p>Select a page</p>
                    {this.props.notes.map((note) => {
                      return (
                        <div
                          className="editnote-dropdown-title"
                          key={note._id}
                          onClick={() => {
                            this.childPageSelected(note._id, note.title);
                          }}
                        >
                          <img
                            src={require("../images/notes-icon-2.png")}
                            width={20}
                          ></img>
                          {note.title}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <></>
                )}
              </div>
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
            </div>

            <div className="editnote-content-parent">
              <div className="editnote-content">
                {this.state.childPages.map((childNote) => {
                  return (
                    <div
                      className="editnote-content-pagelink"
                      onClick={() => {
                        this.props.changeRoute(childNote.id);
                      }}
                    >
                      <img
                        src={require("../images/notes-icon-2.png")}
                        width={20}
                      ></img>
                      {childNote.title}
                    </div>
                  );
                })}
                <textarea
                  id="editnote-content-textbox"
                  name="content"
                  className="editnote-content-textbox"
                  placeholder="Type your notes here"
                  rows="25"
                  required
                  value={this.state.content}
                  onChange={this.OnChangeInput}
                ></textarea>
              </div>
            </div>

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
