import React, { useState, useEffect, useContext } from "react";
import { useHistory, NavLink } from "react-router-dom";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import InsertChartOutlinedOutlinedIcon from "@mui/icons-material/InsertChartOutlinedOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";
import QrCodeOutlinedIcon from "@mui/icons-material/QrCodeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { connect } from "react-redux";
import { logoutUser } from "../Auth/actions/userActions";
import { SocketContext } from "../socketContext";
import "./SideBar.css";

function SideBar({ logoutUser, tenant }) {
  let history = useHistory();

  const localUrl = process.env.REACT_APP_TENANTURL;
  const socket = useContext(SocketContext);

  const [tenantData, setTenantData] = useState([]);
  const [tenantRetrieved, setTenantRetrieved] = useState(false);
  const [profileName, setProfileName] = useState(tenantData);
  const [profileColor, setProfileColor] = useState();

  const [openMenu, setOpenMenu] = useState(false);

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
    let mounted = true;

    if (mounted) {
      if (tenantRetrieved === true) {
        setProfileName(tenantData[0].name);
        setProfileColor(tenantData[0].profileColor);
      }
    }
    return () => {
      mounted = false;
    };
  }, [tenant, tenantRetrieved, tenantData]);

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

  return (
    tenantRetrieved &&
    tenantData && (
      <nav className="sidebar" style={{ background: profileColor }}>
        <div className="sidebar-container">
          <div className="sidebar-header">{profileName}</div>
          <ul className="side-menu">
            <li className="side-item">
              <NavLink to="/dashboard" activeClassName="is-active" className="side-links">
                <DashboardOutlinedIcon className="icons2" />
                <span style={{ color: "#fff" }}>Dashboard</span>
              </NavLink>
            </li>
            <li className="side-item menus">
              <div className="side-item">
                <div activeClassName="is-active" className="side-links multiple-links" onClick={() => setOpenMenu(!openMenu)}>
                  <div className="leftlinks">
                    <ShoppingCartOutlinedIcon className="icons2" />
                    <span style={{ color: "#fff" }}>Orders</span>
                  </div>
                  <div className="rightlinks">
                    <ArrowDropDownIcon className="icons2" />
                  </div>
                </div>
              </div>
            </li>
            <div className="sub-item-menu" style={openMenu ? { display: "block", transition: "ease-in-out" } : { display: "none" }}>
              <li className="side-item">
                <NavLink to="/orders" activeClassName="is-active" className="side-links-menu">
                  <span style={{ color: "#fff" }}>All Order</span>
                </NavLink>
              </li>
              <li className="side-item">
                <NavLink to="/transactiondashboard" activeClassName="is-active" className="side-links-menu">
                  <span style={{ color: "#fff" }}>Transaction Dashboard</span>
                </NavLink>
              </li>
            </div>
            <li className="side-item">
              <NavLink to="/orderstatus" activeClassName="is-active" className="side-links">
                <InsertChartOutlinedOutlinedIcon className="icons2" />
                <span style={{ color: "#fff" }}>Order Status Screen</span>
              </NavLink>
            </li>
            <li className="side-item">
              <NavLink to="/promo" activeClassName="is-active" className="side-links">
                <ImageOutlinedIcon className="icons2" />
                <span style={{ color: "#fff" }}>Promo Banner</span>
              </NavLink>
            </li>
            <li className="side-item">
              <NavLink to="/inventory" activeClassName="is-active" className="side-links">
                <Inventory2OutlinedIcon className="icons2" />
                <span style={{ color: "#fff" }}>Inventory</span>
              </NavLink>
            </li>
            <li className="side-item">
              <NavLink to="/tables" activeClassName="is-active" className="side-links">
                <TableChartOutlinedIcon className="icons2" />
                <span style={{ color: "#fff" }}>Tables</span>
              </NavLink>
            </li>
            <li className="side-item">
              <NavLink to="/qr" activeClassName="is-active" className="side-links">
                <QrCodeOutlinedIcon className="icons2" />
                <span style={{ color: "#fff" }}>Print QR Codes</span>
              </NavLink>
            </li>
            <li className="side-item">
              <NavLink to="/customer" activeClassName="is-active" className="side-links">
                <PeopleOutlinedIcon className="icons" />
                <span style={{ color: "#fff" }}>Customer</span>
              </NavLink>
            </li>
            <li className="side-item">
              <NavLink to="/settings" activeClassName="is-active" className="side-links">
                <SettingsOutlinedIcon className="icons2" />
                <span style={{ color: "#fff" }}>Settings</span>
              </NavLink>
            </li>
            <li className="side-item">
              <NavLink to="/termsandconditions" activeClassName="is-active" className="side-links">
                <InsertChartOutlinedOutlinedIcon className="icons2" />
                <span style={{ color: "#fff" }}>Terms And Conditions</span>
              </NavLink>
            </li>
            <li className="side-item">
              <NavLink to="#" className="side-links" onClick={() => logoutUser(history)}>
                <ExitToAppOutlinedIcon className="icons2" />
                <span style={{ color: "#fff" }}>Logout</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
    )
  );
}

const mapStateToProps = ({ session }) => ({
  tenant: session.user,
});

export default connect(mapStateToProps, { logoutUser })(SideBar);
