import React, { Component } from "react";
import "./App.css";
import Login from "./components/Login";
import MainPage from "./components/MainPage";
import axios from "axios";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogin: false,
    };
  }

  setIsLogin = (val) => {
    this.setState({ ...this.state, isLogin: val });
  };

  componentDidMount() {
    const checkLogin = async () => {
      const token = localStorage.getItem("tokenStore");
      if (token) {
        const verified = await axios.get("/users-api/verify", {
          headers: { Authorization: token },
        });
        console.log(verified);
        this.setIsLogin(verified.data);
        if (verified.data === false) return localStorage.clear();
      } else {
        this.setIsLogin(false);
      }
    };
    checkLogin();
  }

  render() {
    return (
      <div>
        {this.state.isLogin ? (
          <MainPage setIsLogin={this.setIsLogin} />
        ) : (
          <Login setIsLogin={this.setIsLogin} />
        )}
      </div>
    );
  }
}

export default App;
