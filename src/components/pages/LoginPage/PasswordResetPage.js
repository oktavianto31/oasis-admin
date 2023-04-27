import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { BallTriangle } from "react-loader-spinner";
import { PassTextField } from "../../Forms/FormLib";
import { connect } from "react-redux";
import { resetPassword } from "../../Auth/actions/userActions";
import { useHistory, useParams } from "react-router-dom";
import "./LoginPage.css";

function PasswordResetPage({ resetPassword }) {
  let history = useHistory();
  const { userID, resetString } = useParams();

  return (
    <div className="backgroundcontainer">
      <div className="innercontainer">
        <div className="containertitle">Password Reset</div>
        <div className="containerforms">
          <Formik
            initialValues={{
              newPassword: "",
              confirmNewPassword: "",
              userID,
              resetString,
            }}
            validationSchema={Yup.object().shape({
              newPassword: Yup.string()
                .required("Required")
                .min(8, "Password is too short - should be 8 chars minimum.")
                .matches(/(?=.*[0-9])/, "Password must contain a number.")
                .max(30, "Password is too long"),
              confirmNewPassword: Yup.string()
                .oneOf([Yup.ref("newPassword")], "Password not matched")
                .required("Required"),
            })}
            onSubmit={(values, { setSubmitting, setFieldError }) => {
              resetPassword(values, history, setFieldError, setSubmitting);
            }}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form>
                <div className="passinputform">
                  <PassTextField
                    name="newPassword"
                    placeholder="Enter New password"
                  />
                </div>

                <div className="passinputform">
                  <PassTextField
                    name="confirmNewPassword"
                    placeholder="Confirm New Password"
                  />
                </div>

                <div className="buttongroup">
                  {!isSubmitting && (
                    <button type="submit" className="loginbutton">
                      Proceed
                    </button>
                  )}
                  {isSubmitting && (
                    <BallTriangle color="#f10c0c" height={80} width={80} />
                  )}
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default connect(null, { resetPassword })(PasswordResetPage);
