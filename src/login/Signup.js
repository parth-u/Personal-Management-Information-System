import React from "react";

function signup() {
  return (
    <div>
      <h1>SIGN UP </h1>
      <form class="form">
        <p class="title">Register </p>
        <p class="message">Signup now and get full access to our app. </p>
        <div class="flex">
          <label>
            <input class="input" type="text" placeholder="" required=""></input>
            <span>Firstname</span>
          </label>

          <label>
            <input class="input" type="text" placeholder="" required=""></input>
            <span>Lastname</span>
          </label>
        </div>

        <label>
          <input class="input" type="email" placeholder="" required=""></input>
          <span>Email</span>
        </label>

        <label>
          <input
            class="input"
            type="password"
            placeholder=""
            required=""
          ></input>
          <span>Password</span>
        </label>
        <label>
          <input
            class="input"
            type="password"
            placeholder=""
            required=""
          ></input>
          <span>Confirm password</span>
        </label>

        <p class="signin">
          Already have an acount ? <a href="#">Signin</a>{" "}
        </p>
        <button className="after">Submit</button>
      </form>
    </div>
  );
}

export default signup;
