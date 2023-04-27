import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useHistory, useParams } from "react-router-dom";
import "./LoginPage.css";

function EmailSentPage() {
  let history = useHistory();
  const { userEmail, reset } = useParams();

  return (
    <div className="backgroundcontainer">
      {reset && userEmail && (
        <div className="innercontainer">
          <div className="containertitle">Password Reset Request</div>
          <div className="containertext">
            An email with a password reset link has been sent to your email:
            <b className="emailtext">&nbsp;{userEmail}</b>
            <p>Check your email and click on the link to proceed!</p>
          </div>
        </div>
      )}

      {!reset && userEmail && (
        <div className="innercontainer">
          <div className="containertitle">Account Confirmation</div>
          <div className="containertext">
            An email with your account confirmation link has been sent to your
            email:
            <b className="emailtext">{userEmail}</b>
            <p>Check your email and come back to proceed!</p>
          </div>
          <button
            style={{
              outline: "none",
              backgroundColor: "transparent",
              border: "none",
              justifyContent: "center",
              display: "flex",
            }}
          >
            
            {/* <Link className="resetbutton" to={`/login/${userEmail}`}>Proceed</Link> */}
          </button>
        </div>
      )}

      {!reset && !userEmail && (
        <div className="innercontainer">
          <div className="containertitle">Password Reset</div>
          <div className="containertext">
            Your password has been reset successfully
            <p>You may now login!</p>
            <Link to={`/login`} className="resetbutton">
              Login
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmailSentPage;
