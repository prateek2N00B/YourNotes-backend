import React, { Component } from "react";

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = { activeNoteId: "" };
  }

  componentDidMount() {}

  titleClick = (id) => {
    this.props.changeRoute(id);
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

          {/* <div className="sidebar-title">title 1</div>
          <div className="sidebar-title">title 1</div> */}
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
      </div>
    );
  }
}

export default Sidebar;
