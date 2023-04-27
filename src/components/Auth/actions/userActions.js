import { sessionService } from "redux-react-session";
import moment from "moment";

// the remote endpoint and local
const currentUrl = "https://backend.oasis-one.com/";
const contractUrl = process.env.REACT_APP_CONTRACTURL;
let currentDate = new Date();

export const loginUser = (
  credentials,
  history,
  setFieldError,
  setSubmitting
) => {
  return () => {
    fetch(`${currentUrl}api/tenant/signin`, {
      method: "POST",
      mode: "cors",
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
        acceptTOS: credentials.acceptedTos,
      }),
      headers: { "content-type": "application/JSON" },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "FAILED") {
          const { message } = result;

          //check for specific error
          if (message.includes("credentials")) {
            setFieldError("email", message);
            setFieldError("password", message);
          } else if (message.includes("password")) {
            setFieldError("password", message);
          } else if (message.includes("email")) {
            setFieldError("email", message);
          }
        } else if (result.status === "SUCCESS") {
          const token = result.data[0].tenant_id;

          localStorage.setItem("acceptedTos",true)
          localStorage.setItem("email", result.data[0].email);

          sessionService
            .saveSession(token)
            .then(() => {
              sessionService
                .saveUser(result.data[0])
                .then(() => {
                  // Get Contract Data
                  const url = contractUrl + "/retrieve/" + token;

                  fetch(url, {
                    method: "GET",
                    headers: { "content-type": "application/JSON" },
                  })
                    .then((response) => response.json())
                    .then((result) => {
                      if (result.status === "SUCCESS") {
                        let a = moment(result.data.start_Date).add(result.data.contract_Period, "years");

                        let b = moment(currentDate);

                        if (moment(a).isSameOrBefore(b)) {
                          history.push("/404");
                        } else {
                          history.push("/dashboard");
                        }
                      } else {
                        history.push("/505");
                      }
                    });
                })
                .catch((err) => console.error(err));
            })
            .catch((err) => console.error(err));
        }

        //complete submission
        setSubmitting(false);
      })
      .catch((err) => console.error(err));
  };
};

export const signupUser = (
  credentials,
  history,
  setFieldError,
  setSubmitting
) => {
  return (dispatch) => {
    fetch(`${currentUrl}api/tenant/signup`, {
      method: "POST",
      mode: "cors",
      body: JSON.stringify({
        name: credentials.name,
        email: credentials.email,
        password: credentials.password,
      }),
      headers: { "content-type": "application/JSON" },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "FAILED") {
          const { message } = result;

          //check for specific error
          if (message.includes("name")) {
            setFieldError("name", message);
          } else if (message.includes("email")) {
            setFieldError("email", message);
          } else if (message.includes("password")) {
            setFieldError("password", message);
          } else if (message.includes("confirmPassword")) {
            setFieldError("confirmPassword", message);
          }
        } else if (result.status === "SUCCESS") {
          //display message for email verification
          history.push(`/emailsent/${credentials.email}`);
        }
        //complete submission
        setSubmitting(false);
      })
      .catch((err) => console.error(err));
  };
};

export const logoutUser = (history) => {
  return () => {
    sessionService.deleteSession();
    sessionService.deleteUser();
    history.push("/");
  };
};

export const forgetpassword = (
  credentials,
  history,
  setFieldError,
  setSubmitting
) => {
  //make checks and get some data

  return () => {
    fetch(`${currentUrl}api/tenant/passwordresetrequest`, {
      method: "POST",
      body: JSON.stringify({ email: credentials.email, redirectUrl: credentials.redirectUrl }),
      headers: { "content-type": "application/JSON" },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "FAILED") {
          const { message } = result;

          //check for specific error
          if (
            message.includes("email")
          ) {
            setFieldError("email", message);
          }
        } else if (result.status === "PENDING") {
          const { email } = credentials;
          history.push(`/emailsent/${email}/${true}`);
        }

        //complete submission
        setSubmitting(false);
      })
      .catch((err) => console.error(err));
  };
};

export const resetPassword = (
  credentials,
  history,
  setFieldError,
  setSubmitting
) => {
  //make checks and get some data
  return () => {
    fetch(`${currentUrl}api/tenant/passwordreset`, {
      method: "POST",
      body: JSON.stringify({userID: credentials.userID, resetString: credentials.resetString, newPassword: credentials.newPassword }),
      headers: { "content-type": "application/JSON" },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "FAILED") {
          const { message } = result;

          //check for specific error
          if (message.includes("password")) {
            setFieldError("newPassword", message);
          }
        } else if (result.status === "SUCCESS") {
          history.push(`/emailsent`);
        }

        //complete submission
        setSubmitting(false);
      })
      .catch((err) => console.error(err));
  };
};
