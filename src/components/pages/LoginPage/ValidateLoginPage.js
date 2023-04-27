import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Link, useHistory, useParams } from "react-router-dom";
import { BallTriangle } from "react-loader-spinner";
import { PassTextField, TextField } from "../../Forms/FormLib";
import { connect } from "react-redux";
import { loginUser } from "../../Auth/actions/userActions";
import "./LoginPage.css";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { useNeonCheckboxStyles } from "../SettingsPage/checkbox";
import CustomCheckbox from "../../CustomCheckbox/CustomCheckbox";

function ValidateLoginPage({ loginUser }) {
  let history = useHistory();
  const { userEmail } = useParams();
  const [modalTof, setModalTof] = useState(false);
  const neonStyles = useNeonCheckboxStyles();
  const localUrl = process.env.REACT_APP_TENANTURL;
  console.log("usss", userEmail);
  const [email, setEmail] = useState("");
  const [acceptTos, setAcceptedTos] = useState(false);


  // useEffect(() => {
  //     const url = localUrl + "/checktermsaccepted";

  //     fetch(url, {
  //       method: "POST",
  //       body: JSON.stringify({
  //         email: email,
  //       }),
  //       headers: { "content-type": "application/JSON" },
  //     })
  //       .then((response) => response.json())
  //       .then((result) => {
  //         setAcceptedTos(result.message)
  //         console.log(result.message,acceptTos)
  //       });
     
  // }, [email]);

  return (
    <div className="backgroundcontainer">
      <div className="innercontainer">
        <div className="containertitle">Login For Oasis One</div>
        <div className="containerforms">
          <Formik
            initialValues={{ email: userEmail, password: "", acceptedTos: localStorage.getItem("acceptedTos") }}
            validationSchema={Yup.object().shape({
              email: Yup.string().email("Invalid e-mail address").required("Required"),
              password: Yup.string()
                .required("Required")
                .min(8, "Password is too short - should be 8 chars minimum.")
                .matches(/(?=.*[0-9])/, "Password must contain a number.")
                .max(30, "Password is too long"),
              acceptedTos: Yup.boolean().oneOf([true], "Please accept the terms of service"),
            })}
            onSubmit={(values, { setSubmitting, setFieldError }) => {
              loginUser(values, history, setFieldError, setSubmitting);
            }}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="formcontainer">
                <div className="marginedinputform">
                  <TextField
                    //label="Email"
                    name="email"
                    type="text"
                    placeholder="Email"
                    // onInput={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="passinputform">
                  <PassTextField
                    //label="Password"
                    name="password"
                    placeholder="Password"
                  />
                </div>

                <Link to="/forgetpassword" className="rightlink">
                  Forgot Password?
                </Link>

                {/* <FormControlLabel
                  id="termsAndCondtions"
                  name="termsAndConditions"
                  className="termcondition"
                  control={<Checkbox disableRipple checked={agree} onChange={() => setAgree(!agree)} classes={neonStyles} checkedIcon={<span />} icon={<span />} />}
                  label="Saya Menyetujui Syarat & Ketentuan Serta Kebijakan Privasi Oasis One"
                /> */}
                <CustomCheckbox type="checkbox" name="acceptedTos" />

                <div className="buttongroup">
                  {!isSubmitting && (
                    <button type="submit" className="loginbutton">
                      Login
                    </button>
                  )}
                  {isSubmitting && <BallTriangle color="#f10c0c" height={80} width={80} />}
                </div>

                <div className="middlerow">
                  Don't have an account?
                  <Link to="/register" className="link">
                    &nbsp;Register
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

export default connect(null, { loginUser })(ValidateLoginPage);
