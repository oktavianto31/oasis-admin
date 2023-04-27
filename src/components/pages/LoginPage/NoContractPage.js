import React, { useState, useEffect, useContext, useRef } from "react";
import { useHistory } from "react-router-dom";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { SocketContext } from "../../socketContext";
import emailjs from "@emailjs/browser";
import { logoutUser } from "../../Auth/actions/userActions";
import "../SettingsPage/SettingsPage.css";

function NoContractPage({ logoutUser, tenant }) {
  const form = useRef();
  const localUrl = process.env.REACT_APP_TENANTURL;
  const [tenantData, setTenantData] = useState([]);
  const [tenantRetrieved, setTenantRetrieved] = useState(false);
  let history = useHistory();
  // socket connection
  const socket = useContext(SocketContext);

  // Get Tenant Data
  useEffect(() => {
    let mounted = true;

    if (mounted) {
      if (tenant.tenant_id != undefined) {
        const url = localUrl + "/user/" + tenant.tenant_id;
        fetch(url, {
          method: "GET",
          headers: { "content-type": "application/JSON" },
        })
          .then((response) => response.json())
          .then((result) => {
            if (result.status === "SUCCESS") {

              setTenantData([result.data]);
              setTenantRetrieved(() => true);
            } else {
              setTenantRetrieved(() => false);
            }
          });
      }
    }
    return () => {
      mounted = false;
    };
  }, [tenant, tenantRetrieved]);

  useEffect(() => {
    if (socket) {
      socket.on("update user", (data) => handleUserUpdated(data));
    }
  });

  const [helpemail, setHelpEmail] = useState(false);
  const [color, setColor] = useState();
  const [profileName, setProfileName] = useState();
  const [profileColor, setProfileColor] = useState();
  const [profileEmail, setProfileEmail] = useState();
  const [helpMessage, setHelpMessage] = useState();

  useEffect(() => {
    let mounted = true;

    if (mounted) {
      if (tenantRetrieved === true) {
        setProfileName(tenantData[0].name);
        setProfileColor(tenantData[0].profileColor);
        setProfileEmail(tenantData[0].email);
      }
    }
    return () => {
      mounted = false;
    };
  }, [tenantRetrieved, tenantData]);

  function HandleSentEmail() {
    setHelpEmail(false);
    setEmailSendNotif(true);
    setTimeout(() => {
      setEmailSendNotif(false);
    }, 3000);

    setHelpMessage();

    emailjs.sendForm(
      process.env.REACT_APP_USER_ID,
      process.env.REACT_APP_TEMPLATE_ID,
      form.current,
      process.env.REACT_APP_PUBLIC_KEY
    );
  }

  return (
    tenantRetrieved && (
      <div className="backgroundcontainer">
        <div className="contractinnercontainer">
          <div className="return">
            <button
              className="contractbackbutton"
              onClick={() => logoutUser(history)}
            >
              <FontAwesomeIcon
                icon={faArrowLeft}
                style={{ marginRight: "10%" }}
              />
              Back
            </button>
          </div>

          <div className="containertitle" style={{ margin: "0px" }}>
            Waiting for Contract...
          </div>
          <div className="contracttext">
            Please contact Oasis One Admin for more information.
          </div>

          <Modal open={helpemail}>
            <Box className="helpbox">
              <div className="editprofileinnerbox">
                <div className="editprofilemodaltitle">Send Email</div>

                <form ref={form}>
                  <div className="helpinnermodalbox">
                    <div className="profileinputtext">
                      <div className="editprofileinputlabel">
                        Restaurant Name
                      </div>
                      <div className="inputtext">
                        <input
                          type="text"
                          name="from_name"
                          className="editprofileinputfile"
                          defaultValue={profileName}
                          onChange={(e) => setProfileName(e.target.value)}
                        />
                      </div>
                      <div className="editprofileinputlabel">Email address</div>
                      <div className="inputtext">
                        <input
                          type="email"
                          name="user_email"
                          className="editprofileinputfile"
                          defaultValue={profileEmail}
                          onChange={(e) => setProfileEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="editprofileinputlabel">Message</div>
                    <div className="inputtext">
                      <textarea
                        type="text"
                        name="message"
                        className="messageinput"
                        defaultValue={helpMessage}
                        onChange={(e) => setHelpMessage(e.target.value)}
                      />
                    </div>
                  </div>
                </form>
                <div className="editprofilemodalbutton">
                  <button
                    style={{ color: profileColor }}
                    onClick={() => setHelpEmail(false)}
                    className="cancelbutton"
                  >
                    Cancel
                  </button>

                  <button
                    style={{ background: profileColor }}
                    type="submit"
                    onClick={HandleSentEmail}
                    className="savebutton"
                  >
                    Send
                  </button>
                </div>
              </div>
            </Box>
          </Modal>

          <button
            style={{ background: "#424242", marginTop: "2%" }}
            onClick={() => setHelpEmail(true)}
            className="helpbutton"
          >
            <FontAwesomeIcon className="helpicons" icon={faEnvelope} />
            Email
          </button>
        </div>
      </div>
    )
  );
}

function mapStateToProps({ session }) {
  return { tenant: session.user };
}

export default connect(mapStateToProps, { logoutUser })(NoContractPage);
