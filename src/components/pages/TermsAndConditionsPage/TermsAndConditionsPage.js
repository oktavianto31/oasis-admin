import React, { useEffect, useState } from "react";
import TopBar from "../TopBar/TopBar";
import { connect } from "react-redux";
import "./TermsAndConditionsPage.css";
import TermsAndConditions from "./component/TermsAndConditions";
import PrivacyPolicy from "./component/PrivacyPolicy";

const TermsAndConditionsPage = ({ tenant }) => {
  const [btnType, setBtnType] = useState();
  const [profileColor, setProfileColor] = useState();
  const [tenantData, setTenantData] = useState([]);
  const [tenantRetrieved, setTenantRetrieved] = useState(false);

  const localUrl = process.env.REACT_APP_TENANTURL;

  useEffect(() => {
    // setBtnType("termandcondition");
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
    let mounted = true;

    if (mounted) {
      if (tenantRetrieved === true) {
        setProfileColor(tenantData[0].profileColor);
      }
    }
    return () => {
      mounted = false;
    };
  }, [tenantRetrieved, tenantData]);

  useEffect(() => {
    let mounted = true;

    if (mounted) {
      if (tenantRetrieved === true) {
        setProfileColor(tenantData[0].profileColor);
      }
    }
    return () => {
      mounted = false;
    };
  }, [tenantRetrieved, tenantData]);

  const handleTypeButton = (type) => {
    setBtnType(type);
  };
  return (
    <div className="container">
      <div className="topbar">
        <div className="left" style={{ color: profileColor }}>
          Terms And Conditions
        </div>

        <TopBar />
      </div>
      <div className="termsandconditionscontainer">
        <div className="containertypebutton">
          <button
            style={btnType == "termandcondition" ? { background: profileColor, color: "#fff", border: "1px solid #fff" } : { background: "#fff", border: `1px solid ${profileColor}`, color: profileColor }}
            onClick={() => handleTypeButton("termandcondition")}
            className="buttontypetof"
          >
            Syarat Dan Ketentuan
          </button>
          <button
            style={btnType == "privacypolicy" ? { background: profileColor, color: "#fff", border: "1px solid #fff" } : { background: "#fff", border: `1px solid ${profileColor}`, color: profileColor }}
            onClick={() => handleTypeButton("privacypolicy")}
            className="buttontypetof"
          >
            Kebijakan Privasi
          </button>
        </div>
        {btnType == "termandcondition" || btnType == undefined ? (
          <TermsAndConditions />
        ) : (
          <PrivacyPolicy />
        )}
      </div>

      <p>&nbsp;</p>
    </div>
  );
};

const mapStateToProps = ({ session }) => ({
  tenant: session.user,
});

export default connect(mapStateToProps)(TermsAndConditionsPage);
