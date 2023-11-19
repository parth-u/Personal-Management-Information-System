import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";

function calculateAge(birthdate) {
  const today = new Date();
  const birthDate = new Date(birthdate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}

function Profiledisplay({ prof, name, email, phone, dob, address }) {
  const [age, setAge] = useState(0);

  useEffect(() => {
    // Calculate age when DOB changes
    setAge(calculateAge(dob));
  }, [dob]);

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
        <h3>AGE : {age}</h3>
        <h3 className="addh3">Address : {address}</h3>
      </div>
    </div>
  );
}

export default Profiledisplay;
