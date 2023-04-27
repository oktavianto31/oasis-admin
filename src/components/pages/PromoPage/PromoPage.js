import React, { useState, useEffect, useContext } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import DatePicker from "../../datepicker/components/date_picker/date_picker";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faPencil } from "@fortawesome/free-solid-svg-icons";
import TopBar from "../TopBar/TopBar";
import { ThreeDots } from "react-loader-spinner";
import { SocketContext } from "../../socketContext";
import Compressor from "compressorjs";
import removecat from "../../icons/RemoveCat.svg";
import "./PromoPage.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useHistory } from "react-router-dom";
import addedOrderSound from "../../sounds/order_added_sound.wav"
import waiterCalledSound from "../../sounds/waiter_called_sound.wav"

function PromoPage({ tenant }) {
  const promoUrl = process.env.REACT_APP_PROMOURL;
  const imageUrl = process.env.REACT_APP_IMAGEURL;

  // socket connection
  const socket = useContext(SocketContext);
  const [promoImage, setPromoImage] = useState();

  //promo banner modal
  const [bannerType, setBannerType] = useState("");
  const [promobanneropen, setpromobanneropen] = useState(false);
  const [promoRetrieved, setPromoRetrieved] = useState(false);
  const [removepromobanner, setRemovePromoBanner] = useState(false);
  const [promoData, setPromoData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [promoID, setPromoID] = useState();
  const [promoName, setPromoName] = useState();
  const [promoDetails, setPromoDetails] = useState();
  const [btnType, setBtnType] = useState();

  // Date
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  // Notification
  const [promoaddnotif, setPromoAddNotif] = useState(false);
  const [promoremovenotif, setPromoRemoveNotif] = useState(false);
  const [promoeditnotif, setPromoEditNotif] = useState(false);
  function handlenotification() {
    if (promoaddnotif || promoremovenotif || promoeditnotif) {
      setPromoAddNotif(false);
      setPromoRemoveNotif(false);
      setPromoEditNotif(false);
    }
  }

  let history = useHistory();

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
              setFilteredData([result.data])
              setPromoRetrieved(() => true);
            } else {
              setPromoRetrieved(() => true);
            }
          });
      }
    }

    return () => {
      mounted = false;
    };
  }, [tenant, promoRetrieved]);

  useEffect(() => {
    if (socket) {
      socket.off("add order").on("add order", (data) => handleOrderAdded(data));
      socket.off("add waiter call").on("add waiter call", (data) => handlCallTable(data));
      socket.on("add promo", (data) => handleAddPromo(data));
      socket.on("update promo", (data) => handleAddPromo(data));
      socket.on("delete promo", (data) => handleAddPromo(data));
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

  function handleAddPromo(user) {
    if (promoRetrieved) {
      let newData = promoData.splice();

      newData.push(user);
      setPromoData(newData);
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

  async function imageHandler(e) {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setPromoImage(reader.result);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  }

  async function HandleEditPromo() {
    setpromobanneropen(false);

    var inputs = document.querySelector('input[type="file"]');
    if (inputs.files[0] == undefined) {
      const url = promoUrl + "/edit/" + tenant.tenant_id + "/" + promoID;
      const payload = JSON.stringify({
        promo_name: promoName,
        promo_start: startDate,
        promo_end: endDate,
        promo_details: promoDetails,
      });

      await fetch(url, {
        method: "POST",
        body: payload,
        headers: { "content-type": "application/JSON" },
      })
        .then((response) => response.json())
        .then((result) => {
          if (socket) {
            socket.emit("update promo", result.data);
            setPromoData([result.data]);
            setPromoRetrieved(() => true);
          }
        });
    } else {
      const imagePromoUrl =
        imageUrl + "/promo/" + tenant.tenant_id + "/" + promoID;

      const file = inputs.files[0];

      new Compressor(file, {
        quality: 0.5,

        success(result) {
          let formData = new FormData();

          formData.append("promo", result, result.name);

          fetch(imagePromoUrl, {
            method: "POST",
            body: formData,
          })
            .then((response) => response.json())
            .then((result) => {})
            .catch((error) => {
              console.error("Error Upload Logo:", error);
            });
        },
      });

      const url = promoUrl + "/edit/" + tenant.tenant_id + "/" + promoID;
      const payload = JSON.stringify({
        promo_name: promoName,
        promo_start: startDate,
        promo_end: endDate,
        promo_details: promoDetails,
        promo_image:
          imageUrl +
          "/promo/render/" +
          tenant.tenant_id +
          "/" +
          promoID +
          ".jpg",
      });

      fetch(url, {
        method: "POST",
        body: payload,
        headers: { "content-type": "application/JSON" },
      })
        .then((response) => response.json())
        .then((result) => {
          if (socket) {
            setPromoEditNotif(true);
            setTimeout(() => {
              setPromoEditNotif(false);
            }, 3000);
            socket.emit("update promo", result.data);
            setPromoData([result.data]);
            setPromoRetrieved(() => true);
          }
        });
    }
  }

  async function HandleCreatePromo() {
    var input = document.querySelector('input[type="file"]');
    // console.log("inputssss",input)
    const url = promoUrl + "/create/" + tenant.tenant_id;
    setPromoAddNotif(true);
    setTimeout(() => {
      setPromoAddNotif(false);
    }, 3000);

    setpromobanneropen(false);
    
    const payload = JSON.stringify({
      promo_name: promoName,
      promo_start: startDate,
      promo_end: endDate,
      promo_details: promoDetails,
    });

    fetch(url, {
      method: "POST",
      body: payload,
      headers: { "content-type": "application/JSON" },
    })
      .then((response) => response.json())
      .then((result) => {
        let length = result.data.length - 1;

        const imagePromoUrl =
          imageUrl +
          "/promo/" +
          tenant.tenant_id +
          "/" +
          result.data[length].id;
        // var input = document.querySelector('input[type="file"]');

        const file = input.files[0];
        new Compressor(file, {
          quality: 0.5,

          success(result) {
            let formData = new FormData();

            formData.append("promo", result, result.name);

            fetch(imagePromoUrl, {
              method: "POST",
              body: formData,
            })
              .then((response) => response.json())
              .then((result) => {})
              .catch((error) => {
                console.error("Error Upload Logo:", error);
              });
          },
        });

        const url =
          promoUrl + "/edit/" + tenant.tenant_id + "/" + result.data[length].id;
        const payload2 = JSON.stringify({
          promo_image:
            imageUrl +
            "/promo/render/" +
            tenant.tenant_id +
            "/" +
            result.data[length].id +
            ".jpg",
        });

        fetch(url, {
          method: "POST",
          body: payload2,
          headers: { "content-type": "application/JSON" },
        })
          .then((response) => response.json())
          .then((result) => {
            if (socket) {
              socket.emit("update promo", result.data);
              setPromoData([result.data]);
              setPromoRetrieved(() => true);
            }
          });


        setPromoImage();
        setPromoName();
        setPromoDetails();
        setStartDate();
        setEndDate();
      });
  }

  async function HandleDeletePromo(ID) {
    setPromoID();
    setPromoName();
    setRemovePromoBanner(false);
    const url = promoUrl + "/delete/" + tenant.tenant_id + "/" + ID;

    setPromoRemoveNotif(true);
    setTimeout(() => {
      setPromoRemoveNotif(false);
    }, 3000);

    fetch(url, {
      method: "POST",
      headers: { "content-type": "application/JSON" },
    })
      .then((response) => response.json())
      .then((result) => {
        if (socket) {
          setPromoData([result.data]);

          socket.emit("delete promo", result.data);
        }
      });
  }

  function PromoModal() {
    return (
      <Modal open={promobanneropen} style={{ zoom:'70%' }}>
        <Box className="promomodalbox">
          <div className="innerbox">
            <div className="modaltitle">Promo Banner</div>
            <div className="modalform">
              <form>
                <div className="promoinputimage">
                  <div className="promoinputlabel">
                    Product Picture (Recommended Size: 374x110)
                  </div>
                  <div className="promopreview">
                    <img src={promoImage} className="promobannerimage" />
                  </div>
                  <div className="promobannerbuttoncontainer">
                    <div
                      className="promoimagebutton"
                      style={{ background: profileColor }}
                    >
                      <label html-for="file-input">
                        <FontAwesomeIcon
                          icon={faPencil}
                          className="promoinput"
                        />
                      </label>
                      <input
                        id="file-input"
                        type="file"
                        name="promo"
                        accept=".png, .jpg, .jpeg"
                        style={{ background: profileColor }}
                        className="promoinputfile"
                        onChange={imageHandler}
                      />
                    </div>
                  </div>
                </div>

                <div className="promoinputlabel">Promo Banner Name</div>
                <input
                  type="text"
                  name="promoName"
                  defaultValue={promoName}
                  className="promotextinputfile"
                  onChange={(e) => setPromoName(e.target.value)}
                />
                <div className="promoinputlabel">Promo Period</div>
                <div className="promoperiodecontainer">
                  <div className="periodeinputlabel">Start</div>
                  <DatePicker
                    format="ddd, DD MMM "
                    value={startDate}
                    arrow={false}
                    editable={false}
                    onChange={(value) => {
                      setStartDate(new Date(value));
                    }}
                  />

                  <div className="periodeinputlabel"> &nbsp; End</div>
                  <DatePicker
                    format="ddd, DD MMM "
                    value={endDate}
                    arrow={false}
                    editable={false}
                    onChange={(value) => {
                      setEndDate(new Date(value));
                    }}
                  />
                </div>
                {endDate <= startDate ? (
                  <div
                    style={{
                      marginTop: "-15px",
                      marginBottom: "10px",
                      color: "#df3030",
                    }}
                  >
                    Please choose the right end date
                  </div>
                ) : (
                  <div style={{ marginBottom: "10px" }}></div>
                )}
                <div className="promoinputlabel">Promo Detail</div>
                <textarea
                  type="text"
                  defaultValue={promoDetails}
                  className="promodetailinputfile"
                  onChange={(e) => setPromoDetails(e.target.value)}
                />
              </form>
            </div>

            <div className="promomodalbutton">
              <button
                onClick={() => {
                  setpromobanneropen(false);
                  setPromoImage();
                  setPromoName();
                  setPromoDetails();
                  setStartDate();
                  setEndDate();
                }}
                style={{ color: profileColor }}
                className="cancelbutton"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  promoImage == undefined ||
                  promoName == undefined ||
                  promoName == "" ||
                  promoDetails == undefined ||
                  promoDetails == "" ||
                  startDate == undefined ||
                  endDate == undefined
                    ? true
                    : false
                }
                onClick={
                  bannerType == "Add" ? HandleCreatePromo : HandleEditPromo
                }
                style={
                  promoImage == undefined ||
                  promoName == undefined ||
                  promoName == "" ||
                  promoDetails == undefined ||
                  promoDetails == "" ||
                  startDate == undefined ||
                  endDate == undefined
                    ? { background: "#c4c4c4" }
                    : { background: profileColor }
                }
                className="savebutton"
              >
                Save Promo
              </button>
            </div>
          </div>
        </Box>
      </Modal>
    );
  }

  function RemovePromoModal() {
    return (
      <Modal open={removepromobanner}>
        <Box className="removecatpromomodalbox">
          <div className="removecatinnerbox">
            <div className="removecatheading">
              <img src={removecat} className="removecatimage" />
              <div
                className="removecatmodaltitle"
                style={{ color: profileColor }}
              >
                Remove Promo
              </div>
            </div>
            <div className="removecatmodaltext">
              Are you sure to remove the
              <span style={{ color: profileColor }}>"{promoName}"</span> promo?
            </div>

            <div className="removecatmodalbuttoncontainer">
              <div>
                <button
                  className="modalcancelbutton"
                  onClick={() => {
                    setRemovePromoBanner(false);
                    setPromoID();
                    setPromoName();
                  }}
                >
                  Cancel
                </button>
              </div>
              <div>
                <button
                  style={{ background: profileColor }}
                  className="modalconfirmbutton"
                  onClick={() => HandleDeletePromo(promoID)}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </Box>
      </Modal>
    );
  }

  function handleTypeBanner(type){
    setBtnType(type)
    if(type == "active"){
      const date = new Date()
      const filteredBanner = filteredData[0].filter((e) => Date.parse(e.endingPeriod) > Date.parse(date))
      setPromoData([filteredBanner]);
      console.log("fffff",filteredBanner,Date.parse(date))
    }else if(type == "in-active"){
      const date = new Date()
      const filteredBanner = filteredData[0].filter((e) => Date.parse(e.endingPeriod) < Date.parse(date))
      setPromoData([filteredBanner])
    }
  }

  return (
    <div className="container">
      <div className="topbar">
        <div className="left" style={{ color: profileColor }}>
          Promo Banner
        </div>

        <TopBar />
      </div>

      <div onClick={() => history.push("/orderstatus")}>
        <ToastContainer />
      </div>

      {promoRetrieved ? (
        promoData.length != 0 ? (
          <>
            <div className="containertypebannertab">
              <button style={btnType == "active" ? { background: profileColor, color: "#fff", border: "1px solid #fff" } : { background: "#fff", border: `1px solid ${profileColor}`, color: profileColor }} onClick={()=>handleTypeBanner("active")} className="buttontypebanner">Active</button>
              <button style={btnType == "in-active" ? { background: profileColor, color: "#fff", border: "1px solid #fff" } : { background: "#fff", border: `1px solid ${profileColor}`, color: profileColor }} onClick={()=>handleTypeBanner("in-active")} className="buttontypebanner">In-Active</button>
            </div>
            <div className="promocontainer">
              <div
                style={{ background: profileColor }}
                className={
                  promoaddnotif || promoeditnotif || promoremovenotif
                    ? "promonotification"
                    : "hidden"
                }
              >
                <div className="notificationtextcontainer">
                  <div className="notificationtext">
                    {promoaddnotif
                      ? "Promo Added"
                      : promoeditnotif
                      ? "Promo Edited"
                      : "Promo Removed"}
                  </div>
                </div>

                <div className="notificationclose">
                  <button
                    className="notifclosebutton"
                    onClick={handlenotification}
                  >
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                </div>
              </div>

              <div className="form">
                {PromoModal()}
                {RemovePromoModal()}
                {promoRetrieved == true &&
                  promoData.map((post) => {
                    console.log("cekkk",post)
                    return post.map((item, index) => {
                      const endDate = new Date(item.endingPeriod);

                      return (
                        <div className="promoform" key={index}>
                          <div className="insidepromoform">
                            <div className="left-column">
                              <div className="promopreview" key={index}>
                                <img
                                  src={item.promoImage + "?time" + new Date()}
                                  className="bannerimage"
                                />
                              </div>
                            </div>
                            <div className="right-column">
                              <div
                                className="promotitle"
                                style={{ color: profileColor }}
                              >
                                {item.name}
                              </div>
                              <div className="promotext">
                                Promo ends at
                                <span
                                  className="promodate"
                                  style={{ color: profileColor }}
                                >
                                  {endDate.toLocaleDateString(
                                    "en-ID",
                                    dateOptions
                                  )}
                                  , 23:55 PM
                                </span>
                              </div>
                              <div className="promotext2">
                                Promo info
                                <div className="promoinfo">{item.details}</div>
                              </div>

                              <div className="promobutton">
                                <button
                                  className="buttonpromoedit"
                                  style={{ background: profileColor }}
                                  onClick={() => {
                                    setpromobanneropen(() => true);
                                    setPromoImage(() => item.promoImage);
                                    setPromoID(() => item.id);
                                    setPromoName(() => item.name);
                                    setStartDate(() => item.startingPeriod);
                                    setEndDate(() => item.endingPeriod);
                                    setPromoDetails(() => item.details);
                                    setBannerType(() => "Edit");
                                  }}
                                >
                                  Edit Promo Banner
                                </button>

                                <div className="buttontext">
                                  or
                                  <button
                                    type="button"
                                    style={{ color: profileColor }}
                                    className="buttonremove"
                                    onClick={() => {
                                      setRemovePromoBanner(true);
                                      setPromoID(() => item.id);
                                      setPromoName(() => item.name);
                                    }}
                                  >
                                    Remove Promo Banner
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    });
                  })}
              </div>

              <div className="addpromobutton">
                <button
                  style={{ background: profileColor }}
                  className="buttonadd"
                  type="button"
                  onClick={() => {
                    setpromobanneropen(() => true);
                    setBannerType(() => "Add");
                  }}
                >
                  + Add New Promo
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="form">
            {PromoModal()}
            <div className="addpromobutton">
              <button
                style={{ background: profileColor }}
                className="buttonadd"
                type="button"
                onClick={() => {
                  setpromobanneropen(true);
                  setBannerType("Add");
                }}
              >
                + Add New Promo
              </button>
            </div>
          </div>
        )
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

export default connect(mapStateToProps)(PromoPage);
