import React, { useState, useEffect, useContext } from "react";
import { connect } from "react-redux";
import QRCode from "qrcode.react";
import TopBar from "../TopBar/TopBar";
import { ThreeDots } from "react-loader-spinner";
import { SocketContext } from "../../socketContext";
import "../TopBar/TopBar.css";
import "./QrPage.css";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import addedOrderSound from "../../sounds/order_added_sound.wav"
import waiterCalledSound from "../../sounds/waiter_called_sound.wav"
import clipboardIcon from "../../icons/copy.png"

function QrPage({ tenant }) {
  const localUrl = process.env.REACT_APP_TENANTURL;
  const [tenantData, setTenantData] = useState([]);
  const [tenantRetrieved, setTenantRetrieved] = useState(false);
  const [qrCode, setQrCode] = useState();
  const [profileName, setProfileName] = useState();
  const [profileColor, setProfileColor] = useState();

  let history = useHistory();

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

  // socket connection
  const socket = useContext(SocketContext);

  useEffect(() => {
    if (socket) {
      socket.off("add order").on("add order", (data) => handleOrderAdded(data));
      socket.off("add waiter call").on("add waiter call", (data) => handlCallTable(data));
      socket.on("update user", (data) => handleUserUpdated(data));
    }
  });

  function handleOrderAdded(user){
    new Audio(addedOrderSound).play();
    toast("Order Added", { style: { background: `${profileColor}`, color: "#fff", fontWeight: "600" }, progressClassName: "progressbar" });
     
   }

  function handlCallTable(user){
    new Audio(waiterCalledSound).play();
    toast.warning("Waiter Called", { style: { background: "#fcd232", color: "#fff", fontWeight: "600" }, progressClassName: "progressbar" });
           
  }

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

  function notification(type){
    if(type === "added"){
      new Audio(addedOrderSound).play()
      toast("Order Added",{ style:{background:`${profileColor}`, color: "#fff", fontWeight: "600"},progressClassName: "progressbar" });
           
    }else if(type === "called"){
      new Audio(waiterCalledSound).play()
      toast.warning("Waiter Called", { style:{background:"#fcd232", color: "#fff", fontWeight: "600"} ,progressClassName: "progressbar" })
    }
  }

  useEffect(() => {
    let mounted = true;

    if (mounted) {
      if (tenantRetrieved === true) {
        setProfileName(tenantData[0].name);
        setProfileColor(tenantData[0].profileColor);
        setQrCode(tenantData[0].qrCode);
      }
    }
    return () => {
      mounted = false;
    };
  }, [tenant, tenantRetrieved]);

  function downloadQRCode() {
    const qrCodeURL = document
      .getElementById("qrCodeEl")
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    let aEl = document.createElement("a");
    aEl.href = qrCodeURL;
    aEl.download = tenantData[0].name + "qrcode.png";
    document.body.appendChild(aEl);
    aEl.click();
    document.body.removeChild(aEl);
  }

  if (tenantRetrieved) {
  }
  return (
    <div className="qrcontainer" style={{ zoom: "80%" }}>
      <div className="topbar">
        <div className="left" style={{ color: profileColor }}>
          Print QR Codes
        </div>

        <TopBar />
      </div>

      <div onClick={() => history.push("/orderstatus")}>
        <ToastContainer />
      </div>

      {tenantRetrieved ? (
        <div className="printqrsection">
          <div className="qrgrid">
            <div className="qrimage">
              <QRCode id="qrCodeEl" size={300} value={qrCode} />
              <div style={{ display: "flex", alignItems: "end", justifyContent: "center" }}>
                <div style={{ marginRight: "10px" }} className="tenantid">
                  {tenant.tenant_id}
                </div>
                <button style={{ backgroundColor: "transparent", border: "none", cursor: "pointer" }} onClick={() => navigator.clipboard.writeText(tenant.tenant_id)}>
                  <img src={clipboardIcon} height={22} />
                </button>
              </div>
            </div>
            <div className="qrsettings">
              <div className="downloadqr">
                <button style={{ background: profileColor }} className="downloadqrbutton" onClick={downloadQRCode}>
                  Download as PNG
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            height: "100vh",
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <ThreeDots color={profileColor} height={80} width={80} />
        </div>
      )}
    </div>
  );
}

const mapStateToProps = ({ session }) => ({
  tenant: session.user,
});

export default connect(mapStateToProps)(QrPage);
