import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import TablePagination from "../../Pagination/index";
import Customer from "../../icons/Customer.png";
import Waitercall from "../../icons/waitercall.svg";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleRight,
  faAngleLeft,
  faXmark,
  faRightLong,
} from "@fortawesome/free-solid-svg-icons";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import NumberFormat from "react-number-format";
import recommended from "../../icons/Recommend.png";
import { connect } from "react-redux";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import ExpandMoreRoundedIcon from "@material-ui/icons/ExpandMoreRounded";
import { useOutlineSelectStyles } from "./select/index";
import TopBar from "../TopBar/TopBar";
import { ThreeDots } from "react-loader-spinner";
import { SocketContext } from "../../socketContext";
import { debounce } from "lodash";
import "../TopBar/TopBar.css";
import "./TablesPage.css";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import addedOrderSound from "../../sounds/order_added_sound.wav"
import waiterCalledSound from "../../sounds/waiter_called_sound.wav"

function TablesPage({ tenant }) {
  const tableUrl = process.env.REACT_APP_TABLEURL;
  const [tableData, setTableData] = useState([]);
  const [tableRetrieved, setTableRetrieved] = useState(false);

  let history = useHistory();

  // socket connection
  const socket = useContext(SocketContext);

  // Get Table Data
  useEffect(() => {
    let mounted = true;

    if (mounted) {
      if (tenant.tenant_id != undefined) {
        const url = tableUrl + "/" + tenant.tenant_id;

        fetch(url, {
          method: "GET",
          headers: { "content-type": "application/JSON" },
        })
          .then((response) => response.json())
          .then((result) => {
            if (result.status === "SUCCESS") {           
              setTableData([result.data]);
              setTableRetrieved(() => true);
            } else {
              setTableRetrieved(() => false);
            }
          });
      }
    }

    return () => {
      mounted = false;
    };
  }, [tenant, tableRetrieved]);

  useEffect(() => {
    if (socket) {
      socket.on("add table", (data) => handleTableAdded(data));
      socket.off("add order").on("add order", (data) => handleOrderAdded(data));
      socket.on("delete table", (data) => handleDeleteTable(data));
      socket.on("remove table", (data) => handleRemoveTable(data));
      socket.on("duplicate table", (data) => handleDuplicateTable(data));
      socket.off("add waiter call").on("add waiter call", (data) => handlCallTable(data));
      socket.on("remove waiter call", (data) => handlCallTable(data));
      socket.on("update user", (data) => handleUserUpdated(data));
    }
  });

  function handleTableAdded(user) {
    if (tableRetrieved) {
      let newData = tableData.splice();

      newData.push(user);
      setTableData(newData);
    }
  }

  function handleOrderAdded() {
    if (tableRetrieved) {
      const url = tableUrl + "/" + tenant.tenant_id;

      fetch(url, {
        method: "GET",
        headers: { "content-type": "application/JSON" },
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.status === "SUCCESS") {
            new Audio(addedOrderSound).play();
            toast("Order Added", { style: { background: `${profileColor}`, color: "#fff", fontWeight: "600" }, progressClassName: "progressbar" });
     
             setTableData([result.data]);
            setTableRetrieved(() => true);
          } else {
            setTableRetrieved(() => false);
          }
        });
    }
  }

  function handleDeleteTable(user) {
    if (tableRetrieved) {
      let newData = tableData.splice();

      newData.push(user);
      setTableData(newData);
    }
  }

  function handleRemoveTable(user) {
    if (tableRetrieved) {
      let newData = tableData.splice();

      newData.push(user);
      setTableData(newData);
    }
  }

  function handleDuplicateTable(user) {
    if (tableRetrieved) {
      let newData = tableData.splice();

      newData.push(user);
      setTableData(newData);
    }
  }

  function handlCallTable(user) {
    const url = tableUrl + "/" + tenant.tenant_id;

    fetch(url, {
      method: "GET",
      headers: { "content-type": "application/JSON" },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "SUCCESS") {
           new Audio(waiterCalledSound).play();
           toast.warning("Waiter Called", { style: { background: "#fcd232", color: "#fff", fontWeight: "600" }, progressClassName: "progressbar" });
           
          setTableData([result.data]);
          setTableRetrieved(() => true);
        } else {
          setTableRetrieved(() => false);
        }
      });
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

  const orderUrl = process.env.REACT_APP_ORDERURL;
  const [tableOrderData, setTableOrderData] = useState([]);
  const [tableOrderRetrieved, setTableOrderRetrieved] = useState(false);
  const waiterUrl = process.env.REACT_APP_WAITERURL;
  const [waiterData, setWaiterData] = useState([]);
  const [waiterDataRetrieved, setWaiterDataRetrieved] = useState(false);

  const [tableOrderOpen, setTableOrderOpen] = useState(false);
  const [tableNoOrderOpen, setTableNoOrderOpen] = useState(false);
  const [duplicatetableOpen, setDuplicateTableOpen] = useState(false);
  const [tableWaiterOpen, setTableWaiterOpen] = useState(false);
  const [removetableOpen, setRemoveTableOpen] = useState(false);

  const [tableid, setTableID] = useState("");
  const [customername, setCustomerName] = useState("");
  const [customerphone, setCustomerPhone] = useState("");
  const [waiterinstruction, setWaiterInstruction] = useState("");

  //select drop down
  const outlineSelectClasses = useOutlineSelectStyles();

  // moves the menu below the select input
  const menuProps = {
    classes: {
      paper: outlineSelectClasses.paper,
      list: outlineSelectClasses.list,
    },
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left",
    },
    transformOrigin: {
      vertical: "top",
      horizontal: "left",
    },
    getContentAnchorEl: null,
  };

  const iconComponent = (props) => {
    return (
      <ExpandMoreRoundedIcon
        // style={{color:profileColor}}
        className={props.className + " " + outlineSelectClasses.icon}
      />
    );
  };

  const [startval, setStartVal] = useState();
  const [endval, setEndVal] = useState();
  const [tableIndex, setTableIndex] = useState();
  const [removeval, setRemoveVal] = useState();

  const [edittable, setEditTable] = useState(false);

  async function handlePassinginfo(id) {
    const url = orderUrl + "/table/retrieve/" + tenant.tenant_id;
    const payload = JSON.stringify({
      // order_id: id,
      order_table: id,
    });
    await fetch(url, {
      method: "POST",
      body: payload,
      headers: { "content-type": "application/JSON" },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "SUCCESS") {
          // const tableOrderData = result.data
          // const newTableOrderData = tableOrderData.filter(e => e.order_status < 5)
          setTableOrderData([result.data]);
          setTableOrderRetrieved(() => true);
        } else {
          setTableOrderRetrieved(() => false);
        }
      });
  }

  async function handlepasswaiterinfo(table) {
    const url = waiterUrl + "/retrieve/" + tenant.tenant_id;
    const payload = JSON.stringify({
      order_table: table,
    });
    await fetch(url, {
      method: "POST",
      body: payload,
      headers: { "content-type": "application/JSON" },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "SUCCESS") {
          setWaiterData([result.data]);
          setWaiterDataRetrieved(() => true);
        } else {
          setWaiterDataRetrieved(() => false);
        }
      });
  }

  async function handleCloseWaiter(table) {
    setTableIndex();
    const url = waiterUrl + "/remove/" + tenant.tenant_id;
    const payload = JSON.stringify({
      order_table: table,
    });
    await fetch(url, {
      method: "POST",
      body: payload,
      headers: { "content-type": "application/JSON" },
    })
      .then((response) => response.json())
      .then((result) => {
        if (socket) {
          socket.emit("remove waiter call", result.data);
          setTableData([result.data]);
        }
      });
  }

  const handleaddtable = debounce(async () => {
    setAddTableNotif(true);
    setTimeout(() => {
      setAddTableNotif(false);
    }, 3000);

    const url = tableUrl + "/create/" + tenant.tenant_id;
    await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/JSON" },
    })
      .then((response) => response.json())
      .then((result) => {
        if (socket) {
          socket.emit("add table", result.data);
          setTableData([result.data]);
        }
      });
  }, 500);

  function handleedittable() {
    setEditTable(true);
  }

  function handlesavetable() {
    setTableSavedNotif(true);
    setTimeout(() => {
      setTableSavedNotif(false);
    }, 3000);
    setEditTable(false);
  }

  const [deletetabletext, setDeleteTableText] = useState();
  async function handledeletetable(a, b) {
    setRemoveTableNotif(true);
    setDeleteTableText(a);
    setTimeout(() => {
      setRemoveTableNotif(false);
    }, 3000);

    const url = tableUrl + "/remove/" + tenant.tenant_id;
    const payload = JSON.stringify({
      table_id: b,
    });

    fetch(url, {
      method: "POST",
      body: payload,
      headers: { "content-type": "application/JSON" },
    })
      .then((response) => response.json())
      .then((result) => {
        if (socket) {
          socket.emit("delete table", result.data);
          setTableData([result.data]);
        }
      });
  }

  async function handleduplicatetable() {
    setDuplicateTableOpen(false);

    const url = tableUrl + "/duplicate/" + tenant.tenant_id;
    const payload = JSON.stringify({
      or_table: startval,
      de_table: endval,
    });

    fetch(url, {
      method: "POST",
      body: payload,
      headers: { "content-type": "application/JSON" },
    })
      .then((response) => response.json())
      .then((result) => {
        if (socket) {
          setStartVal();
          setEndVal();
          socket.emit("duplicate table", result.data);
          setTableData([result.data]);
        }
      });
  }

  async function handleRemoveTableContent() {
    setRemoveTableOpen(false);

    {
      tableRetrieved == true &&
        tableData.map((post) => {
          return post.map((posts, index) => {
            if (posts.table.id == removeval) {
              const url = tableUrl + "/remove/content/" + tenant.tenant_id;
              const payload = JSON.stringify({
                table_id: removeval,
                order_table: posts.table.id,
              });
              fetch(url, {
                method: "POST",
                body: payload,
                headers: { "content-type": "application/JSON" },
              })
                .then((response) => response.json())
                .then((result) => {
                  if (socket) {
                    setRemoveVal();
                    setTableIndex();
                    socket.emit("remove table", result.data);
                    setTableData([result.data]);
                  }
                });
            }
          });
        });
    }
  }

  const [addtablenotif, setAddTableNotif] = useState(false);
  const [removetablenotif, setRemoveTableNotif] = useState(false);
  const [tablecallnotif, setTableCallNotif] = useState(false);
  const [tablesavednotif, setTableSavedNotif] = useState(false);

  function handlenotification() {
    if (
      addtablenotif ||
      removetablenotif ||
      tablecallnotif ||
      tablesavednotif
    ) {
      setAddTableNotif(false);
      setRemoveTableNotif(false);
      setTableCallNotif(false);
      setTableSavedNotif(false);
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

  const [page, setPage] = useState(0);
  const rowsPerPage = 1;
  const [index, setIndex] = useState(1);

  function TablePaginationActions(props) {
    const { count, page, onPageChange } = props;

    const handleBackButtonClick = (event) => {
      onPageChange(event, page - 1);
      setIndex(index - 1);
    };

    const handleNextButtonClick = (event) => {
      onPageChange(event, page + 1);

      setIndex(index + 1);
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
          disabled={page >= Math.ceil(count / 1) - 1}
          className={
            page >= Math.ceil(count / 1) - 1
              ? "rightdisabledbutton"
              : "rightdisplaybutton"
          }
        >
          <FontAwesomeIcon
            icon={faAngleRight}
            style={
              page >= Math.ceil(count / 1) - 1
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <div className="container">
      <div className="topbar">
        <div className="left" style={{ color: profileColor }}>
          Tables
        </div>

        <TopBar />
      </div>

      <div onClick={() => history.push("/orderstatus")}>
        <ToastContainer/>
      </div>

      <Modal open={tableOrderOpen}>
        <Box className="ordermodalbox">
          <>
            {tableOrderRetrieved == true &&
              (rowsPerPage > 0 
                ? tableOrderData.map((item) => {
                    return item.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    );
                  })
                : tableOrderData
              ).map((item) => {
                return item.map((post, index) => {
                  const ordertime = new Date(post.order_time);
                  const dateOptions = {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  };
                  return (
                    <div className="orderwrapper">
                      <div className="modalclose">
                        <button
                          className="modalclosebutton"
                          onClick={() => {
                            setTableOrderOpen(false)
                            setPage(0)
                            }
                          }
                        >
                          <FontAwesomeIcon
                            className="closebuttonicon"
                            style={{ color: profileColor }}
                            icon={faCircleXmark}
                          />
                        </button>
                      </div>

                      <div className="innermodalbox">
                        <div
                          className="ordermodaltitle"
                          style={{ color: profileColor }}
                        >
                          {tenant.name}
                        </div>
                        <div className="ordermodalsubtitle">
                          <div className="ordermodaldate">
                            <div className="ordertime">
                              <CalendarTodayOutlinedIcon
                                fontSize="small"
                                className="timeicon"
                              />
                              {ordertime.toLocaleTimeString("en-US")}
                              <span className="space">/</span>
                              <span
                                className="orderdate"
                                style={{ color: profileColor }}
                              >
                                {ordertime.toLocaleDateString(
                                  "en-ID",
                                  dateOptions
                                )}
                              </span>
                            </div>
                          </div>

                          <div className="ordermodalstatus">
                            <div className="statustext">STATUS</div>
                            <div className="statuscoloredtext">
                              {post.order_status == 1 ? (
                                <div className="pending">PENDING</div>
                              ) : post.order_status == 2 ? (
                                <div className="orderplaced">ORDER PLACED</div>
                              ) : post.order_status == 3 ? (
                                <div className="served">SERVED</div>
                              ) : post.order_status == 4 ? (
                                <div className="payment">PAYMENT</div>
                              ) : post.order_status == 5 ? (
                                <div className="complete">COMPLETE</div>
                              ) : post.order_status == 6 ? (
                                <div className="rejected">REJECTED</div>
                              ) : null}
                            </div>
                          </div>
                        </div>
                        <div>
                          <p className="orderidtext">order id : {post.order_id}</p>
                        </div>
                        <div className="contentwrapper">
                        <div className="ordermodalitems">
                          <div className="ordermodalform">
                            <div className="ordermodalinputlabel">
                              Name <span style={{ color: "#E52C32" }}>*</span>
                            </div>
                            <input
                              type="text"
                              value={post.user_name}
                              className="ordermodalinputfile"
                            />
                            <div className="ordermodalinputlabel">
                              Phone Number
                              <span style={{ color: "#E52C32" }}>*</span>
                            </div>
                            <input
                              type="text"
                              value={post.user_phonenumber}
                              className="ordermodalinputfile"
                            />
                            <div className="ordermodalinputlabel">
                              Special Instructions
                            </div>
                            <input
                              type="text"
                              value={post.order_instruction}
                              className="ordermodalinputfile"
                            />
                            <div className="ordermodalinputlabel">Table</div>
                            {tableRetrieved &&
                              tableData.map((item) => {
                                return item.map((posts, index) => {
                                  if (posts.table.id == post.order_table) {
                                    return (
                                      <span>
                                        <input
                                          type="text"
                                          className="ordermodalinputfile"
                                          value={posts.table.index}
                                        />
                                      </span>
                                    );
                                  }
                                });
                              })}

                            <div className="ordermodalinputlabel">Guest</div>
                            <input
                              type="text"
                              value={post.user_guest}
                              className="ordermodalinputfile"
                            />
                          </div>
                        </div>
                        <div className="ordermenuitemcontainer">
                            <div className="ordermenutitle">Order Items</div>
                            <div className="ordermenuitem">
                              {post.order_menu.map((posts, index) => (
                                <div className="ordermenucontainer">
                                  <div className="ordermenuimagecontainer">
                                    <img
                                      src={posts.menuImage}
                                      className="menuimage"
                                    />
                                  </div>
                                  <div className="orderdetailsmenutext">
                                    <div className="orderdetailsmenutitle">
                                      {posts.name}
                                    </div>
                                    <div className="recommended">
                                      {posts.isRecommended === true ? (
                                        <img src={recommended} />
                                      ) : (
                                        "null"
                                      )}
                                    </div>
                                    <div className="orderdetailmenuprice">
                                      <NumberFormat
                                        value={posts.price}
                                        prefix="Rp. "
                                        decimalSeparator="."
                                        thousandSeparator=","
                                        displayType="text"
                                      />
                                      <div className="orderquantity">
                                        Qty:
                                        <span className="orderquantitytext">
                                          {posts.orderQuantity ? posts.orderQuantity : posts.orderQty}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="ordertotalsummary">
                              <div className="ordertotalitems">
                                <div className="lefttext">Items:</div>
                                <div className="righttext">
                                  {post.order_menu.length}
                                </div>
                              </div>

                              <div className="ordertotalitems">
                                <div className="lefttext">Subtotal:</div>
                                <div className="righttext">
                                  <NumberFormat
                                    value={post.order_total}
                                    prefix="Rp. "
                                    decimalSeparator="."
                                    thousandSeparator=","
                                    displayType="text"
                                  />
                                </div>
                              </div>

                              <div className="ordertotalitems">
                                <div className="lefttext">Service Charge:</div>
                                <div className="righttext">
                                  <NumberFormat
                                    value={post.order_servicecharge}
                                    prefix="Rp. "
                                    decimalSeparator="."
                                    thousandSeparator=","
                                    displayType="text"
                                  />
                                </div>
                              </div>

                              <div className="ordertotalitems-n">
                                <div className="lefttext">Tax(%):</div>
                                <div className="righttext">
                                  <NumberFormat
                                    value={post.order_taxcharge}
                                    prefix="Rp. "
                                    decimalSeparator="."
                                    thousandSeparator=","
                                    displayType="text"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>  
                      </div>
                    </div>
                  );
                });
              })}
            {tableOrderRetrieved && tableOrderData[0].length > 1 ? (
              <div className="tablepaginationfooter">
                <TablePagination
                  colSpan={3}
                  count={tableOrderRetrieved ? tableOrderData[0].length : 0}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  ActionsComponent={TablePaginationActions}
                />
              </div>
            ) : null}
          </>
        </Box>
      </Modal>

      <Modal open={tableNoOrderOpen}>
        <Box className="noordermodalbox">
          <>
            <div className="modalclose">
              <button
                className="modalclosebutton"
                onClick={() => {
                  setTableNoOrderOpen(false)
                  setPage(0)
                  }
                }
              >
                <FontAwesomeIcon
                  className="closebuttonicon"
                  icon={faCircleXmark}
                />
              </button>
            </div>
            <div className="noinnermodalbox">
              <div className="noordertext">No orders has been made.</div>
            </div>
          </>
        </Box>
      </Modal>

      <Modal open={tableWaiterOpen}>
        <Box className="tablewaitermodalbox">
          {waiterDataRetrieved === true &&
            waiterData[0].map((post, index) => {
              return (
                <>
                  <div className="modalclose">
                    <button
                      className="modalclosebutton"
                      onClick={() => {
                        setTableWaiterOpen(false);
                        setTableIndex();
                      }}
                    >
                      <FontAwesomeIcon
                        className="closebuttonicon"
                        icon={faCircleXmark}
                      />
                    </button>
                  </div>
                  <div className="tablewaitermodaltitle">T{tableIndex}</div>
                  <div className="sideattributes">
                    <div className="sidetexts">
                      <div className="modaltexts">Name</div>
                      <div className="modaltexts">Phone Number</div>
                      <div className="modaltexts">Number of Guess</div>
                    </div>
                    <div className="sidetexts">
                      <div className="modaltexts">:</div>
                      <div className="modaltexts">:</div>
                      <div className="modaltexts">:</div>
                    </div>
                    <div className="sidetexts">
                      <div className="boldmodaltexts">
                        {post.waiter.user_name}
                      </div>
                      <div className="boldmodaltexts">
                        {post.waiter.user_phonenumber}
                      </div>
                      <div className="boldmodaltexts">
                        {post.waiter.user_guest}
                      </div>
                    </div>
                  </div>

                  <div className="tablewaitercontainer">
                    <div className="modaltexts">
                      Special Instructions (optional)
                    </div>
                    <div className="waitertextinput">
                      <textarea
                        type="text"
                        value={post.waiter.order_instruction}
                        className="waiterdetailinput"
                      />
                    </div>
                  </div>

                  <div className="waiterbuttoncontainer">
                    <button
                      className="waiterconfirmbutton"
                      onClick={() => {
                        setTableWaiterOpen(false);
                        handleCloseWaiter(post.waiter.order_table);
                        setTableIndex();
                      }}
                    >
                      Proceed
                    </button>
                  </div>
                </>
              );
            })}
        </Box>
      </Modal>

      <Modal open={duplicatetableOpen}>
        <Box className="duplicatetablemodalbox">
          <div className="duplicateinnerbox">
            <div
              className="duplicatetablemodaltitle"
              style={{ color: profileColor }}
            >
              Duplicate Table
            </div>
            <div className="duplicatetabletext">Select the table</div>
            <div className="tableselectorcontainer">
              <div className="tableselector1">
                <Select
                  defaultValue=""
                  disableUnderline
                  classes={{ root: outlineSelectClasses.select }}
                  MenuProps={menuProps}
                  IconComponent={iconComponent}
                  value={startval}
                  onChange={(e) => setStartVal(e.target.value)}
                >
                  {tableRetrieved == true &&
                    tableData.map((post) => {
                      return post.map((posts, index) => {
                        if (
                          posts.table.id != endval &&
                          posts.table.status !== "EMPTY"
                        ) {
                          return (
                            <MenuItem value={posts.table.id}>
                              T{posts.table.index}
                            </MenuItem>
                          );
                        }
                      });
                    })}
                </Select>
              </div>
              <div
                style={{
                  color: "#424242",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <FontAwesomeIcon
                  icon={faRightLong}
                  style={{ color: "#f10c0c" }}
                />
              </div>
              <div className="tableselector2">
                <Select
                  defaultValue=""
                  disableUnderline
                  classes={{ root: outlineSelectClasses.select }}
                  MenuProps={menuProps}
                  IconComponent={iconComponent}
                  value={endval}
                  onChange={(e) => setEndVal(e.target.value)}
                >
                  {tableRetrieved == true &&
                    tableData.map((post) => {
                      return post.map((posts, index) => {
                        if (
                          posts.table.id != startval &&
                          posts.table.status !== "FILLED"
                        ) {
                          return (
                            <MenuItem value={posts.table.id}>
                              T{posts.table.index}
                            </MenuItem>
                          );
                        }
                      });
                    })}
                </Select>
              </div>
            </div>
            <div className="modalbuttoncontainer">
              <div>
                <button
                  className="modalcancelbutton"
                  onClick={() => {
                    setDuplicateTableOpen(false);
                    setStartVal();
                    setEndVal();
                  }}
                >
                  Cancel
                </button>
              </div>
              <div>
                <button
                  style={{ background: profileColor }}
                  className="modalconfirmbutton"
                  onClick={handleduplicatetable}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </Box>
      </Modal>

      <Modal open={removetableOpen}>
        <Box className="duplicatetablemodalbox">
          <div className="duplicateinnerbox">
            <div
              className="duplicatetablemodaltitle"
              style={{ color: profileColor }}
            >
              Remove Table Content
            </div>
            <div className="duplicatetabletext">Select the table</div>
            <div className="tableselectorcontainer">
              <div className="tableselector1">
                <Select
                  defaultValue=""
                  disableUnderline
                  classes={{ root: outlineSelectClasses.select }}
                  MenuProps={menuProps}
                  IconComponent={iconComponent}
                  value={removeval}
                  onChange={(e) => setRemoveVal(e.target.value)}
                >
                  {tableRetrieved == true &&
                    tableData.map((post) => {
                      return post.map((posts, index) => {
                        if (posts.table.status == "FILLED") {
                          return (
                            <MenuItem value={posts.table.id}>
                              T{posts.table.index}
                            </MenuItem>
                          );
                        }
                      });
                    })}
                </Select>
              </div>
            </div>
            <div className="modalbuttoncontainer">
              <div>
                <button
                  className="modalcancelbutton"
                  onClick={() => {
                    setRemoveTableOpen(false);
                    setRemoveVal();
                  }}
                >
                  Cancel
                </button>
              </div>
              <div>
                <button
                  style={{ background: profileColor }}
                  className="modalconfirmbutton"
                  onClick={handleRemoveTableContent}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </Box>
      </Modal>

      {tableRetrieved && tenantRetrieved ? (
        <div className="tablescontainer">
          <div
            style={{ background: profileColor }}
            className={
              addtablenotif ||
              removetablenotif ||
              tablecallnotif ||
              tablesavednotif
                ? "tablesnotification"
                : "hidden"
            }
          >
            <div className="notificationtextcontainer">
              <div className="notificationtext">
                {addtablenotif
                  ? "New table has been added"
                  : removetablenotif
                  ? "Table " + deletetabletext + " has been removed"
                  : tablecallnotif
                  ? "Table No. is calling"
                  : tablesavednotif
                  ? "Table edit has been saved"
                  : null}
              </div>
            </div>

            <div className="notificationclose">
              <button className="notifclosebutton" onClick={handlenotification}>
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
          </div>
          <div className="tablecontainergrid">
            {tableRetrieved == true &&
              tableData.map((post) => {
                return post.map((posts, index) => {
                  if (posts.table.status == "EMPTY") {
                    return (
                      <div className="innergrid">
                        <div className="emptygrid">
                          <div className={edittable ? "emptytable" : "null"}>
                            <button
                              style={{ color: profileColor }}
                              className="deletetablebutton"
                              type="button"
                              onClick={() =>
                                handledeletetable(
                                  posts.table.index,
                                  posts.table.id
                                )
                              }
                            >
                              Delete
                            </button>
                          </div>
                          <button className="tabledetails">
                            <div className="tablenumberempty">
                              T{posts.table.index}
                            </div>
                            <div className="emptycenter">
                              <div className="tableempty">Empty</div>
                            </div>
                          </button>
                        </div>
                      </div>
                    );
                  }
                  if (posts.table.status == "FILLED") {
                    // Time
                    const orderTime = new Date(posts.table.timeStart);
                    const timeOptions = {
                      hour: "2-digit",
                      minute: "2-digit",
                    };

                    return (
                      <div className="innergrid">
                        <button
                          style={
                            posts.table.isWaiterCalled
                              ? null
                              : { background: profileColor }
                          }
                          className={
                            posts.table.isWaiterCalled
                              ? "tablewaiteractive"
                              : "tabledetailsactive"
                          }
                          onClick={
                            posts.table.isWaiterCalled
                              ? () => {
                                  handlepasswaiterinfo(posts.table.id);
                                  setTableWaiterOpen(true);
                                  setTableIndex(posts.table.index);
                                }
                              : posts.table.order_id == "NULL"
                              ? () => setTableNoOrderOpen(true)
                              : () => {
                                  handlePassinginfo(posts.table.id);
                                  setTableOrderOpen(true);
                                }
                          }
                        >
                          <div
                            className={
                              posts.table.isWaiterCalled
                                ? "waitercalltablenumber"
                                : "tablenumberactive"
                            }
                          >
                            T{posts.table.index}
                          </div>

                          <div className="center">
                            <div className="imagecenter">
                              <img
                                src={
                                  posts.table.isWaiterCalled
                                    ? Waitercall
                                    : Customer
                                }
                                className={
                                  posts.table.isWaiterCalled
                                    ? "waiterimage"
                                    : "customerimage"
                                }
                              />
                            </div>

                            <div
                              className={
                                posts.table.isWaiterCalled
                                  ? "waitercallactive"
                                  : "tablecustomeractive"
                              }
                            >
                              <img
                                src={Customer}
                                className={
                                  posts.table.isWaiterCalled
                                    ? "customerwaiterimage"
                                    : "null"
                                }
                              />
                              {posts.table.customerCount} Customer
                            </div>
                          </div>
                          {posts.table.order_id != "NULL" ? (
                            <div
                              className={
                                posts.table.isWaiterCalled
                                  ? "waitertime"
                                  : "time"
                              }
                            >
                              <div
                                className={
                                  posts.table.isWaiterCalled
                                    ? "waitertimestart"
                                    : "tabletimestart"
                                }
                              >
                                {orderTime.toLocaleTimeString(
                                  "en-US",
                                  timeOptions
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="notime">&nbsp;</div>
                          )}
                        </button>
                      </div>
                    );
                  }
                });
              })}
          </div>
          <div className="tablebuttoncontainer">
            <div className="addtablecontainer">
              <button
                style={edittable ? null : { background: profileColor }}
                className={edittable ? "addtableinactive" : "addtableactive"}
                disabled={edittable ? true : false}
                onClick={() => {
                  handleaddtable();
                }}
              >
                + Add New Table
              </button>
            </div>

            <div className="duplicatetablecontainer">
              <button
                style={
                  duplicatetableOpen
                    ? {
                        borderColor: profileColor,
                        color: profileColor,
                      }
                    : { background: profileColor }
                }
                className={
                  edittable
                    ? duplicatetableOpen
                      ? "duplicatetablebuttonactive"
                      : "duplicatetablebutton"
                    : "null"
                }
                onClick={() => setDuplicateTableOpen(true)}
              >
                Duplicate Table
              </button>
            </div>
            <div className="removetablecontainer">
              <button
                style={
                  removetableOpen
                    ? {
                        borderColor: profileColor,
                        color: profileColor,
                      }
                    : { background: profileColor }
                }
                className={
                  edittable
                    ? removetableOpen
                      ? "removetablebuttonactive"
                      : "removetablebutton"
                    : "null"
                }
                onClick={() => setRemoveTableOpen(true)}
              >
                Remove Table
              </button>
            </div>

            <div className="edittablecontainer">
              {edittable ? (
                <button
                  style={{ background: profileColor }}
                  className="edittablebutton"
                  onClick={handlesavetable}
                >
                  Save Table
                </button>
              ) : (
                <button
                  style={
                    tableRetrieved &&
                    tableData.some((item) => item.length > 0) === true
                      ? { background: profileColor }
                      : { background: "#c4c4c4" }
                  }
                  disabled={
                    tableRetrieved &&
                    tableData.some((item) => item.length > 0) === true
                      ? false
                      : true
                  }
                  className="edittablebutton"
                  onClick={handleedittable}
                >
                  Edit Table
                </button>
              )}
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

export default connect(mapStateToProps)(TablesPage);
