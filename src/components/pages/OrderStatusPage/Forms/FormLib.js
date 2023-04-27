import React, { useState } from "react";
import { ErrorMessage, useField } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import "./FormLib.css";

export const TextField = ({ icon, label, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <>
      <div className="inputformcontainer">
        <label htmlFor={field.name}>{label}</label>

        <input
          className={`othersinputform ${
            meta.touched && meta.error && "is-invalid"
          }`}
          {...field}
          {...props}
          autoComplete="off"
        />
      </div>
      <div className="errorcontainer">
        <ErrorMessage component="div" name={field.name} className="error" />
      </div>
    </>
  );
};

export const PassTextField = ({ icon, label, ...props }) => {
  const [field, meta] = useField(props);
  const [show, setShow] = useState(false);

  return (
    <>
      <div className="passinputformcontainer">
        <label htmlFor={field.name}>{label}</label>

        <input
          className={`othersinputform ${
            meta.touched && meta.error && "is-invalid"
          }`}
          {...field}
          {...props}
          type={show ? "text" : "password"}
          autoComplete="off"
        />

        <FontAwesomeIcon
          icon={show ? faEye : faEyeSlash}
          className="passicon"
          onClick={() => setShow(!show)}
        ></FontAwesomeIcon>
      </div>
      <div className="errorcontainer">
        <ErrorMessage component="div" name={field.name} className="error" />
      </div>
    </>
  );
};
