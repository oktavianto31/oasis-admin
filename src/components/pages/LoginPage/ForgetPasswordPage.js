import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Link, useHistory, useParams } from "react-router-dom";
import { BallTriangle } from "react-loader-spinner";
import { TextField } from "../../Forms/FormLib";
import { connect } from "react-redux";
import { forgetpassword } from "../../Auth/actions/userActions";
import "./LoginPage.css";

function ForgetPasswordPage({ forgetpassword }) {
  let history = useHistory();
  const { userEmail } = useParams();

  return (
    <div className="backgroundcontainer">
      <div className="registerinnercontainer">
        <div className="containertitle">Forgot Password</div>
        <div className="containerforms">
          <Formik
            initialValues={{
              email: userEmail,
              redirectUrl: "https://admin.oasis-one.com/passwordreset",
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string()
                .email("Invalid e-mail address")
                .required("Required"),
            })}
            onSubmit={(values, { setSubmitting, setFieldError }) => {
              forgetpassword(values, history, setFieldError, setSubmitting);
            }}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form>
                <div className="marginedinputform">
                  <TextField
                    //label="Email"
                    name="email"
                    type="text"
                    placeholder="Email"
                  />
                </div>

                <div className="buttongroup">
                  {!isSubmitting && (
                    <button
                      type="submit"
                      className="loginbutton"
                    >
                      
                      Submit
                    </button>
                  )}
                  {isSubmitting && (
                    <BallTriangle color="#f10c0c" height={80} width={80} />
                  )}
                </div>

                <div className="middlerow">
                  Already have an account?
                  <Link to="/login" className="link">
                    &nbsp;Login
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default connect(null, { forgetpassword })(ForgetPasswordPage);
