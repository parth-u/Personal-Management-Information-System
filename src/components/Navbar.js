import React from "react";
import "./Navbar.css";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import prof from "./prof.jpg";
import logo1 from "./pimslogo.png";
import { useNavigate } from "react-router-dom";
function Navbar() {
  const navigate = useNavigate();
  return (
    <div className="top">
      <div className="top1">
        <h3>Personal Information Managment System</h3>
        <img className="logo" src={logo1} atl="" />
      </div>
    </div>
  );
}

export default Navbar;
