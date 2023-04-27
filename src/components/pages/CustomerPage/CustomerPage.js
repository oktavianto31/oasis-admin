import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import TablePagination from "../../Pagination/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { connect } from "react-redux";
import TopBar from "../TopBar/TopBar";
import moment from "moment";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { ThreeDots } from "react-loader-spinner";
import { SocketContext } from "../../socketContext";
import "../TopBar/TopBar.css";
import "./CustomerPage.css";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import addedOrderSound from "../../sounds/order_added_sound.wav"
import waiterCalledSound from "../../sounds/waiter_called_sound.wav"

function CustomerPage({ tenant }) {
  const [page, setPage] = useState(0);
  const rowsPerPage = 7;
  const [index, setIndex] = useState(1);
  const orderUrl = process.env.REACT_APP_ORDERURL;
  const [orderData, setOrderData] = useState([]);
  const [orderRetrieved, setOrderRetrieved] = useState(false);

  let history = useHistory();

  // Get Order Data
  useEffect(() => {
    let mounted = true;

    if (mounted) {
      if (tenant.tenant_id != undefined) {
        const url = orderUrl + "/retrieve/" + tenant.tenant_id;

        fetch(url, {
          method: "GET",
          headers: { "content-type": "application/JSON" },
        })
          .then((response) => response.json())
          .then((result) => {
            if (result.status === "SUCCESS") {
              setOrderData([result.data]);
              setOrderRetrieved(() => true);
            } else {
              setOrderRetrieved(() => false);
            }
          });
      }
    }

    return () => {
      mounted = false;
    };
  }, [tenant, orderRetrieved]);

  // socket connection
  const socket = useContext(SocketContext);

  useEffect(() => {
    if (socket) {
      socket.off("add order").on("add order", (data) => handleOrderAdded(data));
      socket.off("add waiter call").on("add waiter call", (data) => handlCallTable(data));
      socket.off("update order").on("update order", (data) => handleOrderUpdated(data));
      socket.on("update user", (data) => handleUserUpdated(data));
    }
  });

  function handleOrderAdded(user) {
    let mounted = true;

    if (mounted) {
      if (tenant.tenant_id != undefined) {
        const url = orderUrl + "/retrieve/" + tenant.tenant_id;

        fetch(url, {
          method: "GET",
          headers: { "content-type": "application/JSON" },
        })
          .then((response) => response.json())
          .then((result) => {
            if (result.status === "SUCCESS") {
              new Audio(addedOrderSound).play();
              toast("Order Added", { style: { background: `${profileColor}`, color: "#fff", fontWeight: "600" }, progressClassName: "progressbar" });
     
               setOrderData([result.data]);
              setOrderRetrieved(() => true);
            } else {
              setOrderRetrieved(() => false);
            }
          });
      }
    }

    return () => {
      mounted = false;
    };
    // if (orderRetrieved) {
    //   let newData = orderData.splice();

    //   newData.push(user);
    //   setOrderData(newData);
    // }
  }

  function handlCallTable(user){
    new Audio(waiterCalledSound).play();
    toast.warning("Waiter Called", { style: { background: "#fcd232", color: "#fff", fontWeight: "600" }, progressClassName: "progressbar" });
           
  }

  function handleOrderUpdated(user){
    let mounted = true;

    if (mounted) {
      if (tenant.tenant_id != undefined) {
        const url = orderUrl + "/retrieve/" + tenant.tenant_id;

        fetch(url, {
          method: "GET",
          headers: { "content-type": "application/JSON" },
        })
          .then((response) => response.json())
          .then((result) => {
            if (result.status === "SUCCESS") {
              setOrderData([result.data]);
              setOrderRetrieved(() => true);
            } else {
              setOrderRetrieved(() => false);
            }
          });
      }
    }

    return () => {
      mounted = false;
    };
    // if (orderRetrieved) {
    //   let newData = orderData.splice();

    //   newData.push(user);
    //   setOrderData(newData);
    // }
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

  const localUrl = process.env.REACT_APP_TENANTURL;
  const [tenantData, setTenantData] = useState([]);
  const [tenantRetrieved, setTenantRetrieved] = useState(false);
  const [profileName, setProfileName] = useState();
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
        setProfileColor(tenantData[0].profileColor);
      }
    }
    return () => {
      mounted = false;
    };
  }, [tenantRetrieved, tenantData]);

  const generatePdf = () => {
    const doc = new jsPDF();
    const tableColumn = [
      "No",
      "Customer Name",
      "Customer Phonenumber",
      "Last Order Placed",
    ];
    const tableRows = [];
    orderData[0].map((post, index) => {
      const dateOptions = {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      };
      const ordertime = new Date(post.order_time);
      const OrderData = [
        index + 1,

        post.user_name,
        post.user_phonenumber,

        ordertime.toLocaleDateString("en-ID", dateOptions),
      ];
      // push each tickcet's info into a row
      tableRows.push(OrderData);
    });

    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    const date = Date();
    // we use a date string to generate our filename.
    const dateStr = date[0] + date[1] + date[2] + date[3] + date[4];
    // ticket title. and margin-top + margin-left
    doc.text(`${profileName} Customer Report.`, 14, 15);
    // we define the name of our PDF file.
    doc.save(`${profileName}_customerreport.pdf`);
  };

  function TablePaginationActions(props) {
    const { count, page, onPageChange } = props;

    const handleBackButtonClick = (event) => {
      onPageChange(event, page - 1);
      setIndex(index - 7);
    };

    const handleNextButtonClick = (event) => {
      onPageChange(event, page + 1);

      setIndex(index + 7);
    };

    return (
      <div className="containerbutton">
        <button
          onClick={handleBackButtonClick}
          disabled={page === 0}
          className={page === 0 ? "leftdisabledbutton" : "leftdisplaybutton"}
        >
          
          <FontAwesomeIcon
            icon={faAngleLeft}
            style={page === 0 ? { color: "#BEBEBE" } : { color: "#949494" }}
          />
        </button>

        <button
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / 7) - 1}
          className={
            page >= Math.ceil(count / 7) - 1
              ? "rightdisabledbutton"
              : "rightdisplaybutton"
          }
        >
          <FontAwesomeIcon
            icon={faAngleRight}
            style={
              page >= Math.ceil(count / 7) - 1
                ? { color: "#BEBEBE" }
                : { color: "#949494" }
            }
          />
        </button>
      </div>
    );
  }

  TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - orderData.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  return (
    <div className="container" style={{ zoom:"60%" }}>
      <div className="topbar">
        <div className="left" style={{ color: profileColor }}>
          Customer
        </div>

        <TopBar />
      </div>

      <div onClick={() => history.push("/orderstatus")}>
        <ToastContainer progressClassName="toastProgress" toastStyle={{ backgroundColor: `${profileColor}`, color: "#fff", fontWeight: "600" }} />
      </div>

      {orderRetrieved ? (
        <div className="customercontainer">
          <div className="outercustomertable">
            <div className="customertable">
              <div className="customerheader">
                <div className="customerleft" style={{ color: profileColor }}>
                  All Customer
                </div>
                <div className="customerright">
                  <button
                    className="downloadbutton"
                    style={{ borderColor: profileColor, color: profileColor }}
                    onClick={generatePdf}
                  >
                    Download as PDF
                  </button>
                </div>
              </div>
              <div className="customerheadertitlegrid">
                <div className="customerheadertitle">NO</div>
                <div className="customerheadertitle">NAME</div>
                <div className="customerheadertitle">PHONE NUMBER</div>
                <div className="customerheadertitle">LAST ORDER</div>
              </div>

              <div className="customerrendercontainer">
                {(rowsPerPage > 0
                  ? orderData[0].slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : orderData
                ).map((post, i) => {
                  const orderDate = new Date(post.order_time);

                  return (
                    <div className={i != 7 ? "bordered" : "noborder"}>
                      <div className="customerrendergrid">
                        <div className="customertext">{i + index}</div>
                        <div className="customertext">{post.user_name}</div>
                        <div className="customertext">
                          {post.user_phonenumber}
                        </div>
                        <div className="customertext">
                          {orderDate.toLocaleDateString("en-ID", dateOptions)} |
                          {moment(post.order_time).fromNow()}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="footer">
            <TablePagination
              colSpan={3}
              count={orderData[0].length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              ActionsComponent={TablePaginationActions}
            />
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

export default connect(mapStateToProps)(CustomerPage);
