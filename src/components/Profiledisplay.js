import React from "react";
import Avatar from "@mui/material/Avatar";

function Profiledisplay({ prof, name, email, phone, dob, address }) {
  return (
    <div className="div3">
      <div className="div4">
        <Avatar className="prof1" src={prof} alt="" />
        <h1>{name}</h1>
      </div>
      <div className="div5">
        <h3>Name : {name}</h3>
        <h3>Email : {email}</h3>
        <h3>Phone : {phone}</h3>
        <h3>DOB : {dob}</h3>
        <h3>AGE :</h3>
        <h3 className="addh3">Address : {address}</h3>
      </div>
    </div>
  );
}

export default Profiledisplay;
