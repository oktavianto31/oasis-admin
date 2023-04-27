import React, { useState, useEffect, useContext } from "react";
import NumberFormat from "react-number-format";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faAngleUp,
  faXmark,
  faMinus,
  faPlus,
  faPencil,
} from "@fortawesome/free-solid-svg-icons";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Switch from "@material-ui/core/Switch";
import { useIosSwitchStyles } from "./switch/index";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import ExpandMoreRoundedIcon from "@material-ui/icons/ExpandMoreRounded";
import { connect } from "react-redux";
import { useMinimalSelectStyles } from "./select/index";
import TopBar from "../TopBar/TopBar";
import { ThreeDots } from "react-loader-spinner";
import { SocketContext } from "../../socketContext";
import { debounce } from "lodash";
import Compressor from "compressorjs";
import recommended from "../../icons/Recommend.png";
import removecat from "../../icons/RemoveCat.svg";
import "../TopBar/TopBar.css";
import "./InventoryPage.css";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import addedOrderSound from "../../sounds/order_added_sound.wav"
import waiterCalledSound from "../../sounds/waiter_called_sound.wav"

const UP = -1;
const DOWN = 1;

function InventoryPage({ tenant }) {
  const inventoryUrl = process.env.REACT_APP_MENUURL;
  const imageUrl = process.env.REACT_APP_IMAGEURL;

  const [inventoryData, setInventoryData] = useState([]);
  const [inventoryRetrieved, setInventoryRetrieved] = useState(false);

  const [addcategoryopen, setAddCategoryOpen] = useState(false);
  const [editcategory, setEditCategory] = useState(false);

  const [ValidCategoryName, setValidCategoryName] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState();
  const [categoryName, setCategoryName] = useState();
  const [categoryID, setCategoryID] = useState();
  const [itemID, setItemID] = useState();

  const [removecategoryopen, setRemoveCategoryOpen] = useState(false);
  const [additemopen, setAdditemopen] = useState(false);
  const [itemName, setItemName] = useState();
  const [itemNameChanged, setItemNameChanged] = useState(false);
  const [itemDuration, setItemDuration] = useState();

  const [itemDescription, setItemDescription] = useState();

  const [itemIsRecommended, setItemIsRecommended] = useState(false);
  const [itemIsUnlimited, setItemIsUnlimited] = useState(false);
  const [itemIsActive, setItemIsActive] = useState(false);

  const [itemPrice, setItemPrice] = useState();

  const [itemQuantity, setItemQuantity] = useState(0);

  const [edititemopen, setEditItemOpen] = useState(false);
  const [edititemname, setEditItemName] = useState();

  const [productImage, setProductImage] = useState();
  const [itemval, setItemval] = useState([]);

  let history = useHistory();

  // const [isLoading, setIsLoading] = useState(false);

  // Get Inventory Data

  useEffect(() => {
    if (tenant.tenant_id != undefined) {
      const url = inventoryUrl + "/category/" + tenant.tenant_id;

      fetch(url, {
        method: "GET",
        headers: { "content-type": "application/JSON" },
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.status === "SUCCESS") {
            setInventoryData([result.data]);
            setItemval([result.data]);
            setInventoryRetrieved(() => true);
            // setIsLoading(false)
          } else {
            setInventoryRetrieved(() => false);
          }
        });
    }
  }, [tenant, inventoryRetrieved]);

  // socket connection
  const socket = useContext(SocketContext);

  useEffect(() => {
    if (socket) {
      socket.on("add category", (data) => handleCategoryAdded(data));
      socket.off("add order").on("add order", (data) => handleOrderAdded(data));
      socket.off("add waiter call").on("add waiter call", (data) => handlCallTable(data));
      socket.off("update category").on("update category", (data) => handleCategoryUpdated(data));
      socket.on("delete category", (data) => handleCategoryRemoved(data));
      socket.on("update user", (data) => handleUserUpdated(data));
    }
  });

  function handleCategoryAdded(user) {
    if (inventoryRetrieved) {
      const url = inventoryUrl + "/category/" + tenant.tenant_id;
  
        fetch(url, {
          method: "GET",
          headers: { "content-type": "application/JSON" },
        })
          .then((response) => response.json())
          .then((result) => {
            if (result.status === "SUCCESS") {
              setInventoryData([result.data]);
              setItemval([result.data]);
              setInventoryRetrieved(() => true);
              // setIsLoading(false)
            } else {
              setInventoryRetrieved(() => false);
            }
          });
      // setItemval(newData);
    }
  }
  function handleCategoryUpdated(user) {
    console.log("KEPANGGILLL",user)
    if (inventoryRetrieved) {
    const url = inventoryUrl + "/category/" + tenant.tenant_id;

      fetch(url, {
        method: "GET",
        headers: { "content-type": "application/JSON" },
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.status === "SUCCESS") {
            setInventoryData([result.data]);
            setItemval([result.data]);
            setInventoryRetrieved(() => true);
            // setIsLoading(false)
          } else {
            setInventoryRetrieved(() => false);
          }
        });
    }
    // if (inventoryRetrieved) {

    //   let newData = inventoryData.splice();

    //   newData.push(user);
    //   // setItemval(newData);
    // }
  }

  function handleCategoryRemoved(user) {
    if (inventoryRetrieved) {
      let newData = inventoryData.splice();

      newData.push(user);
      // setItemval(newData);
    }
  }

  function handleOrderAdded() {
    if (inventoryRetrieved) {
      const url = inventoryUrl + "/category/" + tenant.tenant_id;

      fetch(url, {
        method: "GET",
        headers: { "content-type": "application/JSON" },
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.status === "SUCCESS") {
            new Audio(addedOrderSound).play();
            toast("Order Added", { style: { background: `${profileColor}`, color: "#fff", fontWeight: "600" }, progressClassName: "progressbar" });
     
             setInventoryData([result.data]);
            setItemval([result.data]);
            setInventoryRetrieved(() => true);
          } else {
            setInventoryRetrieved(() => false);
          }
        });
    }
  }

  function handlCallTable(user){
    new Audio(waiterCalledSound).play();
    toast.warning("Waiter Called", { style: { background: "#fcd232", color: "#fff", fontWeight: "600" }, progressClassName: "progressbar" });
            
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
        setProfileColor(tenantData[0].profileColor)
      }
    }
    return () => {
      mounted = false;
    };
  }, [tenantRetrieved, tenantData]);

  function handlePassInfoShow(
    name,
    menuImage,
    category,
    cookingtime,
    price,
    recommend,
    description,
    quantity,
    active,
    unlimited
  ) {
    setEditItemOpen(true);
    setEditItemName(name);
    setItemName(name);
    setItemDuration(cookingtime);
    setItemPrice(price);
    setItemDescription(description);
    setCategoryID(category);
    setProductImage(menuImage);
    setItemIsRecommended(recommend);
    setItemQuantity(quantity);
    setItemIsActive(active);
    setItemIsUnlimited(unlimited);
  }
  const iosStyles = useIosSwitchStyles();

  function handleMove(id, direction) {
    const items = inventoryData[0];

    const position = items.findIndex((i) => i.category.id === id);

    if (position < 0) {
      throw new Error("Given item not found.");
    } else if (
      (direction === UP && position === 0) ||
      (direction === DOWN && position === items.length - 1)
    ) {
      return;
    }

    const item = items[position];
    const newItems = items.filter((i) => i.category.id !== id);
    newItems.splice(position + direction, 0, item);

    setInventoryData([newItems]);
    setItemval([newItems]);
  }

  const debounceDelay = async (i, v, posts) => {
    
    const url = inventoryUrl + "/edit/" + tenant.tenant_id;
    await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        cat_id: i,
        menu_id: v,
        menu_quantity: parseInt(posts),
      }),
      headers: { "content-type": "application/JSON" },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "SUCCESS") {
          // setIsLoading(true)
            console.log("berubah", result.data)
            if (socket) {
              socket.emit("update category", result.data);
            }
         
        }
      });
  }

  async function handleIncrement(i, v) {
    {
      inventoryData.map((item) => {
        return item.map((post, index) => {
          setItemval([item]);
          if (post.category.id === i) {
            post.category.menu.map((posts, index) => {
              if (posts.id === v) {
                
                posts.quantity = parseInt(posts.quantity) + 5;
                debounceDelay(i, v, posts.quantity);
              }
            });
          }
        });
      });
    }
  }

  function handleDecrement(i, v) {
    {
      inventoryData.map((item) => {
        return item.map((post, index) => {
          if (post.category.id === i) {
            post.category.menu.map((posts, index) => {
              if (posts.id === v) {
                posts.quantity = parseInt(posts.quantity) - 1;
                if (posts.quantity <= 0) {
                  posts.quantity = 0;
                  debounceDelay(i, v, 0);
                } else {
                  debounceDelay(i, v, posts.quantity);
                }
              }
            });
          }
          setItemval([item]);
        });
      });
    }
  }

  function handleChange(e) {
    setFormValues({ value: e.target.value });
  }

  function handlequantityvalChange(i, v, j) {
    if(j === ""){
      j=0
    }
    {
      inventoryData.map((item) => {
        return item.map((post, index) => {
          if (post.category.id === i) {
            post.category.menu.map((posts, index) => {
              if (posts.id === v) {
                posts.quantity = j;
                const url = inventoryUrl + "/edit/" + tenant.tenant_id;
                fetch(url, {
                  method: "POST",
                  body: JSON.stringify({
                    cat_id: i,
                    menu_id: v,
                    menu_quantity: parseInt(posts.quantity),
                  }),
                  headers: { "content-type": "application/JSON" },
                })
                  .then((response) => response.json())
                  .then((result) => {
                    if (result.status === "SUCCESS") {
                      if (socket) {
                        socket.emit("update category", result.data);
                        // setInventoryData([result.data]);
                      }
                    }
                  });
              }
            });
          }
          setItemval([item]);
        });
      });
    }
  }

  function imageHandler(e) {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setProductImage(reader.result);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  }

  //select drop down
  const minimalSelectClasses = useMinimalSelectStyles();

  // moves the menu below the select input
  const menuProps = {
    classes: {
      paper: minimalSelectClasses.paper,
      list: minimalSelectClasses.list,
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
        className={props.className + " " + minimalSelectClasses.icon}
      />
    );
  };

  // Notifications
  const [categoryAdded, setCategoryAdded] = useState(false);
  const [categoryEditted, setCategoryEditted] = useState(false);
  const [menuAdded, setMenuAdded] = useState(false);
  const [menuEditted, setMenuEditted] = useState(false);
  const [menuRemoved, setMenuRemoved] = useState(false);
  function handlenotification() {
    if (
      categoryAdded ||
      categoryEditted ||
      menuAdded ||
      menuEditted ||
      menuRemoved
    ) {
      setCategoryAdded(false);
      setCategoryEditted(false);
      setMenuAdded(false);
      setMenuEditted(false);
      setMenuRemoved(false);
    }
  }

  async function handleAddCategory(name) {
    const url = inventoryUrl + "/category/create/" + tenant.tenant_id;
    const payload = JSON.stringify({
      cat_name: name,
    });

    fetch(url, {
      method: "POST",
      body: payload,
      headers: { "content-type": "application/JSON" },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "SUCCESS") {
          if (socket) {
            setCategoryAdded(true);

            setTimeout(() => {
              setCategoryAdded(false);
            }, 3000);

            socket.emit("add category", result.data);
            setInventoryData([result.data]);
            setItemval([result.data]);
            setAddCategoryOpen(false);
            setValidCategoryName(true);
          }
        } else {
          setValidCategoryName(false);
        }
      });
  }

  async function handleEditCategory() {
    if (editcategory) {
      const url = inventoryUrl + "/category/edit/index/" + tenant.tenant_id;

      setEditCategory(false);
      setCategoryEditted(true);
      setTimeout(() => {
        setCategoryEditted(false);
      }, 3000);

      inventoryData[0].map(async (item, index) => {
        await fetch(url, {
          method: "POST",
          body: JSON.stringify({
            cat_id: item.category.id,
            cat_index: index + 1,
          }),
          headers: { "content-type": "application/JSON" },
        })
          .then((response) => response.json())
          .then((result) => {
            if (socket) {
              socket.emit("update category", result.data);
              setInventoryData([result.data]);
              setItemval([result.data]);
            }
          });
      });
    } else {
      setEditCategory(true);
    }
  }

  async function handleRemoveCategory(id) {
    const url = inventoryUrl + "/category/delete/" + tenant.tenant_id + "/" + id;
    fetch(url, {
      method: "POST",
      headers: { "content-type": "application/JSON" },
    })
      .then((response) => response.json())
      .then((result) => {
        if (socket) {
          socket.emit("delete category", result.data);
          setInventoryData([result.data]);
        }
      });

    setRemoveCategoryOpen(false);
  }

  async function handleAddItem() {
    const url = inventoryUrl + "/create/" + tenant.tenant_id;
    const menuUrl = imageUrl + "/menu/" + tenant.tenant_id + "/" + itemName;
    var input = document.querySelector('input[type="file"]');
    const file = input.files[0];
    new Compressor(file, {
      quality: 0.5,

      success(result) {
        let formData = new FormData();

        formData.append("menu", result, result.name);

        fetch(menuUrl, {
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

    const payload = JSON.stringify({
      cat_id: categoryID,
      menu_name: itemName,
      menu_duration: itemDuration,
      menu_desc: itemDescription,
      menu_isRecommended: itemIsRecommended,
      menu_price: itemPrice,
      menu_quantity: itemQuantity,
      menu_isAvailable: itemQuantity > 0 ? true : false,
      menu_image:
        imageUrl + "/menu/render/" + tenant.tenant_id + "/" + itemName + ".jpg",
      menu_isUnlimited: true,
      menu_isActive: true
    });



    fetch(url, {
      method: "POST",
      body: payload,
      headers: { "content-type": "application/JSON" },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "SUCCESS") {
          if (socket) {
            setMenuAdded(true);
            setTimeout(() => {
              setMenuAdded(false);
            }, 3000);

            socket.emit("add category", result.data);
            setInventoryData([result.data]);
            setItemval([result.data]);
            setItemPrice();
            setAdditemopen(false);
            setProductImage();
            setItemIsRecommended();
            setItemDescription()
            setValidCategoryName(true);
            setItemIsActive()
            setItemIsUnlimited()
          }
        } else {
          setValidCategoryName(false);
        }
      });
  }

  async function handleEditItem() {
    const url = inventoryUrl + "/edit/" + tenant.tenant_id;
    const menuUrl = imageUrl + "/menu/" + tenant.tenant_id + "/" + itemName;
    var input = document.querySelector('input[type="file"]');

    if (input.files[0] == undefined) {
      const payload = JSON.stringify({
        cat_id: categoryID,
        menu_id: itemID,
        menu_name: itemName,
        menu_image: productImage,
        menu_duration: itemDuration,
        menu_desc: itemDescription,
        menu_isRecommended: itemIsRecommended,
        menu_price: itemPrice,
        menu_quantity: itemQuantity,
        menu_isAvailable: itemQuantity > 0 ? true : false,
        menu_isUnlimited: itemIsUnlimited,
        menu_isActive: itemIsActive
      });

      fetch(url, {
        method: "POST",
        body: payload,
        headers: { "content-type": "application/JSON" },
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.status === "SUCCESS") {
            if (socket) {
              setMenuEditted(true);
              setTimeout(() => {
                setMenuEditted(false);
              }, 3000);

              socket.emit("update category", result.data);
              setInventoryRetrieved(() => false);
              setInventoryData([result.data]);
              setItemval([result.data]);
              setEditItemOpen(false);
              setProductImage();
              setItemIsRecommended();
              setValidCategoryName(true);
              setItemIsActive();
              setItemIsUnlimited();
            }
          } else {
            setValidCategoryName(false);
          }
        });
    } else if (input.files[0] != undefined && edititemname == itemName) {
      const file = input.files[0];
      new Compressor(file, {
        quality: 0.5,

        success(result) {
          let formData = new FormData();

          formData.append("menu", result, result.name);

          fetch(menuUrl, {
            method: "POST",
            body: formData,
          })
            .then((response) => response.json())
            .then((result) => {
              console.log("resssss",result)
            })
            .catch((error) => {
              console.error("Error Upload Logo:", error);
            });
        },
      });

      const payload = JSON.stringify({
        cat_id: categoryID,
        menu_id: itemID,
        menu_duration: itemDuration,
        menu_desc: itemDescription,
        menu_isRecommended: itemIsRecommended,
        menu_price: itemPrice,
        menu_quantity: itemQuantity,
        menu_isAvailable: itemQuantity > 0 ? true : false,
        menu_image:
          imageUrl +
          "/menu/render/" +
          tenant.tenant_id +
          "/" +
          itemName +
          ".jpg",
        menu_isActive: itemIsActive,
        menu_isUnlimited: itemIsUnlimited
      });

      fetch(url, {
        method: "POST",
        body: payload,
        headers: { "content-type": "application/JSON" },
      })
        .then((response) => response.json())
        .then((result) => {
          console.log("resultbaru",result)
          if (result.status === "SUCCESS") {
            if (socket) {
              setMenuEditted(true);
              setTimeout(() => {
                setMenuEditted(false);
              }, 3000);
              console.log("tessssss")
              socket.emit("update category", result.data);
              setEditItemOpen(false);
              // setInventoryData([result.data]);
              // setItemval([result.data]);
              // setEditItemOpen(false);
              // setProductImage();
              // setItemIsRecommended();
              // setValidCategoryName(true);
              // setItemIsActive();
              // setItemIsUnlimited();
            }
          } else {
            setValidCategoryName(false);
          }
        });
    } else if (input.files[0] != undefined && edititemname != itemName) {
      const payload = JSON.stringify({
        cat_id: categoryID,
        menu_id: itemID,
        menu_name: itemName,
        menu_duration: itemDuration,
        menu_desc: itemDescription,
        menu_isRecommended: itemIsRecommended,
        menu_price: itemPrice,
        menu_quantity: itemQuantity,
        menu_isAvailable: itemQuantity > 0 ? true : false,
        menu_image:
          imageUrl +
          "/menu/render/" +
          tenant.tenant_id +
          "/" +
          itemName +
          ".jpg",
        menu_isActive:itemIsActive,
        menu_isUnlimited: itemIsUnlimited
      });

      fetch(url, {
        method: "POST",
        body: payload,
        headers: { "content-type": "application/JSON" },
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.status === "SUCCESS") {
            if (socket) {
              setMenuEditted(true);
              setTimeout(() => {
                setMenuEditted(false);
              }, 3000);

              socket.emit("update category", result.data);
              setInventoryData([result.data]);
              setItemval([result.data]);
              setEditItemOpen(false);
              setProductImage();
              setItemIsRecommended();
              setValidCategoryName(true);
              setItemIsActive();
              setItemIsUnlimited();
            }
          } else {
            setValidCategoryName(false);
          }
        });

      const file = input.files[0];
      new Compressor(file, {
        quality: 0.5,

        success(result) {
          let formData = new FormData();

          formData.append("menu", result, result.name);

          fetch(menuUrl, {
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
    }
  }

  async function handleRemoveItem() {
    const url = inventoryUrl + "/delete/" + tenant.tenant_id + "/" + itemID;
    fetch(url, {
      method: "POST",
      headers: { "content-type": "application/JSON" },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "SUCCESS") {
          if (socket) {
            setMenuRemoved(true);
            setTimeout(() => {
              setMenuRemoved(false);
            }, 3000);
            socket.emit("delete category", result.data);
            setInventoryData([result.data]);
            setItemval([result.data]);
            setEditItemOpen(false);
            setProductImage();
            setItemIsRecommended();
            setItemPrice();
            setValidCategoryName(true);
            setItemIsActive();
            setItemIsUnlimited();
          }
        }
      });
  }

  useEffect(() => {
    let found;
    if (itemNameChanged) {
      found =
        inventoryRetrieved == true &&
        inventoryData.some((post) => {
          return post.some((posts, index) => {
            return posts.category.menu.some((item) => {
              if (item.name == itemName) {
                if (item.id == itemID) {
                  setValidCategoryName(true);
                } else {
                  setValidCategoryName(false);
                }
              } else {
                setValidCategoryName(true);
              }
              return item.name == itemName;
            });
          });
        });
    }
  });

  return (
    <div className="container">
      <div className="topbar">
        <div className="left" style={{ color: profileColor }}>
          Inventory
        </div>

        <TopBar />
      </div>

      <div onClick={() => history.push("/orderstatus")}>
        <ToastContainer />
      </div>

      {inventoryRetrieved ? (
        <div className="inventorysection">
          <Modal open={addcategoryopen}>
            <Box className="modalbox" style={{ zoom:"80%" }}>
              <div className="addcategorymodalbox">
                <div className="modaltitle">Category Name</div>
                <div className="modalform">
                  <div className="inputlabel">Category Name</div>
                  <input
                    type="text"
                    className="inputfilecategory"
                    onChange={(e) => {
                      setNewCategoryName(e.target.value);
                      setValidCategoryName(true);
                    }}
                  />
                  {ValidCategoryName ? (
                    <div className="noerrormessage">&nbsp;</div>
                  ) : (
                    <div className="errormessage">
                      Category name already exists!
                    </div>
                  )}
                </div>

                <div className="modalbutton">
                  <button
                    style={{ color: profileColor }}
                    onClick={() => {
                      setAddCategoryOpen(false);
                    }}
                    className="cancelbutton"
                  >
                    Cancel
                  </button>
                  <button
                    style={{ background: profileColor }}
                    type="submit"
                    onClick={() => handleAddCategory(newCategoryName)}
                    className="savebutton"
                  >
                    Save Category
                  </button>
                </div>
              </div>
            </Box>
          </Modal>

          <Modal open={additemopen}>
            <Box className="productmodalbox" style={{ zoom:'70%' }}>
              <div className="productinnerbox">
                <div className="modaltitle">Product add</div>
                <div className="modalform">
                  <form>
                    <div className="productinputrow">
                      <div className="productinputtext">
                        <div className="inputlabel">Product Name</div>
                        <input
                          type="text"
                          className="inputfile"
                          onChange={(e) => setItemName(e.target.value)}
                        />
                        {ValidCategoryName ? (
                          <div className="noerrormessage">&nbsp;</div>
                        ) : (
                          <div className="errormessage">
                            Category name already exists!
                          </div>
                        )}
                        <div className="inputlabel">Product Category</div>
                        <div className="catselector">
                          <Select
                          className="selector"
                            defaultValue=""
                            disableUnderline
                            classes={{ root: minimalSelectClasses.select }}
                            MenuProps={menuProps}
                            IconComponent={iconComponent}
                            value={categoryID}
                            onChange={(e) => setCategoryID(e.target.value)}
                          >
                            {inventoryRetrieved == true &&
                              inventoryData.map((post) => {
                                return post.map((posts, index) => {
                                  return (
                                    <MenuItem value={posts.category.id}>
                                      {posts.category.name}
                                    </MenuItem>
                                  );
                                });
                              })}
                          </Select>
                        </div>
                        <div className="inputlabel">Product Cooking Time</div>
                        <div class="MPOC" data-placeholder="Minutes"></div>
                        <input
                          type="number"
                          className="inputcookingtime"
                          onChange={(e) => setItemDuration(e.target.value)}
                        />

                        <div className="inputlabel">Product Price</div>
                        <div class="POC" data-placeholder="Rp.">
                          <NumberFormat
                            thousandsGroupStyle="thousand"
                            className="inputpricefile"
                            value={itemPrice}
                            decimalSeparator="."
                            displayType="input"
                            type="text"
                            thousandSeparator={true}
                            allowNegative={true}
                            onChange={(e) => setItemPrice(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="productinputimage">
                        <div className="inputlabel">Product Picture</div>
                        <div className="productimagepreview">
                          <img src={productImage} className="productimage" />
                          <div className="imagebuttoncontainer">
                          <div
                            className="imagebuttoninventory"
                            style={{ background: profileColor }}
                          >
                            <label for="file-input">
                              <FontAwesomeIcon
                                icon={faPencil}
                                className="promoinput"
                              />
                            </label>

                            <input
                              id="file-input"
                              type="file"
                              accept=".png, .jpg, .jpeg"
                              name="menu"
                              className="productinputfile"
                              onChange={(handleChange, imageHandler)}
                            />
                          </div>
                        </div>
                        </div>
                      </div>
                    </div>

                    <div className="inputlabel">Product Detail</div>
                    <textarea
                      type="text"
                      className="inputdetailfile"
                      onChange={(e) => setItemDescription(e.target.value)}
                    />

                    <div className="recommendcontainer">
                      <div
                        className="recommendtext"
                        style={{ color: profileColor }}
                      >
                        Do you recommend this product?
                      </div>
                      <div className="switchbutton">
                        <Switch
                          classes={iosStyles}
                          checked={itemIsRecommended}
                          onChange={(e) => {
                            setItemIsRecommended(e.target.checked);
                          }}
                        />
                        <img src={recommended} className="recommendimage" />
                      </div>
                    </div>
                  </form>
                </div>

                <div className="modalbutton">
                  <button
                    style={{ color: profileColor }}
                    onClick={() => {
                      setAdditemopen(false);
                      setProductImage();
                      setItemIsRecommended();
                      setItemPrice();
                      setItemIsActive();
                      setItemIsUnlimited();
                    }}
                    className="cancelbutton"
                  >
                    Cancel
                  </button>
                  <button
                    style={
                      itemName == "" ||
                      itemName == undefined ||
                      itemDuration == "" ||
                      itemDuration == undefined ||
                      itemDescription == "" ||
                      itemDescription == undefined ||
                      itemPrice == "" ||
                      itemPrice == undefined ||
                      productImage == undefined
                        ? { background: "#c4c4c4" }
                        : { background: profileColor }
                    }
                    disabled={
                      itemName == "" ||
                      itemName == undefined ||
                      itemDuration == "" ||
                      itemDuration == undefined ||
                      itemDescription == "" ||
                      itemDescription == undefined ||
                      itemPrice == "" ||
                      itemPrice == undefined ||
                      productImage == undefined
                        ? true
                        : false
                    }
                    type="submit"
                    onClick={() => handleAddItem()}
                    className="savebutton"
                  >
                    Save Product
                  </button>
                </div>
              </div>
            </Box>
          </Modal>

          <Modal open={edititemopen}>
            <Box className="productmodalbox" style={{ zoom:'70%' }}>
              <div className="productinnerbox">
                <div className="modaltitle">Product Edit</div>
                {ValidCategoryName ? (
                  <div className="productnoerrormessage">&nbsp;</div>
                ) : (
                  <div className="producterrormessage">
                    Menu with these details already exists!
                  </div>
                )}
                <div className="modalform">
                  <form>
                    <div className="productinputrow">
                      <div className="productinputtext">
                        <div className="inputlabel">Product Name</div>
                        <input
                          type="text"
                          value={itemName}
                          className="inputfile"
                          onChange={(e) => {
                            setItemName(e.target.value);
                            setItemNameChanged(true);
                            setValidCategoryName(true);
                          }}
                        />

                        <div className="inputlabel">Product Category</div>
                        <div className="catselector">
                          <Select
                            className="selector"
                            disableUnderline
                            classes={{ root: minimalSelectClasses.select }}
                            MenuProps={menuProps}
                            IconComponent={iconComponent}
                            value={categoryID}
                            onChange={(e) => setCategoryID(e.target.value)}
                          >
                            {inventoryRetrieved == true &&
                              inventoryData.map((post) => {
                                return post.map((posts, index) => {
                                  return (
                                    <MenuItem value={posts.category.id}>
                                      
                                      {posts.category.name}
                                    </MenuItem>
                                  );
                                });
                              })}
                          </Select>
                        </div>
                        <div className="inputlabel">Product Cooking Time</div>
                        <div class="MPOC" data-placeholder="Minutes"></div>
                        <input
                          type="number"
                          className="inputcookingtime"
                          value={itemDuration}
                          onChange={(e) => {
                            setItemDuration(e.target.value);
                            setValidCategoryName(true);
                          }}
                        />
                        <div className="inputlabel">Product Price</div>
                        <div class="POC" data-placeholder="Rp.">
                          <NumberFormat
                            thousandsGroupStyle="thousand"
                            className="inputpricefile"
                            value={itemPrice}
                            decimalSeparator={false}
                            displayType="input"
                            type="text"
                            thousandSeparator={true}
                            allowNegative={true}
                            onChange={(e) => setItemPrice(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="productinputimage">
                        <div className="inputlabel">Product Picture</div>
                        <div className="productimagepreview">
                          <img src={productImage} className="productimage" />
                          <div className="imagebuttoncontainer">
                          <div
                            className="imagebuttoninventory"
                            style={{ background: profileColor }}
                          >
                            <label for="file-input">
                              <FontAwesomeIcon
                                icon={faPencil}
                                className="promoinput"
                              />
                            </label>

                            <input
                              id="file-input"
                              type="file"
                              name="menu"
                              accept=".png, .jpg, .jpeg"
                              className="productinputfile"
                              onChange={(handleChange, imageHandler)}
                            />
                          </div>
                        </div>
                        </div>
                        
                        <div className="inputlabelformatimage">format : png, jpg, jpeg</div>
                      </div>
                    </div>

                    <div className="inputlabel">Product Detail</div>
                    <textarea
                      type="text"
                      className="inputdetailfile"
                      value={itemDescription}
                      onChange={(e) => {
                        setItemDescription(e.target.value);
                        setValidCategoryName(true);
                      }}
                    />
                    <div className="switchwrapper">
                      <div className="textcontainer">
                        <div className="textswitch">Unlimited product?</div>
                        <div className="textswitch">Active / Inactive</div>
                        <div  className="recommendtext textswitch"
                        style={{ color: profileColor }}>Do you recommend this product?</div>
                      </div>
                      <div className="switchcontainer">
                      <div className="switchbutton">
                      
                        <Switch
                          classes={iosStyles}
                          checked={itemIsUnlimited}
                          onChange={(e) => {
                            setItemIsUnlimited(e.target.checked);
                          }}
                        /> 
                        <div className="switchdesc">unlimited</div>
                   
                        </div>
                        <div className="switchbutton">
                          
                        <Switch
                          classes={iosStyles}
                          checked={itemIsActive}
                          onChange={(e) => {
                            setItemIsActive(e.target.checked);
                          }}
                        /> 
                        <div className="switchdesc">active</div>
                        </div>
                      
                          
                        <div className="switchbutton">
                          <Switch
                          classes={iosStyles}
                          checked={itemIsRecommended}
                          onChange={(e) => {
                            setItemIsRecommended(e.target.checked);
                            setValidCategoryName(true);
                          }}
                         />
                          <img src={recommended} className="recommendimage" />
                        </div>
                     
                    </div>
                    </div>
                    
                    {/* <div className="unlimitedcontainer">
                      <div className="unlimitedtext">Unlimited product?</div>
                      <div className="switchbutton">
                        <Switch
                          classes={iosStyles}
                          checked={itemIsUnlimited}
                          onChange={(e) => {
                            setItemIsUnlimited(e.target.checked);
                          }}
                        />
                      </div>
                    </div>

                    <div className="activecontainer">
                      <div className="activetext">Active / Inactive</div>
                      <div className="switchbutton">
                        <Switch
                          classes={iosStyles}
                          checked={itemIsActive}
                          onChange={(e) => {
                            setItemIsActive(e.target.checked);
                          }}
                        />
                      </div>
                    </div>

                    <div className="recommendcontainer">
                      <div
                        className="recommendtext"
                        style={{ color: profileColor }}
                      >
                        Do you recommend this product?
                      </div>
                      <div className="switchbutton">
                        <Switch
                          classes={iosStyles}
                          checked={itemIsRecommended}
                          onChange={(e) => {
                            setItemIsRecommended(e.target.checked);
                            setValidCategoryName(true);
                          }}
                        />
                        <img src={recommended} className="recommendimage" />
                      </div>
                    </div> */}
                  </form>
                </div>

                <div className="modalbutton">
                  <button
                    style={{ color: profileColor }}
                    onClick={() => {
                      setEditItemOpen(false);
                      setProductImage();
                      setItemIsRecommended();
                      setItemPrice();
                      setItemIsActive();
                      setItemIsUnlimited();
                    }}
                    className="cancelbutton"
                  >
                    Cancel
                  </button>
                  <button
                    style={{ background: "#df3030" }}
                    type="submit"
                    onClick={() => handleRemoveItem()}
                    className="removebutton"
                  >
                    Remove Product
                  </button>
                  <button
                    disabled={ValidCategoryName ? false : true}
                    style={
                      ValidCategoryName
                        ? {
                            background: "#4cd966",
                          }
                        : { background: "#c4c4c4" }
                    }
                    type="submit"
                    onClick={() => handleEditItem()}
                    className="savebutton"
                  >
                    Save Product
                  </button>
                </div>
              </div>
            </Box>
          </Modal>

          <Modal open={removecategoryopen}>
            <Box className="removecatmodalbox">
              <div className="removecatinnerbox">
                <div className="removecatheading">
                  <img src={removecat} className="removecatimage" />
                  <div
                    className="removecatmodaltitle"
                    style={{ color: profileColor }}
                  >
                    Remove Category
                  </div>
                </div>
                <div className="removecatmodaltext">
                  Are you sure to remove the
                  <span style={{ color: profileColor }}>
                    "{categoryName}"
                  </span>
                  category in your menu?
                </div>

                <div className="removecatmodalbuttoncontainer">
                  <div>
                    <button
                      className="modalcancelbutton"
                      onClick={() => {
                        setRemoveCategoryOpen(false);
                        setCategoryName();
                        setCategoryID();
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                  <div>
                    <button
                      style={{ background: profileColor }}
                      className="modalconfirmbutton"
                      onClick={() => handleRemoveCategory(categoryID)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </Box>
          </Modal>

          <div
            style={{ background: profileColor }}
            className={
              categoryAdded ||
              categoryEditted ||
              menuAdded ||
              menuEditted ||
              menuRemoved
                ? "inventorynotification"
                : "hidden"
            }
          >
            <div className="notificationtextcontainer">
              <div className="notificationtext">
                {categoryAdded
                  ? "New Category Added "
                  : categoryEditted
                  ? "Category Saved"
                  : menuAdded
                  ? "New Menu Added"
                  : menuEditted
                  ? "Menu Edited"
                  : " Menu Removed"}
              </div>
            </div>

            <div className="notificationclose">
              <button className="notifclosebutton" onClick={handlenotification}>
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
          </div>

<div className="inventoryinnersection">
          <div className="inventorycontainergrid">
            <div className="innerinventorycontainergrid">
              {itemval != [] &&
                itemval.map((post) => {
                  return post.map((item, index) => {
                    return (
                      <div className="categorycontainer" key={item.category.id}>
                        <div className="inventorycatergoryheading">
                          <div className="categoryname">
                            {item.category.name}
                          </div>
                          {editcategory ? (
                            <>
                              <div className="categorynumber">
                                <div className="catdown">
                                  <button
                                    style={
                                      index + 2 > inventoryData[0].length
                                        ? null
                                        : { color: profileColor }
                                    }
                                    className={
                                      index + 2 > inventoryData[0].length
                                        ? "catdownbutton"
                                        : "catdownbuttonactive"
                                    }
                                    onClick={() => {
                                      handleMove(item.category.id, DOWN);
                                    }}
                                  >
                                    <FontAwesomeIcon icon={faAngleDown} />
                                  </button>
                                </div>
                                <div className="cattext">{index + 1}</div>
                                <div className="catup">
                                  <button
                                    style={
                                      index + 1 <= 1
                                        ? null
                                        : { color: profileColor }
                                    }
                                    className={
                                      index + 1 <= 1
                                        ? "catupbutton"
                                        : "catupbuttonactive"
                                    }
                                    onClick={() =>
                                      handleMove(item.category.id, UP)
                                    }
                                  >
                                    <FontAwesomeIcon icon={faAngleUp} />
                                  </button>
                                </div>
                              </div>
                              <div className="categoryremove">
                                <button
                                  style={{ color: profileColor }}
                                  className="buttonremove"
                                  onClick={() => {
                                    setRemoveCategoryOpen(() => true);
                                    setCategoryName(item.category.name);
                                    setCategoryID(item.category.id);
                                  }}
                                >
                                  Remove
                                </button>
                              </div>
                            </>
                          ) : null}

                          <div className="additem">
                            <button
                              style={{ color: profileColor }}
                              className="add"
                              onClick={() => {
                                setAdditemopen(true);
                                setCategoryID(item.category.id);
                              }}
                            >
                              Add Item
                            </button>
                          </div>
                        </div>

                        <div
                          className="catmenucontainer"
                          style={{ borderColor: profileColor }}
                        >
                          {item.category.menu.length == 0 && (
                            <div className="emptymenu"> No item</div>
                          )}
                          {item.category.menu.map((post, index) => {
                            return (
                              <div className="detailmenucontainer">
                                <div className="catmenuimagecontainer">
                                  <img
                                    src={post.menuImage + "?time" + new Date()}
                                    className="menuimage"
                                  />
                                </div>
                                <div className="catmenutext">
                                  <div className="catmenutitle">
                                    {post.name}
                                  </div>
                                  <div className="recommended">
                                    {post.isRecommended === true ? (
                                      <img src={recommended} />
                                    ) : (
                                      "null"
                                    )}
                                  </div>
                                  {post.quantity == 0 && !post.isUnlimited? (
                                    <div className="soldout">Sold Out</div>
                                  ) : (
                                    <div className="catmenuprice">
                                      <NumberFormat
                                        value={post.price}
                                        prefix="Rp. "
                                        decimalSeparator="."
                                        thousandSeparator=","
                                        displayType="text"
                                      />
                                    </div>
                                  )}
                                </div>
                                {post.isUnlimited ? <div style={{ color:profileColor,fontWeight: 600 }}>Unlimited</div> : 
                                <div
                                  style={
                                    post.quantity > 0
                                      ? { background: profileColor }
                                      : null
                                  }
                                  className={
                                    post.quantity <= 0
                                      ? "catquanbutton"
                                      : "catquanbuttonactive"
                                  }
                                >
                                  <div className="decrement">
                                    <button
                                      className={
                                        post.quantity <= 0
                                          ? "negative"
                                          : "negativeactive"
                                      }
                                      disabled={
                                        post.quantity <= 0 ? true : false
                                      }
                                      onClick={handleDecrement.bind(
                                        this,
                                        item.category.id,
                                        post.id
                                      )}
                                    >
                                      <FontAwesomeIcon
                                        style={
                                          post.quantity > 0
                                            ? { color: profileColor }
                                            : null
                                        }
                                        className={
                                          post.quantity > 0
                                            ? "cartbuttontext"
                                            : "disabledcartbuttontext"
                                        }
                                        icon={faMinus}
                                      />
                                    </button>
                                  </div>
                                  <div className="quanttext">
                                    <input
                                      defaultValue={post.quantity}
                                      type="number"
                                      className="inputquantityfile"
                                      value={post.quantity}
                                      onChange={(e) =>
                                        handlequantityvalChange(
                                          item.category.id,
                                          post.id,
                                          e.target.value
                                        )
                                      }
                                    />
                                  </div>
                                  
                                  <div className="increment">
                                    <button
                                      className={
                                        post.quantity > 0
                                          ? "plus"
                                          : "plusactive"
                                      }
                                      onClick={handleIncrement.bind(
                                        this,
                                        item.category.id,
                                        post.id
                                      )}
                                    >
                                      <FontAwesomeIcon
                                        style={
                                          post.quantity > 0
                                            ? { color: profileColor }
                                            : null
                                        }
                                        className={
                                          post.quantity > 0
                                            ? "cartbuttontext"
                                            : "disabledcartbuttontext"
                                        }
                                        icon={faPlus}
                                      />
                                    </button>
                                  </div>
                                </div>
                                }

                                <div className="editbutton">
                                  <button
                                    style={{ color: profileColor }}
                                    className="edit"
                                    onClick={() => {
                                      setItemID(post.id);
                                      handlePassInfoShow(
                                        post.name,
                                        post.menuImage,
                                        item.category.id,
                                        post.duration,
                                        post.price,
                                        post.isRecommended,
                                        post.description,
                                        post.quantity,
                                        post.isActive,
                                        post.isUnlimited
                                      );
                                    }}
                                  >
                                    Edit Item
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  });
                })}
            </div>
          </div>

          <div className="buttongrid">
            <div className="inventorybuttoncontainer"></div>
            <div className="inventorybuttoncontainer">
             
              <button
                style={
                  editcategory ? null : { background: profileColor }
                }
                className={editcategory ? "buttonaddinactive" : "buttonadd"}
                disabled={editcategory ? true : false}
                type="button"
                onClick={() => setAddCategoryOpen(true)}
              >
                + Add New Category
              </button>
              {
                editcategory? (<button
                  style={ { background: profileColor }}
                    className="buttonedit"
                    type="button"
                    onClick={handleEditCategory}
                  >
                    Save Category
                  </button>) : (<button
              style={ inventoryRetrieved && inventoryData.some(item => item.length > 0)===true? { background: profileColor } : { background: "#c4c4c4" }}
                disabled={inventoryRetrieved && inventoryData.some(item => item.length > 0)===true? false : true}
              className="buttonedit"
                type="button"
                onClick={handleEditCategory}
              >
               Edit Category
              </button>)
              }
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

export default connect(mapStateToProps)(InventoryPage);
