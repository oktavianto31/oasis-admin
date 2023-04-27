import React, { useState, useEffect } from "react";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SideBar from "./components/Navbar/SideBar";
import Login from "./components/pages/LoginPage/ValidateLoginPage";
import Register from "./components/pages/LoginPage/RegisterPage";
import Forget from "./components/pages/LoginPage/ForgetPasswordPage";
import PasswordReset from "./components/pages/LoginPage/PasswordResetPage";
import EmailSent from "./components/pages/LoginPage/EmailSentPage";
import Dashboard from "./components/pages/DashboardPage/DashboardPage";
import Order from "./components/pages/OrderPage/OrderPage";
import OrderStatus from "./components/pages/OrderStatusPage/OrderStatusPage";
import Promo from "./components/pages/PromoPage/PromoPage";
import Inventory from "./components/pages/InventoryPage/InventoryPage";
import Tables from "./components/pages/TablesPage/TablesPage";
import Qr from "./components/pages/QrPage/QrPage";
import Customer from "./components/pages/CustomerPage/CustomerPage";
import Settings from "./components/pages/SettingsPage/SettingsPage";
import TermsAndConditions from "./components/pages/TermsAndConditionsPage/TermsAndConditionsPage";
import PrintPage from "./components/pages/PrintPage/PrintPage";
import TransactionDashboard from "./components/pages/TransactionDashboard/TransactionDashboard";
import MissingRoute from "./components/pages/MissingRoute";
import RenewContract from "./components/pages/LoginPage/RenewContractPage";
import NoContract from "./components/pages/LoginPage/NoContractPage";
import AuthRoute from "./components/Auth/routes/AuthRoute";
import BasicRoute from "./components/Auth/routes/BasicRoute";
import { connect } from "react-redux";
import { io } from "socket.io-client";
import { SocketContext } from "./components/socketContext";

import "./App.css";
import { display } from "@mui/system";

function App({ checked, tenant }) {
  {
    process.env.NODE_ENV === "development" ? process.env.REACT_APP_DEV_MODE : process.env.REACT_APP_PRO_MODE;
  }

  // Socket
  const [socket, setSocket] = useState("");
  const [socketRetrieved, setSocketRetrieved] = useState(false);
  const [online, setOnline] = useState(0);

  const [checkedBox, setCheckedBox] = useState(false);

  let peopleOnline = online - 1;
  let onlineText = "";

  if (peopleOnline < 1) {
    onlineText = "No one else is online";
  } else {
    onlineText = peopleOnline > 1 ? `${online - 1} people are online` : `${online - 1} person is online`;
  }

  useEffect(() => {
    if (socket) {
      socket.on("visitor enters", (data) => setOnline(data));
      socket.on("visitor exits", (data) => setOnline(data));
      socket.emit("joinRoom", tenant.tenant_id);
    }
  });

  useEffect(() => {
    if (tenant.tenant_id != undefined) {
      const newSocket = io(
        "https://backend.oasis-one.com",
        { transports: ["polling"] },

        {
          query: {
            tenant_id: tenant.tenant_id,
          },
        }
      );

      setSocket(newSocket);
      setSocketRetrieved(true);

      return () => newSocket.close();
    }
  }, [tenant, socketRetrieved]);

  return (
    <SocketContext.Provider value={socket}>
      <Router>
        {checked && (
          <div className="app">
            <Switch>
              <Route exact path="/" component={Login} />
              <AuthRoute exact path="/404" component={RenewContract} />
              <AuthRoute exact path="/505" component={NoContract} />

              <BasicRoute exact path="/login/:userEmail?" component={Login} />

              <BasicRoute exact path="/emailsent/:userEmail?/:reset?" component={EmailSent} />

              <BasicRoute exact path="/passwordreset/:userID/:resetString" component={PasswordReset} />
              <BasicRoute exact path="/register" component={Register} />
              <BasicRoute exact path="/forgetpassword" component={Forget} />

              <div class="box">
                {/* <label> */}

                <button
                  className="input"
                  // style={{ background: "#000" }}
                  onClick={() => {
                    setCheckedBox(!checkedBox);
                  }}
                />

                <div className="toggle">
                  <span style={checkedBox ? { left: "2px", top: "11px", width: "19px", transform: "rotate(45deg)" } : {}} className="top_line common"></span>
                  <span style={checkedBox ? { opacity: "0", transform: "translateX(20px)" } : {}} className="middle_line common"></span>
                  <span style={checkedBox ? { left: "2px", top: "11px", width: "19px", transform: "rotate(-45deg)" } : {}} className="bottom_line common"></span>
                </div>
                <div class="column" style={checkedBox ? { display: "block" } : { display: "none" }}>
                  <SideBar />
                </div>
                {/* </label> */}
                <div class="column2">
                  <AuthRoute exact path="/dashboard" component={Dashboard} />
                  <AuthRoute path="/orders" exact component={Order} />
                  <AuthRoute path="/orderstatus" exact component={OrderStatus} />
                  <AuthRoute path="/promo" exact component={Promo} />
                  <AuthRoute path="/inventory" exact component={Inventory} />
                  <AuthRoute path="/tables" exact component={Tables} />
                  <AuthRoute path="/qr" exact component={Qr} />
                  <AuthRoute path="/customer" exact component={Customer} />
                  <AuthRoute path="/settings" exact component={Settings} />
                  <AuthRoute path="/termsandconditions" exact component={TermsAndConditions} />
                  <AuthRoute path="/printreceipt" component={PrintPage} />
                  <AuthRoute path="/transactiondashboard" component={TransactionDashboard} />
                </div>
                <div className="column"></div>
              </div>

              <Route path="*" component={MissingRoute} />
            </Switch>
          </div>
        )}
      </Router>
    </SocketContext.Provider>
  );
}

function mapStateToProps({ session }) {
  return {
    checked: session.checked,
    tenant: session.user,
  };
}

export default connect(mapStateToProps)(App);
