import React, { useState, useEffect, useContext } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import NumberFormat from "react-number-format";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import recommended from "../../icons/Recommend.png";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import TopBar from "../TopBar/TopBar";
import { ThreeDots } from "react-loader-spinner";
import { SocketContext } from "../../socketContext";
import "../TopBar/TopBar.css";
import "./DashboardPage.css";
import { Switch } from "@material-ui/core";
import { useIosSwitchStyles } from "./switch/index";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import addedOrderSound from "../../sounds/order_added_sound.wav"
import waiterCalledSound from "../../sounds/waiter_called_sound.wav"

function DashboardPage({ tenant }) {
  const iosStyles = useIosSwitchStyles();
  let history = useHistory();

  const tableUrl = process.env.REACT_APP_TABLEURL;
  const [tableData, setTableData] = useState([]);
  const [tableRetrieved, setTableRetrieved] = useState(false);
  const [availableTable, setAvailableTable] = useState(0);
  const [filledTable, setFilledTable] = useState(0);
  const [profileColor, setProfileColor] = useState();
  const [tenantIsOpen, setTenantIsOpen] = useState();

  // socket connection
  const socket = useContext(SocketContext);

  useEffect(() => {
    if (socket) {
      socket.on("add table", (data) => handleTableAdded(data));
      socket.on("delete table", (data) => handleDeleteTable(data));
      socket.on("remove table", (data) => handleRemoveTable(data));
      socket.on("duplicate table", (data) => handleDuplicateTable(data));
      socket.off("add waiter call").on("add waiter call", (data) => handlCallTable(data));
      socket.on("remove waiter call", (data) => handlCallTable(data));
      socket.on("add promo", (data) => handleAddPromo(data));
      socket.on("update promo", (data) => handleUpdatePromo(data));
      socket.on("delete promo", (data) => handleDeletePromo(data));
      socket.on("add category", (data) => handleCategoryAdded(data));
      socket.off("update category").on("update category", (data) => handleCategoryUpdated(data));
      socket.on("delete category", (data) => handleCategoryRemoved(data));
      socket.off("add order").on("add order", (data) => handleOrderAdded(data));
      socket.on("update order", (data) => handleOrderUpdated(data));
      socket.on("update user", (data) => handleUserUpdated(data));
    }
  });

  function handleTableAdded(user) {
    // if (tableRetrieved) {
    //   let newData = tableData.splice();

    //   newData.push(user);
    //   setTableData(newData);
    // }
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

  function handleDeleteTable(user) {
    // if (tableRetrieved) {
    //   let newData = tableData.splice();

    //   newData.push(user);
    //   setTableData(newData);
    // }
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

  function handleRemoveTable(user) {
    // if (tableRetrieved) {
    //   let newData = tableData.splice();

    //   newData.push(user);
    //   setTableData(newData);
    // }
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

  function handleDuplicateTable(user) {
    // if (tableRetrieved) {
    //   let newData = tableData.splice();

    //   newData.push(user);
    //   setTableData(newData);
    // }
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

  function handlCallTable() {
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

  function handleAddPromo(user) {
    // if (promoRetrieved) {
    //   let newData = promoData.splice();

    //   newData.push(user);
    //   setPromoData(newData);
    // }
    if (tenant.tenant_id != undefined) {
      const url = promoUrl + "/retrieve/" + tenant.tenant_id;

      fetch(url, {
        method: "GET",
        headers: { "content-type": "application/JSON" },
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.status === "SUCCESS") {
            setPromoData([result.data]);
            setPromoRetrieved(() => true);
          } else {
            setPromoRetrieved(() => false);
          }
        });
    }
  }

  function handleUpdatePromo(user) {
    // if (promoRetrieved) {
    //   let newData = promoData.splice();

    //   newData.push(user);
    //   setPromoData(newData);
    // }
    if (tenant.tenant_id != undefined) {
      const url = promoUrl + "/retrieve/" + tenant.tenant_id;

      fetch(url, {
        method: "GET",
        headers: { "content-type": "application/JSON" },
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.status === "SUCCESS") {
            setPromoData([result.data]);
            setPromoRetrieved(() => true);
          } else {
            setPromoRetrieved(() => false);
          }
        });
    }
  }

  function handleDeletePromo(user) {
    // if (tableRetrieved) {
    //   let newData = promoData.splice();

    //   newData.push(user);
    //   setPromoData(newData);
    // }
    if (tenant.tenant_id != undefined) {
      const url = promoUrl + "/retrieve/" + tenant.tenant_id;

      fetch(url, {
        method: "GET",
        headers: { "content-type": "application/JSON" },
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.status === "SUCCESS") {
            setPromoData([result.data]);
            setPromoRetrieved(() => true);
          } else {
            setPromoRetrieved(() => false);
          }
        });
    }
  }

  function handleCategoryAdded(user) {
    // if (inventoryRetrieved) {
    //   let newData = inventoryData.splice();

    //   newData.push(user);
    //   setInventoryData(newData);
    // }
    if (tenant.tenant_id != undefined) {
      const url = inventorylUrl + "/all/" + tenant.tenant_id;

      fetch(url, {
        method: "GET",
        headers: { "content-type": "application/JSON" },
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.status === "SUCCESS") {
            console.log("invent")
            setInventoryData([result.data]);
            setInventoryRetrieved(() => true);
          } else {
            setInventoryRetrieved(() => false);
          }
        });
    }
  }

  function handleCategoryUpdated(user) {
    // if (inventoryRetrieved) {
    //   let newData = inventoryData.splice();

    //   newData.push(user);
    //   setInventoryData(newData);
    // }
    if (tenant.tenant_id != undefined) {
      const url = inventorylUrl + "/all/" + tenant.tenant_id;

      fetch(url, {
        method: "GET",
        headers: { "content-type": "application/JSON" },
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.status === "SUCCESS") {
            console.log("invent")
            setInventoryData([result.data]);
            setInventoryRetrieved(() => true);
          } else {
            setInventoryRetrieved(() => false);
          }
        });
    }
  }

  function handleCategoryRemoved(user) {
    // if (inventoryRetrieved) {
    //   let newData = inventoryData.splice();

    //   newData.push(user);
    //   setInventoryData(newData);
    // }
    if (tenant.tenant_id != undefined) {
      const url = inventorylUrl + "/all/" + tenant.tenant_id;

      fetch(url, {
        method: "GET",
        headers: { "content-type": "application/JSON" },
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.status === "SUCCESS") {
            console.log("invent")
            setInventoryData([result.data]);
            setInventoryRetrieved(() => true);
          } else {
            setInventoryRetrieved(() => false);
          }
        });
    }
  }

  function handleOrderAdded(user) {
    // if (orderRetrieved) {
    //   let newData = orderData.splice();
    //   setOrderRetrieved(false)
    //   newData.push(user);
    //   setOrderData(newData);
    // }
    // setOrderAddedNotif(true);
    // setTimeout(() => {
    //   setOrderAddedNotif(false);
    // }, 5000);

    // toast("Order Added")
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

      const urltable = tableUrl + "/" + tenant.tenant_id;

      fetch(urltable, {
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

  function handleOrderUpdated(user) {
    // if (orderRetrieved) {
    //   let newData = orderData.splice();

    //   newData.push(user);
    //   setOrderData(newData);
    // }
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

  function notification(type){
    if(type === "added"){
      new Audio(addedOrderSound).play()
      toast("Order Added",{ style:{background:`${profileColor}`, color: "#fff", fontWeight: "600"},progressClassName: "progressbar" });
           
    }else if(type === "called"){
      new Audio(waiterCalledSound).play()
      toast.warning("Waiter Called", { style:{background:"#fcd232", color: "#fff", fontWeight: "600"} ,progressClassName: "progressbar" })
    }
  }

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
    {
      tableRetrieved == true &&
        tableData.map((post) => {
          for (let i = 0; i < tableData[0].length; i++) {
            let available = 0;
            let filled = 0;

            return post.map((posts, index) => {
              if (posts.table.status === "FILLED") {
                filled++;
              } else {
                available++;
              }
              setAvailableTable(available);
              setFilledTable(filled);
            });
          }
        });
    }

    return () => {
      mounted = false;
    };
  }, [tenant, tableRetrieved]);

  const promoUrl = process.env.REACT_APP_PROMOURL;
  const [promoData, setPromoData] = useState([]);
  const [promoRetrieved, setPromoRetrieved] = useState(false);
  const [orderAddedNotif, setOrderAddedNotif] = useState(false);

  // Get Promo Data
  useEffect(() => {
    let mounted = true;

    if (mounted) {
      if (tenant.tenant_id != undefined) {
        const url = promoUrl + "/retrieve/" + tenant.tenant_id;

        fetch(url, {
          method: "GET",
          headers: { "content-type": "application/JSON" },
        })
          .then((response) => response.json())
          .then((result) => {
            if (result.status === "SUCCESS") {
              setPromoData([result.data]);
              setPromoRetrieved(() => true);
            } else {
              setPromoRetrieved(() => false);
            }
          });
      }
    }

    return () => {
      mounted = false;
    };
  }, [tenant, promoRetrieved]);

  const orderUrl = process.env.REACT_APP_ORDERURL;
  const [orderData, setOrderData] = useState([]);
  const [orderRetrieved, setOrderRetrieved] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);
  const [soldOutMenu, setSoldOutMenu] = useState(0);

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

  const [orderStatus, setOrderStatus] = useState("");
  const [orderTable, setOrderTable] = useState("");
  const [orderTime, setOrderTime] = useState("");
  const [orderMenu, setOrderMenu] = useState([]);
  const [orderItem, setOrderItem] = useState("");
  const [orderTotal, setOrderTotal] = useState("");
  const [orderServiceCharge, setOrderServiceCharge] = useState("");
  const [orderTaxCharge, setOrderTaxCharge] = useState("");
  const [userName, setUserName] = useState("");
  const [userPhonenumber, setUserPhonenumber] = useState("");
  const [orderInstruction, setOrderInstruction] = useState("");
  const [rejectReason, setRejectReason] = useState("");

  function handlePassinginfo(orderStatus, orderTable, orderTime, orderMenu, orderItem, orderTotal, orderServiceCharge, orderTaxCharge, userName, userPhonenumber, orderInstruction, rejectReason) {
    setOrderStatus(orderStatus);
    setOrderTable(orderTable);
    setOrderTime(orderTime);
    setOrderMenu(orderMenu);
    setOrderItem(orderItem);
    setOrderTotal(orderTotal);
    setOrderServiceCharge(orderServiceCharge);
    setOrderTaxCharge(orderTaxCharge);
    setUserName(userName);
    setUserPhonenumber(userPhonenumber);
    setOrderInstruction(orderInstruction);
    setRejectReason(rejectReason);
  }

  const ordertime = new Date(orderTime);
  const dateOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const inventorylUrl = process.env.REACT_APP_MENUURL;
  const [inventoryData, setInventoryData] = useState([]);
  const [inventoryRetrieved, setInventoryRetrieved] = useState(false);

  // Get Inventory Data
  useEffect(() => {
    let mounted = true;

    if (mounted) {
      if (tenant.tenant_id != undefined) {
        const url = inventorylUrl + "/all/" + tenant.tenant_id;

        fetch(url, {
          method: "GET",
          headers: { "content-type": "application/JSON" },
        })
          .then((response) => response.json())
          .then((result) => {
            if (result.status === "SUCCESS") {
              setInventoryData([result.data]);
              setInventoryRetrieved(() => true);
            } else {
              setInventoryRetrieved(() => false);
            }
          });
      }
    }
    {
      inventoryRetrieved == true &&
        inventoryData[0].map((item) => {
          return item.menu.map((post, index) => {
            let counter = 0;
            for (let i = 0; i < inventoryData[0][0].menu.length; i++) {
              if (inventoryData[0][0].menu[i].quantity == 0 && inventoryData[0][0].menu[i].isUnlimited === false) counter++;
            }

            setSoldOutMenu(counter);
          });
        });
    }
    return () => {
      mounted = false;
    };
  }, [tenant, inventoryRetrieved]);

  function redirectinventory() {
    history.push("/inventory");
  }

  function redirectorder() {
    history.push("/orderstatus");
  }

  function redirectpromo() {
    history.push("/promo");
  }

  function redirectinventory() {
    history.push("/inventory");
  }

  function redirectorder() {
    history.push("/orderstatus");
  }

  function redirectpromo() {
    history.push("/promo");
  }

  const localUrl = process.env.REACT_APP_TENANTURL;
  const [tenantData, setTenantData] = useState([]);
  const [tenantRetrieved, setTenantRetrieved] = useState(false);

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
              setTenantIsOpen([result.data][0].isOperational);
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
        setProfileColor(tenantData[0].profileColor);
      }
    }
    return () => {
      mounted = false;
    };
  }, [tenantRetrieved, tenantData]);

  function handleTenantOpen(isChecked) {
    setTenantIsOpen(isChecked);
    const editUrl = localUrl + "/edit/" + tenant.tenant_id;
    fetch(editUrl, {
      method: "POST",
      body: JSON.stringify({
        isOperational: isChecked,
      }),
      headers: { "content-type": "application/JSON" },
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("berhasil", tenantIsOpen, result);
        if (socket) {
          socket.emit("update tenant", result.data);
        }
      });
  }

  return (
    <div className="container">
      <div className="topbar">
        <div className="left" style={{ color: profileColor }}>
          Dashboard
        </div>

        <TopBar />
      </div>

      <div className="switchbuttoncontainer">
        <div className="textswitchbutton">Open Tenant ?</div>
        {tenantIsOpen !== undefined && (
          <Switch
            className="switchbutton"
            classes={iosStyles}
            checked={tenantIsOpen}
            onChange={(e) => {
              handleTenantOpen(e.target.checked);
              // setTenantIsOpen(e.target.checked);
              // setValidCategoryName(true);
            }}
          />
        )}

        <div className="sizedbox"></div>
      </div>
      {/* <div onClick={() => history.push("/orderstatus")} style={{ background: profileColor }} className="notification">
        <div className="notificationtextcontainer">
          <div className="notificationtext">Order Added</div>
        </div>

        <div className="notificationclose">
          <button className="notifclosebutton" onClick={() => setOrderAddedNotif(false)}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
      </div> */}
      {/* <button onClick={notify}>Notify!</button> */}
      <div onClick={() => history.push("/orderstatus")}>
        <ToastContainer />
      </div>

      {tableRetrieved ? (
        <div className="dashboardsection">
          <div className="tables">
            Tables
            <div className="tablecol">
              <div className="tablecolumn1">
                <div className="heading">Table Available List</div>
                <div className="scrollable">
                  <div className="dashboardtablecontainer">
                    <div className="tablegrid">
                      {tableRetrieved == true &&
                        tableData.map((post) => {
                          return post.map((posts, index) => {
                            if (posts.table.status === "EMPTY") {
                              return (
                                <>
                                  <div className="tablenumber">{posts.table.index}</div>
                                </>
                              );
                            }
                          });
                        })}
                    </div>
                  </div>
                </div>
              </div>
              <div className="tablecolumn2">
                <div className="tablerow">
                  <div className="number">{filledTable}</div>
                  <div className="tablerowtext">
                    <div className="up">Table</div>
                    <div className="down">Occupied</div>
                  </div>
                </div>
                <div className="tablerow">
                  <div className="number2">{availableTable}</div>
                  <div className="tablerowtext">
                    <div className="up">Table</div>
                    <div className="down">Available</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="inventory">
            Inventory
            <div className="dashboardinventorycol">
              <div className="invcolumn1">
                <div className="tablerow">
                  <div className="number">{soldOutMenu}</div>
                  <div className="tablerowtext">
                    <div className="up">Menu</div>
                    <div className="down">Sold Out</div>
                  </div>
                </div>
                <div className="buttoncontainer">
                  <button className="button" onClick={redirectinventory}>
                    View Detail
                  </button>
                </div>
              </div>
              <div className="invcolumn2">
                <div className="headerrow">
                  <div className="text1">No.</div>
                  <div className="text2">Name</div>
                  <div className="text3">Available Stock</div>
                </div>
                <div className="list">
                  {inventoryRetrieved == true &&
                    inventoryData[0].map((post) => {
                      return post.menu.map((posts, index) => {
                        return (
                          <div className="inventorylistgrid">
                            <div className="inventoryindex">
                              <div className="index">{index + 1} </div>
                            </div>
                            <div className="inventoryname">{posts.name}</div>
                            <div className="inventorystock">
                              {posts.isUnlimited ? "Unlimited" : posts.quantity}
                              {/* {posts.quantity} */}
                            </div>
                          </div>
                        );
                      });
                    })}
                </div>
              </div>
            </div>
          </div>

          <div className="orderscreen">
            Order Screen
            <div className="dashboardordercontainer">
              <div className="dashboardordergrid">
                <Modal open={orderOpen}>
                  <Box className="ordermodalboxdashboard">
                    <div className="modalclose">
                      <button className="modalclosebutton" onClick={() => setOrderOpen(false)}>
                        <FontAwesomeIcon className="closebuttonicon" icon={faCircleXmark} />
                      </button>
                    </div>

                    <div className="innermodalbox">
                      <div className="ordermodaltitle">{tenant.name}</div>
                      <div className="ordermodalsubtitle">
                        <div className="ordermodaldate">
                          <div className="ordertimedashboard">
                            <CalendarTodayOutlinedIcon fontSize="inherit" className="timeicon" />
                            {ordertime.toLocaleTimeString("en-US")}
                            <span className="space">/</span>
                            <span className="orderdatedashboard">{ordertime.toLocaleDateString("en-ID", dateOptions)}</span>
                          </div>
                        </div>

                        <div className="ordermodalstatusdashboard">
                          <div className="statustextdashboard">STATUS</div>
                          <div className="statuscoloredtextdashboard">
                            {orderStatus == 1 ? (
                              <div className="pending">PENDING</div>
                            ) : orderStatus == 2 ? (
                              <div className="orderplaced">ORDER PLACED</div>
                            ) : orderStatus == 3 ? (
                              <div className="served">SERVED</div>
                            ) : orderStatus == 4 ? (
                              <div className="payment">PAYMENT</div>
                            ) : orderStatus == 5 ? (
                              <div className="complete">COMPLETE</div>
                            ) : orderStatus == 6 ? (
                              <div className="modalrejectedstatus">REJECTED</div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                      <div className="ordermodalitemsdashboard">
                        <div className="ordermodalformdashboard">
                          <form>
                            <div className="ordermodalinputlabel">
                              Name <span style={{ color: "#E52C32" }}>*</span>
                            </div>
                            <input type="text" value={userName} className="ordermodalinputfile" disabled={true} />
                            <div className="ordermodalinputlabel">
                              Phone Number
                              <span style={{ color: "#E52C32" }}>*</span>
                            </div>
                            <input type="text" value={userPhonenumber} className="ordermodalinputfile" disabled={true} />
                            <div className="ordermodalinputlabel">Special Instructions</div>
                            <div  className="ordermodalinputfiletextarea">
                              {orderInstruction}
                            </div>
                            <div className="ordermodalinputlabel">Table</div>
                            <input type="text" value={orderTable} className="ordermodalinputfile" disabled={true} />
                            {orderStatus == 6 ? (
                              <>
                                <div className="ordermodalinputlabel">Reasons for rejecting</div>
                                <div className="rejectreasontext">{rejectReason}</div>
                              </>
                            ) : null}
                          </form>
                        </div>

                        <div className="ordermenuitemcontainerdashboard">
                          <div className="ordermenutitle">Order Items</div>
                          <div className="ordermenuitem">
                            {orderMenu.map((post, index) => (
                              <div className="ordermenucontainer">
                                <div className="ordermenuimagecontainer">
                                  <img src={post.menuImage} className="menuimage" />
                                </div>
                                <div className="orderdetailsmenutext">
                                  <div className="orderdetailsmenutitle">{post.name}</div>
                                  <div className="recommended">{post.isRecommended === true ? <img src={recommended} /> : "null"}</div>
                                  <div className="orderdetailmenuprice">
                                    <NumberFormat value={post.price} prefix="Rp. " decimalSeparator="." thousandSeparator="," displayType="text" />
                                    <div className="orderquantity">
                                      Qty: {console.log("orrrr", post)}
                                      <span className="orderquantitytext">{post.orderQuantity}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="ordertotalsummary">
                            <div className="ordertotalitems">
                              <div className="lefttext">Items:</div>
                              <div className="righttext">{orderItem}</div>
                            </div>

                            <div className="ordertotalitems">
                              <div className="lefttext">Subtotal:</div>
                              <div className="righttext">
                                <NumberFormat value={orderTotal} prefix="Rp. " decimalSeparator="." thousandSeparator="," displayType="text" />
                              </div>
                            </div>

                            <div className="ordertotalitems">
                              <div className="lefttext">Service Charge:</div>
                              <div className="righttext">
                                <NumberFormat value={orderServiceCharge} prefix="Rp. " decimalSeparator="." thousandSeparator="," displayType="text" />
                              </div>
                            </div>

                            <div className="ordertotalitems-n">
                              <div className="lefttext">Tax(%):</div>
                              <div className="righttext">
                                <NumberFormat value={orderTaxCharge} prefix="Rp. " decimalSeparator="." thousandSeparator="," displayType="text" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Box>
                </Modal>

                {orderRetrieved == true &&
                  orderData.map((item) => {
                    return item.map((post, index) => {
                      if (post.order_status != 5 && post.order_status != 6) {
                        return (
                          <>
                            <div className="orderdetails">
                              <div className="leftdetail">
                                <div className="orderID">{post.order_id}</div>
                                <div className="orderdetail">
                                  <div className="orderdetailtime">{moment(post.order_time).fromNow()}&nbsp;-</div>
                                  <div className="tableID">
                                    {tableRetrieved &&
                                      tableData.map((item) => {
                                        return item.map((posts, index) => {
                                          if (posts.table.id == post.order_table) {
                                            return (
                                              <span>
                                                Table&nbsp;
                                                {posts.table.index}
                                              </span>
                                            );
                                          }
                                        });
                                      })}
                                  </div>
                                </div>
                              </div>

                              <div className="rightdetail">
                                <div className="orderbuttoncontainer">
                                  <button
                                    className="orderbutton"
                                    // onClick={redirectorder}

                                    onClick={() => {
                                      let tableNumber;
                                      {
                                        tableRetrieved &&
                                          tableData.map((item) => {
                                            return item.map((posts, index) => {
                                              if (posts.table.id == post.order_table) {
                                                tableNumber = posts.table.index;
                                              }
                                            });
                                          });
                                      }
                                      setOrderOpen(true);
                                      handlePassinginfo(
                                        post.order_status,
                                        tableNumber,
                                        post.order_time,
                                        post.order_menu,
                                        post.order_item,
                                        post.order_total,
                                        post.order_servicecharge,
                                        post.order_taxcharge,
                                        post.user_name,
                                        post.user_phonenumber,
                                        post.order_instruction,
                                        post.reject_reason
                                      );
                                    }}
                                  >
                                    View Detail
                                  </button>
                                </div>
                              </div>
                            </div>
                          </>
                        );
                      }
                    });
                  })}
              </div>
            </div>
          </div>
          <div className="promo">
            Promo Banner
            <div className="dashboardpromocontainer">
              {promoRetrieved == true &&
                promoData[0].map((post, index) => {
                  return (
                    <div className="promodetails">
                      <button key={index} className="promodetailbutton" type="button" onClick={redirectpromo}>
                        <img src={post.promoImage} className="picture" />
                      </button>
                    </div>
                  );
                })}
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
          <ThreeDots color={tenant.profileColor} height={80} width={80} />
        </div>
      )}
    </div>
  );
}

const mapStateToProps = ({ session }) => ({
  tenant: session.user,
});

export default connect(mapStateToProps)(DashboardPage);
