import React, { Component } from "react";
import axios from "axios";

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = { activeNoteId: "", url: "" };
  }

  componentDidMount() {}

  titleClick = (id) => {
    this.props.changeRoute(id);
  };

  onChangeInput = (e) => {
    const { name, value } = e.target;
    this.setState({ ...this.state, [name]: value });
  };

  render() {
    return (
      <div className="sidebar-preview">
        <div className="sidebar-header">
          <div className="sidebar-user-icon">{this.props.username[0]}</div>
          <div className="sidebar-username">{this.props.username}</div>
        </div>
        <div className="sidebar-titles">
          {this.props.notes.map((note) => {
            let temp = this.props.id === note._id;
            return (
              <div
                key={note._id}
                className={temp ? "sidebar-title-highlighted" : "sidebar-title"}
                onClick={() => this.titleClick(note._id)}
              >
                <img
                  src={require("../images/notes-icon.png")}
                  className={"sidebar-title-image"}
                ></img>
                {note.title}
              </div>
            );
          })}

          {/* Add page part */}
          <div
            className="sidebar-title"
            style={{ color: "#37352f" }}
            onClick={() => this.props.addNote()}
          >
            <img
              src={require("../images/plus-icon.png")}
              className={"sidebar-title-plus-image"}
              width={20}
            ></img>
            Add a page
          </div>
        </div>

        {/* shared notes part */}
        <div className="sidebar-sharednotes-titles">
          {this.props.sharedNotesIds.map((note) => {
            let temp = this.props.id === note.note_id;
            return (
              <div
                key={note.note_id}
                className={temp ? "sidebar-title-highlighted" : "sidebar-title"}
                onClick={() => this.titleClick(note.note_id)}
              >
                <img
                  src={require("../images/notes-icon.png")}
                  className={"sidebar-title-image"}
                ></img>
                {note.title}
              </div>
            );
          })}

          <div className="sidebar-sharenotes-input">
            <input
              type="url"
              className="form-control"
              name="url"
              id="sharedurl-input"
              aria-describedby="emailHelp"
              placeholder="Enter the shared Url"
              value={this.state.url}
              onChange={this.onChangeInput}
            ></input>
          </div>
          <div
            className="sidebar-title"
            style={{ color: "#37352f" }}
            onClick={() => this.props.addSharedNote(this.state.url)}
          >
            <img
              src={require("../images/plus-icon.png")}
              className={"sidebar-title-plus-image"}
              width={20}
            ></img>
            Add a share page
          </div>
        </div>
      </div>
    );
  }
}

export default Sidebar;
