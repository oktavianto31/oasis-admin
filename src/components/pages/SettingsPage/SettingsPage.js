import React, { useState, useEffect, useContext, useRef } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { connect } from "react-redux";
import { BlockPicker } from "./colorpalette/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faPencil,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { useNeonCheckboxStyles } from "./checkbox/index";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import ExpandMoreRoundedIcon from "@material-ui/icons/ExpandMoreRounded";
import { useOutlineSelectStyles } from "./select2/index";
import { useTimeSelectStyles } from "./select1/index";
import TopBar from "../TopBar/TopBar";
import { SocketContext } from "../../socketContext";
import { sessionService } from "redux-react-session";
import { ThreeDots } from "react-loader-spinner";
import emailjs from "@emailjs/browser";
import Compressor from "compressorjs";
import "./SettingsPage.css";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import addedOrderSound from "../../sounds/order_added_sound.wav"
import waiterCalledSound from "../../sounds/waiter_called_sound.wav"
import clipboardIcon from "../../icons/copy.png";

function SettingsPage({ tenant }) {
  let history = useHistory();
  const form = useRef();
  const localUrl = process.env.REACT_APP_TENANTURL;
  const imageUrl = process.env.REACT_APP_IMAGEURL;

  const [tenantData, setTenantData] = useState([]);
  const [tenantRetrieved, setTenantRetrieved] = useState(false);

  // socket connection
  const socket = useContext(SocketContext);

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
    if (socket) {
      socket.off("add order").on("add order", (data) => handleOrderAdded(data));
      socket.off("add waiter call").on("add waiter call", (data) => handlCallTable(data));
      socket.on("update user", (data) => handleUserUpdated(data));
    }
  });
  
  const [color, setColor] = useState();
  const [profileName, setProfileName] = useState();
  const [profileColor, setProfileColor] = useState();
  const [profileEmail, setProfileEmail] = useState();
  const [helpMessage, setHelpMessage] = useState();
  const [taxchargeedit, setTaxChargeEdit] = useState(false);
  const [servicechargeedit, setServiceChargeEdit] = useState(false);
  const [LocationTextEdit, setLocationTextEdit] = useState(false);
  const [PhoneTextEdit, setPhoneTextEdit] = useState(false);
  const [AddressTextEdit, setAddressTextEdit] = useState(false);
  const [profileImage, setProfileImage] = useState();
  const [taxChargeValue, setTaxChargeValue] = useState();
  const [serviceChargeValue, setServiceChargeValue] = useState();
  const [textAddress, setTextAddress] = useState();
  const [textLocation, setTextLocation] = useState();
  const [textPhone, setTextPhone] = useState();

  useEffect(() => {
    let mounted = true;

    if (mounted) {
      if (tenantRetrieved === true) {
        setProfileName(tenantData[0].name);
        setProfileColor(tenantData[0].profileColor);
        setProfileEmail(tenantData[0].email);
        setTextPhone(tenantData[0].phoneNumber);
        setColor(tenantData[0].profileColor);
        setTextAddress(tenantData[0].address);
        setTextLocation(tenantData[0].location);
        setTaxChargeValue(tenantData[0].taxCharge);
        setServiceChargeValue(tenantData[0].serviceCharge);
        setProfileImage(tenantData[0].profileImage);
      }
    }
    return () => {
      mounted = false;
    };
  }, [tenantRetrieved, tenantData]);

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
      let newData = tenantData.splice();

      newData.push(user);
      setTenantData(newData);
    }
  }

  async function HandleSaveProfile() {
    setEditprofile(false);
    setSettingSavedNotif(true);
    setTimeout(() => {
      setSettingSavedNotif(false);
    }, 3000);

    var input = document.querySelector('input[type="file"]');
    if (input.files[0] == undefined) {
      const editUrl = localUrl + "/edit/" + tenant.tenant_id;

      fetch(editUrl, {
        method: "POST",
        body: JSON.stringify({
          tenant_id: tenant.tenant_id,
          profileName: profileName,
          profileColor: color,
        }),
        headers: { "content-type": "application/JSON" },
      })
        .then((response) => response.json())
        .then((result) => {
          if (socket) {
            socket.emit("update user", result.data);
            sessionService.saveUser(result.data);
          }
        });
    } else {
      const profileUrl = imageUrl + "/avatar/" + tenant.tenant_id;
      const file = input.files[0];
      new Compressor(file, {
        quality: 0.5,

        success(result) {
          let formData = new FormData();

          formData.append("avatar", result, result.name);

          fetch(profileUrl, {
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

      const editUrl = localUrl + "/edit/" + tenant.tenant_id;

      fetch(editUrl, {
        method: "POST",
        body: JSON.stringify({
          tenant_id: tenant.tenant_id,
          profileName: profileName,
          profileColor: color,
          profileImage:
            imageUrl + "/avatar/render/" + tenant.tenant_id + ".jpg",
        }),
        headers: { "content-type": "application/JSON" },
      })
        .then((response) => response.json())
        .then((result) => {
          if (socket) {
            socket.emit("update user", result.data);
            sessionService.saveUser(result.data);
          }
        });
    }
  }

  function HandleSentEmail() {
    setHelpEmail(false);
    setEmailSendNotif(true);
    setTimeout(() => {
      setEmailSendNotif(false);
    }, 3000);

    setHelpMessage();

    emailjs.sendForm(
      process.env.REACT_APP_USER_ID,
      process.env.REACT_APP_TEMPLATE_ID,
      form.current,
      process.env.REACT_APP_PUBLIC_KEY
    );
  }

  async function handleTaxChargeEdit() {
    setTaxChargeEdit(() => !taxchargeedit);

    if (taxchargeedit == true) {
      const url = localUrl + "/edit/taxcharges";

      await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          tenant_id: tenant.tenant_id,
          charges: taxChargeValue,
        }),
        headers: { "content-type": "application/JSON" },
      })
        .then((response) => response.json())
        .then((result) => {
          if (socket) {
            socket.emit("update user", result.data);
          }
        });
    }
  }

  async function handleServiceChargeEdit() {
    setServiceChargeEdit(() => !servicechargeedit);

    if (servicechargeedit == true) {
      const url = localUrl + "/edit/servicecharges";

      await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          tenant_id: tenant.tenant_id,
          charges: serviceChargeValue,
        }),
        headers: { "content-type": "application/JSON" },
      })
        .then((response) => response.json())
        .then((result) => {
          socket.emit("update user", result.data);
        });
    }
  }

  async function imageHandler(e) {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setProfileImage(reader.result);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  }

  async function handleAddressTextEdit() {
    setAddressTextEdit(() => !AddressTextEdit);

    if (textAddress == "") {
      if (tenantData && tenantData[0].address !== "") {
        setTextAddress(tenantData[0].address);
      } else {
        setTextAddress("please input detail address");
      }
    }

    if (AddressTextEdit == true && textAddress !== "") {
      const editUrl = localUrl + "/edit/" + tenant.tenant_id;

      fetch(editUrl, {
        method: "POST",
        body: JSON.stringify({
          address: textAddress,
        }),
        headers: { "content-type": "application/JSON" },
      })
        .then((response) => response.json())
        .then((result) => {
          if (socket) {
            socket.emit("update user", result.data);
          }
        });
    }
  }

  async function handleLocationTextEdit() {
    setLocationTextEdit(() => !LocationTextEdit);

    if (textLocation == "") {
      if (tenantData && tenantData[0].location !== "") {
        setTextLocation(tenantData[0].location);
      } else {
        setTextLocation("please input location");
      }
    }

    if (LocationTextEdit == true && textLocation !== "") {
      const editUrl = localUrl + "/edit/" + tenant.tenant_id;

      fetch(editUrl, {
        method: "POST",
        body: JSON.stringify({
          location: textLocation,
        }),
        headers: { "content-type": "application/JSON" },
      })
        .then((response) => response.json())
        .then((result) => {
          socket.emit("update user", result.data);
        });
    }
  }

  async function handlePhoneTextEdit() {
    setPhoneTextEdit(() => !PhoneTextEdit);

    if (textPhone == "") {
      if (tenantData && tenantData[0].phoneNumber !== "") {
        setTextPhone(tenantData[0].phoneNumber);
      } else {
        setTextPhone("please input phone number");
      }
    }
    if (PhoneTextEdit == true && textPhone !== "") {
      const editUrl = localUrl + "/edit/" + tenant.tenant_id;

      fetch(editUrl, {
        method: "POST",
        body: JSON.stringify({
          phoneNumber: textPhone,
        }),
        headers: { "content-type": "application/JSON" },
      })
        .then((response) => response.json())
        .then((result) => {
          if (socket) {
            socket.emit("update user", result.data);
          }
        });
    }
  }

  const daysInAWeek = [
    {
      name: "Monday",
      initial: "M",
      isSelected: false,
    },
    {
      name: "Tuesday",
      initial: "T",
      isSelected: false,
    },
    {
      name: "Wednesday",
      initial: "W",
      isSelected: false,
    },
    {
      name: "Thursday",
      initial: "T",
      isSelected: false,
    },
    {
      name: "Friday",
      initial: "F",
      isSelected: false,
    },
    {
      name: "Saturday",
      initial: "S",
      isSelected: false,
    },
    {
      name: "Sunday",
      initial: "S",
      isSelected: false,
    },
  ];

  function notification(type){
    if(type === "added"){
      new Audio(addedOrderSound).play()
      toast("Order Added",{ style:{background:`${profileColor}`, color: "#fff", fontWeight: "600"},progressClassName: "progressbar" });
           
    }else if(type === "called"){
      new Audio(waiterCalledSound).play()
      toast.warning("Waiter Called", { style:{background:"#fcd232", color: "#fff", fontWeight: "600"} ,progressClassName: "progressbar" })
    }
  }

  const [OpenTimeEdit, setOpenTimeEdit] = useState(false);

  const [editprofile, setEditprofile] = useState(false);
  const [helpemail, setHelpEmail] = useState(false);
  const [helpcall, setHelpCall] = useState(false);

  const [day, setDay] = useState();
  const [open24hrs, setOpen24hrs] = useState(false);
  const [isclosed, setIsClosed] = useState(false);
  const [opentimehour, setOpenTimeHour] = useState();
  const [opentimeminute, setOpenTimeMinute] = useState();
  const [opentimetf, setOpenTimeTF] = useState();
  const [closedtimehour, setClosedTimeHour] = useState();
  const [closedtimeminute, setClosedTimeMinute] = useState();
  const [closedtimetf, setClosedTimeTF] = useState();
  const [openhouredit, setOpenHourEdit] = useState(false);
  const neonStyles = useNeonCheckboxStyles();

  function handleOpenHourEditOpen(
    day,
    is24hrs,
    isclosed,
    openh,
    openm,
    opentf,
    closeh,
    closem,
    closetf
  ) {
    setOpenHourEdit(true);
    setDay(day);
    setOpen24hrs(is24hrs);
    setIsClosed(isclosed);
    setOpenTimeHour(openh);
    setOpenTimeMinute(openm);
    setOpenTimeTF(opentf);
    setClosedTimeHour(closeh);
    setClosedTimeMinute(closem);
    setClosedTimeTF(closetf);
  }

  function DateAndTimeModal() {
    const [daysSelected, setDaysSelected] = useState([]);
    const url = localUrl + "/edit/openinghours/" + tenant.tenant_id;

    function handlesavehour() {
      function verifyTime() {
        if (closedtimetf == opentimetf) {
          if (closedtimehour == opentimehour) {
            if (closedtimeminute <= opentimeminute) {
              return false;
            }
          } else if (closedtimehour < opentimehour) {
            return false;
          }
        } else if (closedtimetf == "AM" && opentimetf == "PM") {
          return false;
        } else {
          return true;
        }
      }

      if (verifyTime) {
        setOpenHourEdit((state) => !state);
        daysSelected.map((item, index) => {
          const payload = JSON.stringify({
            day: item,
            is24Hours: open24hrs,
            isClosed: isclosed,
            OpenHour: opentimehour,
            OpenMins: opentimeminute,
            OpenTF: opentimetf,
            CloseHour: closedtimehour,
            CloseMins: closedtimeminute,
            CloseTF: closedtimetf,
          });

          fetch(url, {
            method: "POST",
            body: payload,
            headers: { "content-type": "application/JSON" },
          })
            .then((response) => response.json())
            .then((result) => {
              socket.emit("update user", result.data);
              sessionService.saveUser(result.data);
              setDaysSelected([]);
            });
        });
      }
    }

    function renderButton(item, index) {
      const [selected, setSelected] = useState(false);

      useEffect(() => {
        if (item.name == day) {
          setSelected(true);
          daysSelected.indexOf(item.name) === -1
            ? daysSelected.push(item.name)
            : null;
        }
      }, [day]);

      useEffect(() => {
        if (item.name == daysSelected) {
          setSelected(true);
        }
        if (item.name != daysSelected) {
          setSelected(false);
        }
      }, [daysSelected]);

      return (
        <button
          style={
            selected
              ? {
                  background: profileColor,
                  borderColor: profileColor,
                  color: "#fff",
                }
              : null
          }
          type="button"
          className={selected ? "daysbutton" : "daysbuttonoff"}
          onClick={() => {
            setSelected((state) => !state);
            daysSelected.indexOf(item.name) === -1
              ? daysSelected.push(item.name)
              : daysSelected.splice(daysSelected.indexOf(item.name), 1);
          }}
        >
          {item.initial}
        </button>
      );
    }

    function handle24checked(event) {
      setOpen24hrs((state) => !state);
      if (open24hrs) {
        setIsClosed(() => false);
      }
      if (isclosed) {
        setIsClosed(() => false);
      }
    }

    function handleclosedchecked(event) {
      setIsClosed((state) => !state);
      if (open24hrs) {
        setOpen24hrs(() => false);
      }
      if (isclosed) {
        setOpen24hrs(() => false);
      }
    }

    return (
      <Modal open={openhouredit}>
        <Box className="openhourbox">
          <div className="openhourinnerbox">
            <div className="openhourmodaltitle">Select Days & Time</div>

            <form>
              <div className="openhourinnermodalbox">
                <div className="days">
                  {daysInAWeek.map((item, index) => renderButton(item, index))}
                </div>

                <div className="checkbox">
                  <FormControlLabel
                    control={
                      <Checkbox
                        disableRipple
                        checked={open24hrs}
                        onChange={handle24checked}
                        classes={neonStyles}
                        checkedIcon={<span />}
                        icon={<span />}
                      />
                    }
                    label="24 Hours"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        disableRipple
                        checked={isclosed}
                        onChange={handleclosedchecked}
                        classes={neonStyles}
                        checkedIcon={<span />}
                        icon={<span />}
                      />
                    }
                    label="Closed"
                  />
                </div>

                <div className="time">
                  <div className="opentime">
                    <div
                      className={
                        open24hrs || isclosed ? "timelabel" : "timelabelactive"
                      }
                    >
                      Open Time
                    </div>
                    <div className="timeinputcontainer">
                      <div className="timeinputs">
                        <Select
                          defaultValue={opentimehour}
                          disableUnderline
                          disabled={open24hrs || isclosed ? true : false}
                          classes={
                            open24hrs || isclosed
                              ? { root: timeSelectClasses.selectdisabled }
                              : { root: timeSelectClasses.select }
                          }
                          MenuProps={timemenuProps}
                          value={opentimehour}
                          IconComponent={timeiconComponent}
                          onChange={(e) => setOpenTimeHour(e.target.value)}
                        >
                          <MenuItem value="00">00</MenuItem>
                          <MenuItem value="01">01</MenuItem>
                          <MenuItem value="02">02</MenuItem>
                          <MenuItem value="03">03</MenuItem>
                          <MenuItem value="04">04</MenuItem>
                          <MenuItem value="05">05</MenuItem>
                          <MenuItem value="06">06</MenuItem>
                          <MenuItem value="07">07</MenuItem>
                          <MenuItem value="08">08</MenuItem>
                          <MenuItem value="09">09</MenuItem>
                          <MenuItem value="10">10</MenuItem>
                          <MenuItem value="11">11</MenuItem>
                          <MenuItem value="12">12</MenuItem>
                        </Select>

                        <div
                          className={
                            open24hrs || isclosed
                              ? "semicolon"
                              : "semicolonactive"
                          }
                        >
                          :
                        </div>
                        <Select
                          defaultValue={opentimeminute}
                          disableUnderline
                          disabled={open24hrs || isclosed ? true : false}
                          classes={
                            open24hrs || isclosed
                              ? { root: timeSelectClasses.selectdisabled }
                              : { root: timeSelectClasses.select }
                          }
                          MenuProps={timemenuProps}
                          value={opentimeminute}
                          IconComponent={timeiconComponent}
                          onChange={(e) => setOpenTimeMinute(e.target.value)}
                        >
                          <MenuItem value="00">00</MenuItem>
                          <MenuItem value="05">05</MenuItem>
                          <MenuItem value="10">10</MenuItem>
                          <MenuItem value="15">15</MenuItem>
                          <MenuItem value="20">20</MenuItem>
                          <MenuItem value="25">25</MenuItem>
                          <MenuItem value="30">30</MenuItem>
                          <MenuItem value="35">35</MenuItem>
                          <MenuItem value="40">40</MenuItem>
                          <MenuItem value="45">45</MenuItem>
                          <MenuItem value="50">50</MenuItem>
                          <MenuItem value="55">55</MenuItem>
                        </Select>
                      </div>
                      <div className="timeselector">
                        <Select
                          defaultValue={opentimetf}
                          disableUnderline
                          disabled={open24hrs || isclosed ? true : false}
                          classes={
                            open24hrs || isclosed
                              ? { root: outlineSelectClasses.selectdisabled }
                              : { root: outlineSelectClasses.select }
                          }
                          MenuProps={menuProps}
                          value={opentimetf}
                          IconComponent={iconComponent}
                          onChange={(e) => setOpenTimeTF(e.target.value)}
                        >
                          <MenuItem value="AM">AM</MenuItem>
                          <MenuItem value="PM">PM</MenuItem>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <div className="closetime">
                    <div
                      className={
                        open24hrs || isclosed ? "timelabel" : "timelabelactive"
                      }
                    >
                      Closed Time
                    </div>
                    <div className="timeinputcontainer">
                      <div className="timeinputs">
                        <Select
                          defaultValue={closedtimehour}
                          disableUnderline
                          disabled={open24hrs || isclosed ? true : false}
                          classes={
                            open24hrs || isclosed
                              ? { root: timeSelectClasses.selectdisabled }
                              : { root: timeSelectClasses.select }
                          }
                          MenuProps={timemenuProps}
                          value={closedtimehour}
                          IconComponent={timeiconComponent}
                          onChange={(e) => setClosedTimeHour(e.target.value)}
                        >
                          <MenuItem value="00">00</MenuItem>
                          <MenuItem value="01">01</MenuItem>
                          <MenuItem value="02">02</MenuItem>
                          <MenuItem value="03">03</MenuItem>
                          <MenuItem value="04">04</MenuItem>
                          <MenuItem value="05">05</MenuItem>
                          <MenuItem value="06">06</MenuItem>
                          <MenuItem value="07">07</MenuItem>
                          <MenuItem value="08">08</MenuItem>
                          <MenuItem value="09">09</MenuItem>
                          <MenuItem value="10">10</MenuItem>
                          <MenuItem value="11">11</MenuItem>
                          <MenuItem value="12">12</MenuItem>
                        </Select>

                        <div
                          className={
                            open24hrs
                              ? isclosed
                                ? "semicolonactive"
                                : "semicolon"
                              : "semicolon"
                          }
                        >
                          :
                        </div>
                        <Select
                          defaultValue={closedtimeminute}
                          disableUnderline
                          disabled={open24hrs || isclosed ? true : false}
                          classes={
                            open24hrs || isclosed
                              ? { root: timeSelectClasses.selectdisabled }
                              : { root: timeSelectClasses.select }
                          }
                          MenuProps={timemenuProps}
                          value={closedtimeminute}
                          IconComponent={timeiconComponent}
                          onChange={(e) => setClosedTimeMinute(e.target.value)}
                        >
                          <MenuItem value="00">00</MenuItem>
                          <MenuItem value="05">05</MenuItem>
                          <MenuItem value="10">10</MenuItem>
                          <MenuItem value="15">15</MenuItem>
                          <MenuItem value="20">20</MenuItem>
                          <MenuItem value="25">25</MenuItem>
                          <MenuItem value="30">30</MenuItem>
                          <MenuItem value="35">35</MenuItem>
                          <MenuItem value="40">40</MenuItem>
                          <MenuItem value="45">45</MenuItem>
                          <MenuItem value="50">50</MenuItem>
                          <MenuItem value="55">55</MenuItem>
                        </Select>
                      </div>
                      <div className="timeselector">
                        <Select
                          defaultValue={closedtimetf}
                          disableUnderline
                          disabled={open24hrs || isclosed ? true : false}
                          classes={
                            open24hrs || isclosed
                              ? { root: outlineSelectClasses.selectdisabled }
                              : { root: outlineSelectClasses.select }
                          }
                          MenuProps={menuProps}
                          value={closedtimetf}
                          IconComponent={iconComponent}
                          onChange={(e) => setClosedTimeTF(e.target.value)}
                        >
                          <MenuItem value="AM">AM</MenuItem>
                          <MenuItem value="PM">PM</MenuItem>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
            <div className="openhourmodalbutton">
              <button
                style={{ color: profileColor }}
                onClick={() => {
                  setDay();
                  setOpenHourEdit((state) => !state);
                  setDaysSelected([]);
                }}
                className="cancelbutton"
              >
                Cancel
              </button>

              <button
                style={{ background: profileColor }}
                type="submit"
                onClick={handlesavehour}
                className="savebutton"
              >
                Save
              </button>
            </div>
          </div>
        </Box>
      </Modal>
    );
  }

  //select inputs

  const timeSelectClasses = useTimeSelectStyles();
  const outlineSelectClasses = useOutlineSelectStyles();

  // moves the menu below the select input
  const timemenuProps = {
    classes: {
      paper: timeSelectClasses.paper,
      list: timeSelectClasses.list,
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

  const timeiconComponent = (props) => {
    return (
      <ExpandMoreRoundedIcon
        className={props.className + " " + timeSelectClasses.icon}
      />
    );
  };

  const iconComponent = (props) => {
    return (
      <ExpandMoreRoundedIcon
        className={
          open24hrs
            ? isclosed
              ? props.className + " " + outlineSelectClasses.icondisabled
              : props.className + " " + outlineSelectClasses.icondisabled
            : props.className + " " + outlineSelectClasses.icon
        }
      />
    );
  };

  const [settingsavednotif, setSettingSavedNotif] = useState(false);
  const [emailsendnotif, setEmailSendNotif] = useState(false);
  function handlenotification() {
    if (settingsavednotif || emailsendnotif) {
      setSettingSavedNotif(false);
      setEmailSendNotif(false);
    }
  }

  return (
    <div className="container">
      <div className="topbar">
        <div className="left" style={{ color: profileColor }}>
          Settings
        </div>

        <TopBar />
      </div>

      <div onClick={() => history.push("/orderstatus")}>
        <ToastContainer />
      </div>

      {DateAndTimeModal()}

      <Modal open={editprofile}>
        <Box className="editprofilebox">
          <div className="editprofileinnerbox">
            <div className="editprofilemodaltitle">Edit Profile</div>

            <form>
              <div className="editprofileinnermodalbox">
                <div className="editprofileleftmodalcolumn">
                  <div className="profileinputtext">
                    <div className="editprofileinputlabel">Restaurant Name</div>
                    <div className="inputtext">
                      <input type="text" className="editprofileinputfile" defaultValue={profileName} onChange={(e) => setProfileName(e.target.value)} />
                    </div>
                    <div className="editprofileinputlabel">Profile Color</div>

                    <div className="colorpaletteselector">
                      <BlockPicker
                        color={color}
                        onChange={(color) => {
                          setColor(color.hex);
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="rightmodalcolumn">
                  <div className="editprofileinputimage">
                    <div className="editprofileinputlabel">Product Picture</div>
                    <div className="editprofileimagecontainer">
                      <img
                        src={profileImage}
                        // src={profileImage + "?time" + new Date()}
                        className="editprofileimage"
                      />
                    </div>
                    <div className="editprofileimagebuttoncontainer">
                      <div className="imagebuttoncontainer">
                        <div className="promoimagebutton" style={{ background: profileColor }}>
                          <label htmlFor="file-input">
                            <FontAwesomeIcon icon={faPencil} className="promoinput" />
                          </label>

                          <input id="file-input" type="file" name="avatar" accept=".png, .jpg, .jpeg" className="productinputfile" onChange={imageHandler} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
            <div className="editprofilemodalbutton">
              <button style={{ color: profileColor }} onClick={() => setEditprofile(false)} className="cancelbutton">
                Cancel
              </button>

              <button style={{ background: profileColor }} type="submit" onClick={HandleSaveProfile} className="savebutton">
                Save Profile
              </button>
            </div>
          </div>
        </Box>
      </Modal>

      <Modal open={helpemail}>
        <Box className="helpbox">
          <div className="editprofileinnerbox">
            <div className="editprofilemodaltitle">Send Email</div>

            <form ref={form}>
              <div className="helpinnermodalbox">
                <div className="profileinputtext">
                  <div className="editprofileinputlabel">Restaurant Name</div>
                  <div className="inputtext">
                    <input type="text" name="from_name" className="editprofileinputfile" defaultValue={profileName} onChange={(e) => setProfileName(e.target.value)} readOnly />
                  </div>
                  <div className="editprofileinputlabel">Email address</div>
                  <div className="inputtext">
                    <input type="email" name="user_email" className="editprofileinputfile" defaultValue={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} readOnly />
                  </div>
                </div>
                <div className="editprofileinputlabel">Message</div>
                <div className="inputtext">
                  <textarea type="text" name="message" className="messageinput" defaultValue={helpMessage} onChange={(e) => setHelpMessage(e.target.value)} />
                </div>
                <input type="text" name="tenant_id" defaultValue={tenant.tenant_id} style={{ visibility: "hidden" }} />
              </div>
            </form>
            <div className="editprofilemodalbutton">
              <button style={{ color: profileColor }} onClick={() => setHelpEmail(false)} className="cancelbutton">
                Cancel
              </button>

              <button style={{ background: profileColor }} type="submit" onClick={HandleSentEmail} className="savebutton">
                Send
              </button>
            </div>
          </div>
        </Box>
      </Modal>

      <Modal open={helpcall}>
        <Box className="editprofilebox">
          <div className="editprofileinnerbox">
            <div className="editprofilemodaltitle">Edit Profile</div>

            <form>
              <div className="editprofileinnermodalbox">
                <div className="editprofileleftmodalcolumn">
                  <div className="profileinputtext">
                    <div className="editprofileinputlabel">Restaurant Name</div>
                    <div className="inputtext">
                      <input type="text" className="editprofileinputfile" defaultValue={profileName} onChange={(e) => setProfileName(e.target.value)} />
                    </div>
                    <div className="editprofileinputlabel">Profile Color</div>

                    <div className="colorpaletteselector">
                      <BlockPicker
                        color={color}
                        onChange={(color) => {
                          setColor(color.hex);
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="rightmodalcolumn">
                  <div className="editprofileinputimage">
                    <div className="editprofileinputlabel">Product Picture</div>
                    <div className="editprofileimagecontainer">
                      <img
                        src={profileImage}
                        // src={profileImage + "?time" + new Date()}
                        className="editprofileimage"
                      />{" "}
                      <div className="tenantidsetting">{tenant.tenant_id}</div>
                    </div>
                    <div className="editprofileimagebuttoncontainer">
                      <div className="imagebuttoncontainer">
                        <div className="promoimagebutton" style={{ background: profileColor }}>
                          <label htmlFor="file-input">
                            <FontAwesomeIcon icon={faPencil} className="promoinput" />
                          </label>

                          <input id="file-input" type="file" name="avatar" accept=".png, .jpg, .jpeg" className="productinputfile" onChange={imageHandler} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
            <div className="editprofilemodalbutton">
              <button style={{ color: profileColor }} onClick={() => setEditprofile(false)} className="cancelbutton">
                Cancel
              </button>

              <button style={{ background: profileColor }} type="submit" onClick={HandleSaveProfile} className="savebutton">
                Save Profile
              </button>
            </div>
          </div>
        </Box>
      </Modal>

      {tenantRetrieved ? (
        <div className="settingsoutercontainer">
          <div style={{ background: profileColor }} className={settingsavednotif || emailsendnotif ? "settingsnotification" : "hidden"}>
            <div className="notificationtextcontainer">
              <div className="notificationtext">{emailsendnotif ? "Email Sent" : "Settings Saved"}</div>
            </div>

            <div className="notificationclose">
              <button className="notifclosebutton" onClick={handlenotification}>
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
          </div>

          <div className="settingscontainer">
            <div className="settingsheader">
              <div className="headertext">Profile</div>
              <div className="settingscontent">
                <div className="profilesettings">
                  <div className="profilecontainer">
                    <div className="profileimg">
                      <img
                        className="profilelogo"
                        // src={profileImage}
                        src={profileImage + "?time" + new Date()}
                      />
                    </div>
                    <div className="profilename">
                      <div className="restaurantname">{profileName}</div>
                      <div className="profilecolor">
                        <div className="profilecolortext">Profile color: </div>
                        <div className="profilecolorimg" style={{ background: color }}></div>
                      </div>
                    </div>
                    <div className="editprofile">
                      <button style={{ background: profileColor }} className="editprofilebutton" onClick={() => setEditprofile(true)}>
                        Edit Profile
                      </button>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "end" }}>
                    <div style={{ marginRight: "10px" }} className="tenantidsetting">
                      {tenant.tenant_id}
                    </div>
                    <button style={{ backgroundColor: "transparent", border:"none", cursor:"pointer" }} onClick={() => navigator.clipboard.writeText(tenant.tenant_id)}>
                      <img src={clipboardIcon} height={22} />
                    </button>
                  </div>

                  <div className="profilecontainer2">
                    <div className="profileaddressheader">
                      <div className="profiletitle">Phone Number</div>
                      <div className="editcontainer">
                        <button
                          style={
                            PhoneTextEdit
                              ? {
                                  borderColor: profileColor,
                                  color: profileColor,
                                }
                              : { background: profileColor }
                          }
                          className={PhoneTextEdit ? "editbuttoncontainer" : "editbuttoncontaineractive"}
                          type="button"
                          onClick={() => handlePhoneTextEdit()}
                        >
                          {PhoneTextEdit ? "Save" : "Edit"}
                        </button>
                      </div>
                    </div>

                    <form>
                      {tenantRetrieved == true && (
                        <input
                          disabled={PhoneTextEdit ? false : true}
                          value={textPhone}
                          className={PhoneTextEdit ? "profilelocationactive" : "profilelocation"}
                          type="text"
                          onClick={() => setTextPhone("")}
                          onChange={(e) => setTextPhone(e.target.value)}
                        />
                      )}
                    </form>

                    <div className="profileaddressheader">
                      <div className="profiletitle">Location</div>
                      <div className="editcontainer">
                        <button
                          style={
                            LocationTextEdit
                              ? {
                                  borderColor: profileColor,
                                  color: profileColor,
                                }
                              : { background: profileColor }
                          }
                          className={LocationTextEdit ? "editbuttoncontainer" : "editbuttoncontaineractive"}
                          type="button"
                          onClick={() => handleLocationTextEdit()}
                        >
                          {LocationTextEdit ? "Save" : "Edit"}
                        </button>
                      </div>
                    </div>
                    <form>
                      {tenantRetrieved == true && (
                        <textarea
                          disabled={LocationTextEdit ? false : true}
                          value={textLocation}
                          className={LocationTextEdit ? "profilelocationactive" : "profilelocation"}
                          onClick={() => setTextLocation("")}
                          onChange={(e) => setTextLocation(e.target.value)}
                        />
                      )}
                    </form>

                    <div className="profileaddressheader">
                      <div className="profiletitle">Address</div>
                      <div className="editcontainer">
                        <button
                          style={
                            AddressTextEdit
                              ? {
                                  borderColor: profileColor,
                                  color: profileColor,
                                }
                              : { background: profileColor }
                          }
                          className={AddressTextEdit ? "editbuttoncontainer" : "editbuttoncontaineractive"}
                          type="button"
                          onClick={() => handleAddressTextEdit()}
                        >
                          {AddressTextEdit ? "Save" : "Edit"}
                        </button>
                      </div>
                    </div>
                    <form>
                      {tenantRetrieved == true && (
                        <textarea
                          disabled={AddressTextEdit ? false : true}
                          value={textAddress}
                          className={AddressTextEdit ? "profileaddressactive" : "profileaddress"}
                          onClick={() => setTextAddress("")}
                          onChange={(e) => setTextAddress(e.target.value)}
                        />
                      )}
                    </form>

                    <div className="profileopenheader">
                      <div className="profiletitle">Opening Hour</div>
                      <div className="editcontainer">
                        <button
                          style={
                            OpenTimeEdit
                              ? {
                                  borderColor: profileColor,
                                  color: profileColor,
                                }
                              : { background: profileColor }
                          }
                          className={OpenTimeEdit ? "editbuttoncontainer" : "editbuttoncontaineractive"}
                          type="button"
                          onClick={() => setOpenTimeEdit((state) => !state)}
                        >
                          {OpenTimeEdit ? "Save" : "Edit"}
                        </button>
                      </div>
                    </div>

                    <div className="profileopen">
                      {tenantRetrieved == true &&
                        tenantData[0].openingDays.map((item, index) => {
                          return (
                            <div className="opentext">
                              <div className="openleft">{item.day}</div>
                              <div className="openright">
                                {item.is24Hours ? (
                                  "Open 24 hours"
                                ) : item.isClosed ? (
                                  "Closed"
                                ) : (
                                  <>
                                    {item.OpenHour}:{item.OpenMins}&nbsp;
                                    {item.OpenTF}&nbsp;-&nbsp;
                                    {item.CloseHour}:{item.CloseMins}&nbsp;
                                    {item.CloseTF}
                                  </>
                                )}
                                <FontAwesomeIcon
                                  style={{ color: profileColor }}
                                  icon={faPencil}
                                  className={OpenTimeEdit ? "edithouricon" : "hidden"}
                                  onClick={() => {
                                    handleOpenHourEditOpen(item.day, item.is24Hours, item.isClosed, item.OpenHour, item.OpenMins, item.OpenTF, item.CloseHour, item.CloseMins, item.CloseTF);
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="settingsinsidegrid">
              <div className="taxandservicecontainer">
                <div className="headertext">Tax & Service Charge</div>
                <div className="taxsettings">
                  <div className="taxcontents">
                    <div className="taxtext">Tax Charge</div>
                    <div className="taxdetails">
                      <div
                        className="percentagetext"
                        style={
                          taxchargeedit
                            ? {
                                border: "1px solid #424242",
                                color: "#424242",
                                background: "transparent",
                              }
                            : { background: profileColor }
                        }
                      >
                        {tenantRetrieved && (
                          <div>
                            <input
                              onKeyPress={(event) => {
                                if (!/[0-9]/.test(event.key)) {
                                  event.preventDefault();
                                }
                              }}
                              type="number"
                              className="percentageinput"
                              style={taxchargeedit ? { color: "#424242" } : null}
                              disabled={taxchargeedit == true ? false : true}
                              defaultValue={taxChargeValue}
                              onChange={(e) => {
                                e.target.value < 0 ? setTaxChargeValue(e.target.value * -1) : setTaxChargeValue(e.target.value);
                              }}
                            />
                            %
                          </div>
                        )}
                      </div>
                      <div className="taxedit">
                        <button style={{ color: profileColor }} type="button" className="taxeditbutton" onClick={handleTaxChargeEdit}>
                          {taxchargeedit ? "Save" : "Edit"}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="taxcontents">
                    <div className="taxtext">Service Charge</div>
                    <div className="taxdetails">
                      <div
                        className="percentagetext"
                        style={
                          servicechargeedit
                            ? {
                                border: "1px solid #424242",
                                color: "#424242",
                                background: "transparent",
                              }
                            : { background: profileColor }
                        }
                      >
                        <input
                          onKeyPress={(event) => {
                            if (!/[0-9]/.test(event.key)) {
                              event.preventDefault();
                            }
                          }}
                          type="number"
                          className="percentageinput"
                          style={servicechargeedit ? { color: "#424242" } : null}
                          disabled={servicechargeedit == true ? false : true}
                          defaultValue={serviceChargeValue}
                          onChange={(e) => (e.target.value < 0 ? setServiceChargeValue(e.target.value * -1) : setServiceChargeValue(e.target.value))}
                        />
                        %
                      </div>
                      <div className="taxedit">
                        <button style={{ color: profileColor }} type="button" className="taxeditbutton" onClick={handleServiceChargeEdit}>
                          {servicechargeedit ? "Save" : "Edit"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="helpcontainer">
                <div className="headertext">Help</div>
                <div className="helpsettings">
                  <div className="helpcontents">
                    <div className="helptext">If you need help, you can contact our management at the button below</div>
                    <div style={{ width: "90%" }}>
                      <div className="helpbuttoncontainer">
                        <button style={{ background: profileColor }} onClick={() => setHelpEmail(true)} className="helpbutton">
                          <FontAwesomeIcon className="helpicons" icon={faEnvelope} />
                          Email
                        </button>
                        {/* <button
                          style={{ background: profileColor }}
                          onClick={()=>setHelpCall(true)}
                          className="helpbutton2"
                        >
                          <FontAwesomeIcon
                            className="helpicons"
                            icon={faPhone}
                          />
                          Call
                        </button> */}
                      </div>
                    </div>
                  </div>
                </div>
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

function mapStateToProps({ session }) {
  return { tenant: session.user };
}

export default connect(mapStateToProps)(SettingsPage);
