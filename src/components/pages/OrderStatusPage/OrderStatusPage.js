import React, { useState, useEffect, useContext } from "react";
import NumberFormat from "react-number-format";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { connect } from "react-redux";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { CustomizedRadios } from "./Radio/RadioButton";
import moment from "moment";
import TopBar from "../TopBar/TopBar";
import { ThreeDots } from "react-loader-spinner";
import { SocketContext } from "../../socketContext";
import recommended from "../../icons/Recommend.png";
import removecat from "../../icons/RemoveCat.svg";
import "../TopBar/TopBar.css";
import "./OrderStatusPage.css";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import addedOrderSound from "../../sounds/order_added_sound.wav"
import waiterCalledSound from "../../sounds/waiter_called_sound.wav"

import { Br, Cut, Line, Printer, Text, render, Row, Image } from 'react-thermal-printer';
import oasisMonochrome from "../../image/oasis_logo_300.png"

function OrderStatusPage({ tenant }) {
  console.log("tenat",tenant)
  const orderUrl = process.env.REACT_APP_ORDERURL;
  const [orderData, setOrderData] = useState([]);
  const [data, setData] = useState([]);
  const [filteredOrderData, setFilteredOrderData] = useState([]);
  const [orderRetrieved, setOrderRetrieved] = useState(false);
  const [acceptance, setAcceptance] = useState([]);
  const tablelUrl = process.env.REACT_APP_TABLEURL;
  const [tableData, setTableData] = useState([]);
  const [tableRetrieved, setTableRetrieved] = useState(false);
  const [btnStatus, setBtnStatus] = useState();
  let history = useHistory();

  // const [openPort, setOpenPort] = useState(false);

  // Get Table Data
  useEffect(() => {
    let mounted = true;

    if (mounted) {
      // if (tenant.tenant_id != undefined) {
        const url = tablelUrl + "/" + tenant.tenant_id;
     
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
      // }
    }

    return () => {
      mounted = false;
    };
  }, [tableRetrieved]);

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
              let sortedData = result.data.sort(function (left, right) {
                return moment(right.order_time).diff(left.order_time);
              });
              setOrderData([sortedData]);
              setData([sortedData]);
              setOrderRetrieved(() => true);
              // orderData.sort((a,b) => {
              //   const time = Date.parse(post.order_time);
              //   console.log("postttt",time)
              //   return Date.parse(a.order_time) - Date.parse(b.order_time
              // })
              // setData([result.data]);

              // after called useeffect
              handleStatus(btnStatus);
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
        socket.off("update user").on("update user", (data) => handleUserUpdated(data));
    
    }
  });

  function handleOrderAdded(user) {
    // setOrderAddedNotif(true);
    // setTimeout(() => {
    //   setOrderAddedNotif(false);
    // }, 5000);

    if (orderRetrieved) {
      const url = orderUrl + "/retrieve/" + tenant.tenant_id;

      fetch(url, {
        method: "GET",
        headers: { "content-type": "application/JSON" },
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.status === "SUCCESS") {
            // notification("added")
            new Audio(addedOrderSound).play();
            toast("Order Added", { style: { background: `${profileColor}`, color: "#fff", fontWeight: "600" }, progressClassName: "progressbar" });
     
            setOrderData([result.data]);
            setData([result.data]);
            setOrderRetrieved(() => true);

            handleStatus(btnStatus);
          } else {
            setOrderRetrieved(() => false);
          }
        });
    }

    // if (orderRetrieved) {
    //   let newData = orderData.splice();
    //   newData.push(user);
    //   setOrderData(newData);

    //   handleStatus(btnStatus)
    // }
  }

  function handlCallTable(user){
    new Audio(waiterCalledSound).play();
    toast.warning("Waiter Called", { style: { background: "#fcd232", color: "#fff", fontWeight: "600" }, progressClassName: "progressbar" });
           
  }

  function handleOrderUpdated(user) {
    if (orderRetrieved) {
      const url = orderUrl + "/retrieve/" + tenant.tenant_id;

      fetch(url, {
        method: "GET",
        headers: { "content-type": "application/JSON" },
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.status === "SUCCESS") {
            setOrderData([result.data]);
            setData([result.data]);
            setOrderRetrieved(() => true);

            handleStatus(btnStatus);
          } else {
            setOrderRetrieved(() => false);
          }
        });
    }
    // if (orderRetrieved) {
    //   let newData = orderData.splice();
    //   newData.push(user);
    //   setOrderData(newData);

    //   handleStatus(btnStatus)
    // }
  }

  const localUrl = process.env.REACT_APP_TENANTURL;
  const [tenantData, setTenantData] = useState([]);
  const [tenantRetrieved, setTenantRetrieved] = useState(false);
  const [profileName, setProfileName] = useState();
  const [profileColor, setProfileColor] = useState();

  const statusTab = ["All", "Proceed", "Serve", "Complete"];

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

  // useEffect(()=>{
  //   setOpenPort(false)
  // },[openPort])

  
  
  // async function printerthermal(menu){
  //   const printFormat = (
  //     <Printer type="epson" width={42}>
  //       <Text size={{ width: 2, height: 2 }} align="center" bold={true}>NAMA TENANT</Text>
  //       <Text>ALAMAT TENANT / INFO</Text>
  //       <Br />
  //       <Line />

  //       {/* {menu.map((e)=>{
  //         let left = `${e.name} X ${e.orderQuantity}`
  //         let right = <NumberFormat value={e.price} prefix="Rp. " decimalSeparator="." thousandSeparator="," displayType="text" />
  //         return <Row left={left} right={right}/>
  //       })} */}
  
  //       <Row left="MAKANAN X 2" right="Rp11.000" />
  //       <Row left="MAKANAN X 2" right="Rp11.000" />
  //       <Row left="MAKANAN X 2" right="Rp11.000" />
  
  //       <Br />
  //       <Line />
        
  //       <Row left="Subtotal : " right="Rp33.000"/>
  //       <Row left="Total : " right="Rp33.000"/>
  
  //       <Br />
  //       <Line />
  //       <Image src="../../image/oasis_logo_monochrome.png" />
  //       <Cut />
  
  //     </Printer>
  //   );
  //   const data = await render(printFormat);

  //   port = await navigator.serial.requestPort();
     
  //   if (openPort === false){
  //     // port = await navigator.serial.requestPort();
  //     await port.open({ baudRate: 9600 });
  //      setOpenPort(true)
  //   }

    
    
  //   const writer = port.writable?.getWriter();
  //   if (writer != null) {
  //     await writer.write(data);
  //     writer.releaseLock();
  //   }
  // }

  function handleacceptincrement(i, v, j) {
    orderData.map((item) => {
      return item.map((post, index) => {
        if (post.order_id == i) {
          if (post.order_status == 1) {
            post.order_status = 2;
          } else if (post.order_status == 2) {
            post.order_status = 3;
          } else if (post.order_status == 3) {
            post.order_status = 4;
          } else if (post.order_status == 4) {
            post.order_status = 5;
          }
          // post.order_status = v + 1;

          const url = orderUrl + "/edit/" + tenant.tenant_id + "/" + i;
          fetch(url, {
            method: "POST",
            body: JSON.stringify({
              order_status: post.order_status,
              order_table: j,
            }),
            headers: { "content-type": "application/JSON" },
          })
            .then((response) => response.json())
            .then((result) => {
              if (result.status === "SUCCESS") {
                if (socket) {
                  socket.emit("update order", result.data);
                }
              }
            });
        }
        setAcceptance({ post });
      });
    });
  }

  function handlemultiplecompleteorder(i, v, j) {
    const url = orderUrl + "/table/retrieve/" + tenant.tenant_id;
    const payload = JSON.stringify({
      order_table: j,
    });
    fetch(url, {
      method: "POST",
      body: payload,
      headers: { "content-type": "application/JSON" },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "SUCCESS") {
          var results = result.data;

          for (var a = 0; a < results.length; a++) {
            // Only auto completes the paid orders in that table
            if (result.data[a].order_status === 4) {
              orderData.map((item) => {
                return item.map((post, index) => {
                  if (post.order_id == result.data[a].order_id) {
                    const url = orderUrl + "/edit/" + tenant.tenant_id + "/" + result.data[a].order_id;
                    fetch(url, {
                      method: "POST",
                      body: JSON.stringify({
                        order_status: 5,
                        order_table: result.data[a].order_table,
                      }),
                      headers: { "content-type": "application/JSON" },
                    })
                      .then((response) => response.json())
                      .then((result) => {
                        if (result.status === "SUCCESS") {
                          if (socket) {
                            socket.emit("update order", result.data);
                          }
                        }
                      });
                  }
                  setAcceptance({ post });
                });
              });
            }
          }
        }
      });
  }

  const [rejectOrder, setRejectOrder] = useState(false);
  const [rejectID, setRejectID] = useState();
  const [rejectReason, setRejectReason] = useState(false);
  const [rejectReasonText, setRejectReasonText] = useState();
  const [status, setStatus] = useState();

  const [removeitemnotif, setRemoveItemNotif] = useState(false);
  const [orderAddedNotif, setOrderAddedNotif] = useState(false);

  async function handleRejectOrder(id) {
    setRemoveItemNotif(true);
    setTimeout(() => {
      setRemoveItemNotif(false);
    }, 5000);
    setRejectReason(false);

    const url = orderUrl + "/reject/" + tenant.tenant_id + "/" + id;
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        order_status: "6",
        reject_reason: rejectReasonText,
      }),
      headers: { "content-type": "application/JSON" },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "SUCCESS") {
          if (socket) {
            socket.emit("update order", result.data);
          }
        }
      });

    setRejectOrder(false);
    setRejectID();
    setRejectReasonText();
  }

  function rejectOrdermodal() {
    return (
      <Modal open={rejectOrder}>
        <Box className={rejectReason ? "rejectorderbox" : "removecatmodalbox"}>
          <div className="removecatinnerbox">
            <div className="removecatheading">
              <img src={removecat} className="removecatimage" />
              <div className="removecatmodaltitle">Reject Order</div>
            </div>
            <div className="removecatmodaltext">
              {rejectReason ? "Reason why this order is rejected?" : "Are you sure to reject this order?"}
              {rejectReason ? (
                <div className="radiogroupcontainer">
                  <CustomizedRadios setStatus={setRejectReasonText} />
                </div>
              ) : null}
            </div>

            <div className="removecatmodalbuttoncontainer">
              <div>
                <button
                  className="modalcancelbutton"
                  onClick={() => {
                    setRejectOrder(false);
                    setRejectReason(false);
                  }}
                >
                  Cancel
                </button>
              </div>
              <div>
                <button
                  className="modalconfirmbutton"
                  onClick={() => {
                    rejectReason ? handleRejectOrder(rejectID) : setRejectReason(true);
                  }}
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </Box>
      </Modal>
    );
  }

  function notification(type){
    if(type === "added"){
      new Audio(addedOrderSound).play()
      console.log("isplayy")
      toast("Order Added",{ style:{background:`${profileColor}`, color: "#fff", fontWeight: "600"},progressClassName: "progressbar" });
           
    }else if(type === "called"){
      new Audio(waiterCalledSound).play()
      toast.warning("Waiter Called", { style:{background:"#fcd232", color: "#fff", fontWeight: "600"} ,progressClassName: "progressbar" })
    }
  }

  function handleStatus(status) {
    setBtnStatus(status);
    if (status == "All") {
      setOrderData(data);
    } else if (status == "Proceed") {
      const filteredOrder = data[0].filter((e) => e.order_status === 1);
      setOrderData([filteredOrder]);
  
    } else if (status == "Serve") {
      const filteredOrder = data[0].filter((e) => e.order_status === 2 || e.order_status === 3 || e.order_status === 4);
   
      setOrderData([filteredOrder]);
    } else if (status == "Complete") {
      const filteredOrder = data[0].filter((e) => e.order_status === 5);
      setOrderData([filteredOrder]);
    }
  }

  return (
    <div className="container">
      <div className="topbar">
        <div className="left" style={{ color: profileColor }}>
          Order Status Screen
        </div>

        <TopBar />
      </div>

      <div onClick={() => history.push("/orderstatus")}>
        <ToastContainer />
      </div>

      {orderRetrieved ? (
        <>
          <div className="buttonContainer">
            <div className="flexcontainer">
              <div className="containerstatustab">
                {statusTab.map((e) => {
                  return (
                    <button
                      style={btnStatus == e ? { background: profileColor, color: "#fff", border: "1px solid #fff" } : { background: "#fff", border: `1px solid ${profileColor}`, color: profileColor }}
                      onClick={() => handleStatus(e)}
                      className={btnStatus == e ? "buttonorderstatuson" : "buttonorderstatusoff"}
                    >
                      {e}
                    </button>
                  );
                })}
              </div>
              {/* <button onClick={printerthermal}>testing printer</button> */}
              <button style={{ background: "#fff", color: profileColor, border: `1px solid ${profileColor}` }} className="buttonrefresh" onClick={() => localStorage.clear()}>
                Clear Cache
              </button>
            </div>
          </div>
          <div className="orderstatusoutercontainer">
            <div className="orderstatuscontainer">
              {rejectOrdermodal()}
              <div style={{ background: profileColor }} className={removeitemnotif ? "notification" : "hidden"}>
                <div className="notificationtextcontainer">
                  <div className="notificationtext">Order Removed</div>
                </div>

                <div className="notificationclose">
                  <button className="notifclosebutton" onClick={() => setRemoveItemNotif(false)}>
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                </div>
              </div>

              {/* <div onClick={() => history.push("/orderstatus")} style={{ background: profileColor }} className={orderAddedNotif ? "notification" : "hidden"}>
                <div className="notificationtextcontainer">
                  <div className="notificationtext">Order Added</div>
                </div>

                <div className="notificationclose">
                  <button className="notifclosebutton" onClick={() => setOrderAddedNotif(false)}>
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                </div>
              </div> */}

              {orderRetrieved == true &&
                orderData.map((item) => {
                  return item.map((post, index) => {
                    console.log("itemmmmm", item);
                    if (post.order_status != 6) {
                      return (
                        <>
                          <div className="orderstatuscard" style={post.order_status == 1 ? { background: "#daeaff" } : { background: "#fff" }}>
                            <FontAwesomeIcon
                              icon={faXmark}
                              className="closeordericon"
                              onClick={() => {
                                setRejectOrder(true);
                                setRejectID(post.order_id);
                              }}
                            />

                            <div className="orderID">{post.order_id}</div>
                            <div className="orderdetail">
                              <div className="orderstatustime">{moment(post.order_time).fromNow()}&nbsp;-</div>
                              <div className="tableID" style={{ color: profileColor }}>
                                {tableRetrieved &&
                                  tableData.map((item) => {
                                    return item.map((posts, index) => {
                                      if (posts.table.id == post.order_table) {
                                        return (
                                          <span style={{ alignContent: "center" }}>
                                            Table&nbsp;
                                            {posts.table.index}
                                          </span>
                                        );
                                      }
                                    });
                                  })}
                              </div>
                            </div>
                            <div className="buttonprintwrapper">
                              <button
                                className="buttonprint"
                                style={{ border: `1px solid ${profileColor}`, color: `${profileColor}` }}
                                type="button"
                                onClick={() => {
                                  let tableNumber;
                                  {
                                    tableRetrieved &&
                                      tableData.map((item) => {
                                        return item.map((posts, index) => {
                                          if (posts.table.id == post.order_table) {
                                            return (tableNumber = posts.table.index);
                                          }
                                        });
                                      });
                                  }

                                  let order = post;
                                  let status = "2";
                                  let newWindow = window.open("/printreceipt", "_blank");
                                  newWindow.data = { order, status, tenant, tableNumber };
                                }}
                              >
                                DPR
                              </button>
                              <button
                                className="buttonprint"
                                style={{ border: `1px solid ${profileColor}`, color: `${profileColor}` }}
                                type="button"
                                onClick={() => {
                                  let tableNumber;
                                  {
                                    tableRetrieved &&
                                      tableData.map((item) => {
                                        return item.map((posts, index) => {
                                          if (posts.table.id == post.order_table) {
                                            return (tableNumber = posts.table.index);
                                          }
                                        });
                                      });
                                  }

                                  let order = post;
                                  let status = "4";
                                  let newWindow = window.open("/printreceipt", "_blank");
                                  newWindow.data = { order, status, tenant, tableNumber };
                                }}
                              >
                                KSR
                              </button>
                            </div>
                            <div className="menucontainer">
                              {post.order_menu != undefined &&
                                post.order_menu.map((posts, index) => {
                                  return (
                                    <div className="menudetails">
                                      <div className="menuimagecontainer">
                                        <img src={posts.menuImage} className="menuimage" />
                                      </div>
                                      <div className={index < posts.length - 1 ? "menutext" : "nobordermenutext"}>
                                        <div className="menutitle">{posts.name}</div>
                                        <div className="recommended">{posts.isRecommended === true ? <img src={recommended} /> : null}</div>
                                        <div className="menutext2">
                                          <div className="menuprice">
                                            <NumberFormat value={posts.price} prefix="Rp. " decimalSeparator="." thousandSeparator="," displayType="text" />
                                          </div>
                                          <div className="menuquant">
                                            Qty:
                                            <span className="quant">{posts.orderQuantity}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                            <div className="stepcontainer">
                              {post.order_status == 1 ? (
                                <>
                                  {" "}
                                  <div className="circlefull"></div>
                                  <div className="line"></div>
                                  <div className="circle"></div>
                                  <div className="line"></div>
                                  <div className="circle"></div>
                                </>
                              ) : post.order_status == 4 || post.order_status == 2 ? (
                                <>
                                  {" "}
                                  <div className="circlefull"></div>
                                  <div className="linered"></div>
                                  <div className="circlehalf"></div>
                                  <div className="line"></div>
                                  <div className="circle"></div>
                                </>
                              ) : post.order_status == 3 ? (
                                <>
                                  {" "}
                                  <div className="circlefull"></div>
                                  <div className="linered"></div>
                                  <div className="circlefull"></div>
                                  <div className="linered"></div>
                                  <div className="circlehalf"></div>
                                </>
                              ) : post.order_status == 5 ? (
                                <>
                                  {" "}
                                  <div className="circlefull"></div>
                                  <div className="linered"></div>
                                  <div className="circlefull"></div>
                                  <div className="linered"></div>
                                  <div className="circlefull"></div>
                                </>
                              ) : null}
                            </div>
                            <div className="totalcontainer">
                              <div className="total">
                                <div className="totalquant">x{post.order_item} items</div>
                                <div className="totalprice">
                                  <NumberFormat value={post.order_total} prefix="Rp. " decimalSeparator="." thousandSeparator="," displayType="text" />
                                </div>
                              </div>
                              <div className="buttoncontainer" key={index}>
                                {post.order_status == 1 ? (
                                  <button
                                    className="proceedstatusbutton"
                                    type="button"
                                    onClick={() => {
                                      handleacceptincrement(post.order_id, post.order_status, post.order_table);
                                    }}
                                  >
                                    <FontAwesomeIcon icon={faCheck} className="icon" />
                                    Proceed
                                  </button>
                                ) : post.order_status == 2 ? (
                                  <button
                                    type="button"
                                    className="servestatusbutton"
                                    onClick={() => {
                                      handleacceptincrement(post.order_id, post.order_status, post.order_table);
                                    }}
                                  >
                                    <FontAwesomeIcon icon={faCheck} className="icon" />
                                    Paid
                                  </button>
                                ) : post.order_status == 3 ? (
                                  <button
                                    className="completedstatusbutton"
                                    type="button"
                                    onClick={() => {
                                      handleacceptincrement(post.order_id, post.order_status, post.order_table);
                                      // handlemultiplecompleteorder(post.order_id, post.order_status, post.order_table);
                                    }}
                                  >
                                    <FontAwesomeIcon icon={faCheck} className="icon" />
                                    Serve
                                  </button>
                                ) : post.order_status == 4 ? (
                                  <button
                                    className="completedstatusbutton"
                                    type="button"
                                    onClick={() => {
                                      // handlemultiplecompleteorder(post.order_id, post.order_status, post.order_table);
                                      handleacceptincrement(post.order_id, post.order_status, post.order_table);
                                    }}
                                  >
                                    <FontAwesomeIcon icon={faCheck} className="icon" />
                                    Complete
                                  </button>
                                ) : null}
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
        </>
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

export default connect(mapStateToProps)(OrderStatusPage);
