import React, { Component } from "react";
import axios from "axios";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      err: "",
      onLoginPage: true,
    };
  }

  onChangeInput = (e) => {
    const { name, value } = e.target;
    this.setState({ ...this.state, [name]: value });
  };

  registerSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/users-api/register", {
        username: this.state.name,
        email: this.state.email,
        password: this.state.password,
      });
      this.setState({
        ...this.state,
        name: "",
        email: "",
        password: "",
        err: res.data.msg,
      });
    } catch (err) {
      err.response.data.msg &&
        this.setState({ ...this.state, err: err.response.data.msg });
    }
  };

  loginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/users-api/login", {
        email: this.state.email,
        password: this.state.password,
      });
      localStorage.setItem("tokenStore", res.data.token);
      this.props.setLoginDetails(true, res.data.username);
      this.setState({
        ...this.state,
        name: "",
        email: "",
        password: "",
      });
    } catch (err) {
      err.response.data.msg &&
        this.setState({ ...this.state, err: err.response.data.msg });
    }
  };

  setOnLoginPage = (val) => {
    this.setState({ ...this.state, onLoginPage: val });
  };

  render() {
    return (
      <section>
        {this.state.onLoginPage ? (
          <div className="login-page">
            <section className="vh-100 gradient-custom">
              <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                  <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                    <div className="card bg-dark text-white">
                      <div className="card-body p-5 text-center">
                        <div className="mb-md-5 mt-md-4 pb-5">
                          <h2 className="fw-bold mb-2 text-uppercase">Login</h2>
                          <p className="text-white-50 mb-5">
                            Please enter your login and password!
                          </p>

                          <form onSubmit={this.loginSubmit}>
                            <div className="form-outline form-white mb-4">
                              <input
                                type="email"
                                name="email"
                                id="login-email"
                                className="form-control form-control-lg"
                                required
                                placeholder="Email"
                                value={this.state.email}
                                onChange={this.onChangeInput}
                              />
                            </div>

                            <div className="form-outline form-white mb-4">
                              <input
                                type="password"
                                name="password"
                                id="login-password"
                                className="form-control form-control-lg"
                                required
                                placeholder="Password"
                                value={this.state.password}
                                onChange={this.onChangeInput}
                              />
                            </div>

                            <button
                              className="btn btn-outline-light btn-lg px-5 mt-5 mb-5"
                              type="submit"
                            >
                              Login
                            </button>
                          </form>

                          <div>
                            <p className="mb-0">
                              Don't have an account?
                              <span onClick={() => this.setOnLoginPage(false)}>
                                {" "}
                                Sign Up
                              </span>
                            </p>
                          </div>
                          {this.state.err !== "" ? (
                            <h4 className="mb-0 mt-5">{this.state.err}</h4>
                          ) : (
                            <></>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        ) : (
          <div className="login-page">
            <section className="vh-100 gradient-custom">
              <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                  <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                    <div className="card bg-dark text-white">
                      <div className="card-body p-5 text-center">
                        <div className="mb-md-5 mt-md-4 pb-5">
                          <h2 className="fw-bold mb-2 text-uppercase">
                            Register
                          </h2>
                          <p className="text-white-50 mb-5">
                            Please enter your details!
                          </p>

                          <form onSubmit={this.registerSubmit}>
                            <div className="form-outline form-white mb-4">
                              <input
                                type="text"
                                name="name"
                                id="register-name"
                                className="form-control form-control-lg"
                                required
                                placeholder="User Name"
                                value={this.state.name}
                                onChange={this.onChangeInput}
                              />
                            </div>

                            <div className="form-outline form-white mb-4">
                              <input
                                type="email"
                                name="email"
                                id="register-email"
                                className="form-control form-control-lg"
                                required
                                placeholder="Email"
                                value={this.state.email}
                                onChange={this.onChangeInput}
                              />
                            </div>

                            <div className="form-outline form-white mb-4">
                              <input
                                type="password"
                                name="password"
                                id="register-password"
                                className="form-control form-control-lg"
                                required
                                placeholder="Password"
                                value={this.state.password}
                                onChange={this.onChangeInput}
                              />
                            </div>

                            <button
                              className="btn btn-outline-light btn-lg px-5 mt-5 mb-5"
                              type="submit"
                            >
                              Register
                            </button>
                          </form>

                          <div>
                            <p className="mb-0">
                              You have an account?
                              <span
                                onClick={() => {
                                  this.setOnLoginPage(true);
                                }}
                              >
                                {" "}
                                Login Now
                              </span>
                            </p>
                          </div>
                          {this.state.err !== "" ? (
                            <h4 className="mb-0 mt-5">{this.state.err}</h4>
                          ) : (
                            <></>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </section>
    );
  }
}

export default Login;
