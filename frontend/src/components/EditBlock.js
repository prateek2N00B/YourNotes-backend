import React, { Component } from "react";
import ContentEditable from "react-contenteditable";

class EditBlock extends Component {
  constructor(props) {
    super(props);
    this.nameInput = React.createRef();
    this.state = {
      tag: "p",
      html: "",
      placeholder: "placeholder",
    };
  }

  componentDidMount() {
    this.setState({ html: this.props.html, tag: this.props.tag });
    this.nameInput.current.focus();
    this.props.changeActiveElement(this.props.id, this.nameInput.current);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.tag !== this.props.tag) {
      this.nameInput.current.focus();
      this.props.changeActiveElement(this.props.id, this.nameInput.current);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ html: nextProps.html, tag: nextProps.tag });
  }

  onChangeValue = async (e) => {
    this.setState({ html: e.target.value });
    this.props.onChangeHandler({
      id: this.props.id,
      html: e.target.value,
      tag: this.state.tag,
    });
  };

  onKeyDownHandler = (e) => {
    this.props.changeActiveElement(this.props.id, this.nameInput.current);
    if (e.key === "Backspace" && !this.state.html) {
      e.preventDefault();
      this.props.deleteBlock(this.props.id, this.nameInput.current);
    }
  };

  onMouseUpHandler = (e) => {
    this.props.changeActiveElement(this.props.id, this.nameInput.current);
  };
  onMouseDownHandler = (e) => {
    this.props.changeActiveElement(this.props.id, this.nameInput.current);
  };

  render() {
    return (
      <ContentEditable
        className="EditBlock"
        innerRef={this.nameInput}
        html={this.state.html}
        tagName={this.state.tag}
        onChange={this.onChangeValue}
        onKeyDown={this.onKeyDownHandler}
        onMouseUp={this.onMouseUpHandler}
        onMouseDown={this.onMouseDownHandler}
      />
    );
  }
}

export default EditBlock;
