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
        <div className="sidebar-top">
          <div className="sidebar-username">username</div>
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
                {note.title}
              </div>
            );
          })}

          {/* <div className="sidebar-title">title 1</div>
          <div className="sidebar-title">title 1</div> */}
          <div className="sidebar-title" onClick={() => this.props.addNote()}>
            + Add a page
          </div>
        </div>
      </div>
    );
  }
}

export default Sidebar;

