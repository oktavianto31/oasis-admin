import React from "react";
import { render } from "react-dom";
import App from "./App";
import { Provider } from "react-redux";
import store from "./components/Auth/store";
import "./index.css";

<link
  href="https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,wght@0,200;0,300;0,400;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,600;1,700;1,800;1,900&display=swap"
  rel="stylesheet"
></link>;

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
