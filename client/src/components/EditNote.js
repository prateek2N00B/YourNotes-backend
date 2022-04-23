import React, { Component } from "react";
import axios from "axios";
import autosize from "autosize";

class EditNote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      title: "",
      content: "",
      childPagesIds: [],
      parentPagesIds: [],
      childPages: [],
      parentPages: [],
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
      // console.log(res.data);
      this.setState({
        ...this.state,
        id: res.data._id,
        title: res.data.title,
        content: res.data.content,
        childPagesIds: res.data.childPages, // change childPage to childPageIds everywhere
        parentPagesIds: res.data.parentPages,
      });
    }
  };

  getNoteTitleFromIds = async (ids) => {
    const token = localStorage.getItem("tokenStore");
    if (token) {
      const newIds = {
        notes_id: ids,
      };
      const res = await axios.post("/notes-api/get-title", newIds, {
        headers: { Authorization: token },
      });
      return res.data;
    }
  };

  getNoteInfo = async () => {
    await this.getNote();
    console.log(this.state);
    let res = await this.getNoteTitleFromIds(this.state.childPagesIds);
    console.log(res);
    this.setState({ ...this.state, childPages: res });
    res = await this.getNoteTitleFromIds(this.state.parentPagesIds);
    this.setState({ ...this.state, parentPages: res });
    console.log(this.state);
  };

  componentDidMount() {
    console.log("EditNote - componentDidMounnt");
    this.getNoteInfo();
    console.log(this.state);
    autosize(this.textarea);
  }

  componentDidUpdate() {
    if (this.props.match.params.id !== this.state.id) {
      this.getNoteInfo();
    }
  }

  saveNotes = async () => {
    try {
      const token = localStorage.getItem("tokenStore");
      if (token) {
        const date = new Date().toLocaleString();
        const newNote = {
          title: this.state.title,
          content: this.state.content,
          date: date,
          childPages: this.state.childPagesIds,
          parentPages: this.state.parentPagesIds,
        };

        const res = await axios.put(`/notes-api/${this.state.id}`, newNote, {
          headers: { Authorization: token },
        });
        this.getNoteInfo();
      }
    } catch {
      window.location.href = "";
    }
  };

  EditNote = async (e) => {
    e.preventDefault();
    this.saveNotes();
    this.props.getNotes();
  };

  dropdownClicked = () => {
    let temp = this.state.dropdownVisible;
    this.setState({ ...this.state, dropdownVisible: !temp });
  };

  childPageSelected = (id) => {
    let temp = this.state.childPages;
    temp.push(id);
    this.setState({ ...this.state, childPages: temp });
  };

  addNewChildPage = async () => {
    let temp = [...this.state.parentPagesIds];
    temp.push(this.state.id);
    let res = await this.props.createNote(temp);
    temp = this.state.childPagesIds;
    temp.push(res);
    this.setState({ ...this.state, childPagesIds: temp });
    await this.saveNotes();
    this.dropdownClicked();
  };

  render() {
    // console.log("MainCreateNotes -- render");
    return (
      <div className="editnote">
        <div className="editnote-topbar">
          {this.state.parentPages.map((parent) => {
            return (
              <>
                <div
                  className="editnote-clickable"
                  onClick={() => {
                    this.props.changeRoute(parent.note_id);
                  }}
                >
                  {parent.title}
                </div>
                <span>/</span>
              </>
            );
          })}
          <div className="editnote-clickable">{this.state.title}</div>
        </div>

        <div className="editnote-scrollable">
          <form onSubmit={this.EditNote}>
            <div className="editnote-preview d-flex justify-content-md-center align-items-center">
              <div className="editnote-header">
                <div className="editnote-dropdown-parent">
                  <img
                    src={require("../images/square-plus-icon.png")}
                    className={"editnote-dropdown-plus-icon"}
                    width={20}
                    onClick={this.dropdownClicked}
                  ></img>
                  {this.state.dropdownVisible ? (
                    <div className="editnote-dropdown-content">
                      <a onClick={() => this.addNewChildPage()}>
                        <img
                          className="editnote-dropdown-icon"
                          src={require("../images/page-link-icon.png")}
                          height={50}
                          width={50}
                        ></img>
                        <div className="editnote-dropdown-text">
                          <p className="editnote-dropdown-head">Link to page</p>
                          <p className="editnote-dropdown-subhead">
                            Add a child page
                          </p>
                        </div>
                      </a>
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
                          this.props.changeRoute(childNote.note_id);
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
                    rows="23"
                    required
                    value={this.state.content}
                    onChange={this.OnChangeInput}
                    ref={(c) => (this.textarea = c)}
                  ></textarea>
                </div>
              </div>

              <button type="submit" className="btn btn-primary mt-2">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default EditNote;

{
  // task 3: fix the share notes part
}
