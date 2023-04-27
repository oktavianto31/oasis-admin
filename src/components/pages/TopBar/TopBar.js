import React, { useState, useEffect, useContext } from "react";
import "./TopBar.css";
import { connect, useSelector } from "react-redux";
import { SocketContext } from "../../socketContext";

function TopBar({ tenant }) {
  const localUrl = process.env.REACT_APP_TENANTURL;

  const [tenantData, setTenantData] = useState([]);
  const [tenantRetrieved, setTenantRetrieved] = useState(false);
  const [profileName, setProfileName] = useState();
  const [profileImage, setProfileImage] = useState();
  const [profileColor, setProfileColor] = useState();

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

  // Socket Connection
  const socket = useContext(SocketContext);
  useEffect(() => {
    if (socket) {
      socket.on("update user", (data) => handleUserUpdated(data));
    }
  });

  function handleUserUpdated(user) {
    if (tenantRetrieved) {
      let newData = tenantData.slice();

      let i = tenantData.findIndex((u) => u.tenant_id === user.tenant_id);

      if (newData.length > i) {
        newData[i] = user;
      }

      setTenantData(newData);
    }
  }

  useEffect(() => {
    let mounted = true;
    
    if (mounted) {
      if (tenantRetrieved === true) {
        setProfileName(tenantData[0].name);
        setProfileImage(tenantData[0].profileImage);
        setProfileColor(tenantData[0].profileColor)
      }
    }
    return () => {
      mounted = false;
    };
  }, [tenantRetrieved, tenantData]);

  return (
    <div className="right">
      <div className="imagecontainer">
        <img src={profileImage + "?time" + new Date()} className="image" />
      </div>
      <div className="toptext" style={{ color: profileColor }}>
        {profileName}
      </div>
    </div>
  );
}

const mapStateToProps = ({ session }) => ({
  tenant: session.user,
});

export default connect(mapStateToProps)(TopBar);
