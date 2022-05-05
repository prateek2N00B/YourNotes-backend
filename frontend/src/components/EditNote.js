import React, { Component } from "react";
import axios from "axios";
import autosize from "autosize";

import EditBlock from "./EditBlock";

const unique_id = () => {
  return Date.now().toString(36);
};

class EditNote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      title: "",
      blocks: [],
      childPagesIds: [],
      parentPagesIds: [],
      childPages: [],
      parentPages: [],
      dropdownVisible: false,
      temp: [],
      activeElement: { id: null, ref: null },
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
        blocks: res.data.blocks,
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
    // console.log(this.state);
    let res = await this.getNoteTitleFromIds(this.state.childPagesIds);
    // console.log(res);
    this.setState({ ...this.state, childPages: res });
    res = await this.getNoteTitleFromIds(this.state.parentPagesIds);
    this.setState({ ...this.state, parentPages: res });
    // console.log(this.state);
  };

  componentDidMount() {
    // console.log("EditNote - componentDidMounnt");
    this.getNoteInfo();
    // console.log(this.state);
    autosize(this.textarea);
  }

  componentDidUpdate() {
    if (this.props.match.params.id !== this.state.id) {
      this.getNoteInfo();
    }
  }

  saveNotes = async () => {
    console.log(this.state.blocks);
    try {
      const token = localStorage.getItem("tokenStore");
      if (token) {
        const date = new Date().toLocaleString();
        const newNote = {
          title: this.state.title,
          blocks: this.state.blocks,
          date: date,
          childPages: this.state.childPagesIds,
          parentPages: this.state.parentPagesIds,
        };

        await axios.put(`/notes-api/${this.state.id}`, newNote, {
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
    this.setState({ dropdownVisible: !temp });
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

  deleteNote = async (id) => {
    try {
      const token = localStorage.getItem("tokenStore");
      if (token) {
        await axios.delete(`notes-api/${id}`, {
          headers: { Authorization: token },
        });
        this.getNoteInfo();
      }
    } catch (err) {
      console.log(err);
      window.location.href = "/";
    }
  };

  deleteChildPage = async (id) => {
    try {
      const token = localStorage.getItem("tokenStore");
      if (token) {
        const res = await axios.post(
          `/notes-api/${this.state.id}/delete-childPage`,
          { childPage_id: id },
          { headers: { Authorization: token } }
        );

        if (res.data === "ChildPage deleted") {
          this.getNoteInfo();
        }
      }
    } catch (err) {
      console.log(err);
      window.location.href = "/";
    }
  };

  onChangeHandler = (updatedBlock) => {
    const blocks = this.state.blocks;
    const index = blocks.map((b) => b.id).indexOf(updatedBlock.id);
    const updatedBlocks = [...blocks];
    updatedBlocks[index] = {
      ...updatedBlocks[index],
      tag: updatedBlock.tag,
      html: updatedBlock.html,
    };
    this.setState({ blocks: updatedBlocks });
  };

  setCursorToEnd = (element) => {
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(element);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
    element.focus();
  };

  deleteBlock = (id, ref) => {
    const previousBlock = ref.previousElementSibling;
    const index = this.state.blocks.map((b) => b.id).indexOf(id);
    if (index > 0) {
      const updatedBlocks = [...this.state.blocks];
      updatedBlocks.splice(index, 1);
      this.changeActiveElement(this.state.blocks[index - 1].id, previousBlock);
      this.setState({ blocks: updatedBlocks }, () => {
        this.setCursorToEnd(previousBlock);
        previousBlock.focus();
      });
    }
  };

  // addNewHeadingBlock = async () => {
  //   if (this.state.activeElement.ref != null) {
  //     let newBlock = { id: unique_id(), tag: "h2", html: "" };
  //     const blocks = this.state.blocks;
  //     const index = blocks
  //       .map((b) => b.id)
  //       .indexOf(this.state.activeElement.id);
  //     if (this.state.activeElement.ref.outerText == "") {
  //       const updatedBlocks = [...blocks];
  //       updatedBlocks[index].tag = "h2";
  //       await this.setState({ blocks: updatedBlocks });
  //       this.state.activeElement.ref.focus();
  //     } else {
  //       const updatedBlocks = [...blocks];
  //       updatedBlocks.splice(index + 1, 0, newBlock);
  //       await this.setState({ blocks: updatedBlocks }, () => {
  //         if (this.state.activeElement.ref.nextElementSibling) {
  //           this.state.activeElement.ref.nextElementSibling.focus();
  //         }
  //       });
  //     }
  //     this.dropdownClicked();
  //     this.forceUpdate();
  //   }
  // };

  // addNewSubHeadingBlock = async () => {
  //   if (this.state.activeElement.ref != null) {
  //     let newBlock = { id: unique_id(), tag: "h3", html: "" };
  //     const blocks = this.state.blocks;
  //     const index = blocks
  //       .map((b) => b.id)
  //       .indexOf(this.state.activeElement.id);
  //     if (this.state.activeElement.ref.outerText == "") {
  //       const updatedBlocks = [...blocks];
  //       updatedBlocks[index].tag = "h3";
  //       await this.setState({ blocks: updatedBlocks });
  //       this.state.activeElement.ref.focus();
  //     } else {
  //       const updatedBlocks = [...blocks];
  //       updatedBlocks.splice(index + 1, 0, newBlock);
  //       await this.setState({ blocks: updatedBlocks }, () => {
  //         if (this.state.activeElement.ref.nextElementSibling) {
  //           this.state.activeElement.ref.nextElementSibling.focus();
  //         }
  //       });
  //     }
  //     this.dropdownClicked();
  //     this.forceUpdate();
  //   }
  // };

  // addNewTextBlock = async () => {
  //   if (this.state.activeElement.ref != null) {
  //     let newBlock = { id: unique_id(), tag: "p", html: "" };
  //     const blocks = this.state.blocks;
  //     const index = blocks
  //       .map((b) => b.id)
  //       .indexOf(this.state.activeElement.id);
  //     if (this.state.activeElement.ref.outerText == "") {
  //       const updatedBlocks = [...blocks];
  //       updatedBlocks[index].tag = "p";
  //       await this.setState({ blocks: updatedBlocks }, () => {
  //         this.state.activeElement.ref.focus();
  //       });
  //     } else {
  //       const updatedBlocks = [...blocks];
  //       updatedBlocks.splice(index + 1, 0, newBlock);
  //       await this.setState({ blocks: updatedBlocks }, () => {
  //         if (this.state.activeElement.ref.nextElementSibling) {
  //           this.state.activeElement.ref.nextElementSibling.focus();
  //         }
  //       });
  //     }
  //     this.dropdownClicked();
  //     this.forceUpdate();
  //   }
  // };

  addNewBlock = async (tag) => {
    if (this.state.activeElement.ref != null) {
      let newBlock = { id: unique_id(), tag: tag, html: "" };
      const blocks = this.state.blocks;
      const index = blocks
        .map((b) => b.id)
        .indexOf(this.state.activeElement.id);
      if (this.state.activeElement.ref.outerText == "") {
        const updatedBlocks = [...blocks];
        updatedBlocks[index].tag = tag;
        await this.setState({ blocks: updatedBlocks }, () => {
          this.state.activeElement.ref.focus();
        });
      } else {
        const updatedBlocks = [...blocks];
        updatedBlocks.splice(index + 1, 0, newBlock);
        await this.setState({ blocks: updatedBlocks }, () => {
          if (this.state.activeElement.ref.nextElementSibling) {
            this.state.activeElement.ref.nextElementSibling.focus();
          }
        });
      }
      this.dropdownClicked();
      this.forceUpdate();
    }
  };

  changeActiveElement = async (id, ref) => {
    let temp = { ref: ref, id: id };
    await this.setState({ activeElement: temp }, () => {
      // console.log(this.state.activeElement.id, this.state.activeElement.ref);
    });
  };

  render() {
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
                    src={require("../images/dropdown-icon.png")}
                    className={"editnote-dropdown-plus-icon"}
                    width={20}
                    onClick={this.dropdownClicked}
                    alt="dropdown-icon"
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
                            Add a child page.
                          </p>
                        </div>
                      </a>

                      <a onClick={() => this.addNewBlock("h2")}>
                        <div className="editnote-dropdown-vis">H1</div>
                        <div className="editnote-dropdown-text">
                          <p className="editnote-dropdown-head">Heading</p>
                          <p className="editnote-dropdown-subhead">
                            Section heading.
                          </p>
                        </div>
                      </a>

                      <a onClick={() => this.addNewBlock("h3")}>
                        <div className="editnote-dropdown-vis">H2</div>
                        <div className="editnote-dropdown-text">
                          <p className="editnote-dropdown-head">Sub Heading</p>
                          <p className="editnote-dropdown-subhead">
                            Sub-section heading.
                          </p>
                        </div>
                      </a>

                      <a onClick={() => this.addNewBlock("p")}>
                        <div className="editnote-dropdown-vis">Aa</div>
                        <div className="editnote-dropdown-text">
                          <p className="editnote-dropdown-head">Text</p>
                          <p className="editnote-dropdown-subhead">
                            Just plain text.
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
                  <div style={{ marginBottom: 20 }}>
                    {this.state.childPages.map((childNote) => {
                      return (
                        <div
                          className="editnote-content-pagelink-parent justify-content-between"
                          key={childNote.note_id}
                        >
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
                          <div
                            className="edinote-content-pagelink-delete"
                            onClick={() =>
                              this.deleteChildPage(childNote.note_id)
                            }
                          >
                            <img
                              src={require("../images/remove-icon.png")}
                              width={22}
                            ></img>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {this.state.blocks.map((block) => {
                    return (
                      <EditBlock
                        key={block.id}
                        id={block.id}
                        tag={block.tag}
                        html={block.html}
                        onChangeHandler={this.onChangeHandler}
                        deleteBlock={this.deleteBlock}
                        changeActiveElement={this.changeActiveElement}
                      />
                    );
                  })}
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
