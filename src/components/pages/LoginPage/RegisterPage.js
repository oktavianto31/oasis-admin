import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Link, useHistory } from "react-router-dom";
import { BallTriangle } from "react-loader-spinner";
import { connect } from "react-redux";
import { signupUser } from "../../Auth/actions/userActions";
import { PassTextField, TextField } from "../../Forms/FormLib";
import "./LoginPage.css";

function RegisterPage({ signupUser }) {
  let history = useHistory();
  const [ErrorMessage, seterrormessage] = useState();

  return (
    <div className="backgroundcontainer">
      <div className="registerinnercontainer">
        <div className="containertitle">Register For Oasis One</div>
        <div className="containerforms">
          <Formik
            initialValues={{
              name: "",
              email: "",
              address: "",
              phonenumber: "",
              password: "",
              confirmPassword: "",
            }}
            validationSchema={Yup.object({
              name: Yup.string().required("Required"),
              email: Yup.string()
                .email("Invalid e-mail address")
                .required("Required"),
              password: Yup.string()
                .min(8, "Password is too short - should be 8 chars minimum")
                .matches(/(?=.*[0-9])/, "Password must contain a number.")
                .max(30, "Password is too long")
                .required("Required"),
              confirmPassword: Yup.string()
                .oneOf([Yup.ref("password")], "Password not matched")
                .required("Required"),
            })}
            onSubmit={(values, { setSubmitting, setFieldError }) => {
              signupUser(
                values,
                history,
                setFieldError,
                seterrormessage,
                setSubmitting
              );
            }}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form>
                <div className="marginedinputform">
                  <TextField
                    name="name"
                    type="text"
                    placeholder="Merchant Name"
                  />
                </div>

                <div className="marginedinputform">
                  <TextField
                    name="email"
                    type="text"
                    placeholder="Email"
                  />
                </div>

                <div className="passinputform">
                  <PassTextField
                    name="password"
                    placeholder="Password"
                  />
                </div>

                <div className="passinputform">
                  <PassTextField
                    name="confirmPassword"
                    placeholder="Confirm Password"
                  />
                </div>

                <div className="buttongroup">
                  {!isSubmitting && (
                    <button type="submit" className="loginbutton">
                      
                      Register
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

export default connect(null, { signupUser })(RegisterPage);
