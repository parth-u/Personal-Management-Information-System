import { TextField } from "@mui/material";
import "./Login.css";
import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import background from "./background.mp4";

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="B">
      <div className="B1">
        <video className="BACK" src={background} autoPlay loop muted />

        <div className="B2">
          <Navbar className="lognav" />
          <div className="B3">
            <div class="main1">
              <input type="checkbox" id="chk" aria-hidden="true" />

              <div class="login">
                <form class="form">
                  <label for="chk" aria-hidden="true">
                    Log in
                  </label>
                  <input
                    class="input1"
                    type="email"
                    name="email"
                    placeholder="Email"
                    required=""
                  />
                  <input
                    class="input1"
                    type="password"
                    name="pswd"
                    placeholder="Password"
                    required=""
                  />
                  <button onClick={() => navigate("/")}> Log in</button>
                </form>
              </div>

              <div class="register">
                <form class="form">
                  <label for="chk" aria-hidden="true">
                    Register
                  </label>
                  <input
                    class="input1"
                    type="text"
                    name="txt"
                    placeholder="Username"
                    required=""
                  />
                  <input
                    class="input1"
                    type="email"
                    name="email"
                    placeholder="Email"
                    required=""
                  />
                  <input
                    class="input1"
                    type="password"
                    name="pswd"
                    placeholder="Password"
                    required=""
                  />
                  <button>Register</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
