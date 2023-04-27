import React, { useState } from "react";
import PropTypes from "prop-types";
import reactCSS from "reactcss";
import merge from "lodash/merge";
import * as color from "../helpers/color";

import { ColorWrap, EditableInput, Checkboard } from "../common";
import BlockSwatches from "./BlockSwatches";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import ExpandMoreRoundedIcon from "@material-ui/icons/ExpandMoreRounded";
import { useMinimalSelectStyles } from "./select/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
export const Block = ({
  onChange,
  onSwatchHover,
  hex,
  colors,
  width,
  triangle,

  styles: passedStyles = {},
  className = "",
}) => {
  const transparent = hex === "transparent";

  const handleChange = (hexCode, e) => {
    setShowPalette(false);
    color.isValidHex(hexCode) &&
      onChange(
        {
          hex: hexCode,
          source: "hex",
        },
        e
      );
  };

  const [showpalette, setShowPalette] = useState(false);

  const styles = reactCSS(
    merge(
      {
        default: {
          button: {
            display: "flex",
            alignItems: "center",
            border: "none",
            outline: "none",
            boxShadow: "none",
            width: "217px",
            height: "37px",
            borderRadius: "10px",
            background: "#F8FAFB",
          },
          buttonshow: {
            display: "flex",
            alignItems: "center",
            border: "none",
            outline: "none",
            boxShadow: "none",
            width: "217px",
            height: "37px",
            borderRadius: "10px 10px 0px 0px",
            background: "#F8FAFB",
          },
          insidediv: {
            width: "157px",
            height: "22px",
            borderRadius: "5px",
            background: hex,
            marginRight: "10%",
          },
          icon: {
            width: "15px",
            height: "15px",
            color: "#949494",
          },
          card: {
            transition: "all 0.3s ease-in",
            width: "217px",
            background: "#F8FAFB",
            boxShadow: "none",
            borderRadius: "0px 0px 10px 10px ",
            position: "absolute",
            marginTop: "0px",
            zIndex: '-1',
            transform: 'translateY(-100%)'
          },
          cardactive: {
            transition: "all 0.3s ease-in",
            width: "217px",
            background: "#F8FAFB",
            boxShadow: "none",
            borderRadius: "0px 0px 10px 10px ",
            position: "absolute",
            marginTop: "0px",
            zIndex: '-1',
          },
          head: {
            height: "110px",
            background: hex,
            borderRadius: "6px 6px 0 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          },
          body: {
            width: "157px",
            padding: "10px",
          },
          label: {
            fontSize: "18px",
            color: color.getContrastingColor(hex),
            position: "relative",
          },

          input: {
            width: "100%",
            fontSize: "12px",
            color: "#666",
            border: "0px",
            outline: "none",
            height: "22px",
            boxShadow: "inset 0 0 0 1px #ddd",
            borderRadius: "4px",
            padding: "0 7px",
            boxSizing: "border-box",
          },
        },
        "hide-triangle": {
          triangle: {
            display: "none",
          },
        },
      },
      passedStyles
    ),
    { "hide-triangle": triangle === "hide" }
  );

  return (
    <div style={styles.container}>
      <button
        style={showpalette ? styles.buttonshow : styles.button}
        type="button"
        onClick={()=>setShowPalette((state)=>!state)}
      >
        <div style={styles.insidediv}>&nbsp;</div>
        <FontAwesomeIcon
          style={styles.icon}
          icon={showpalette ? faChevronUp : faChevronDown}
        />
      </button>

      <div
        style={showpalette ? styles.cardactive : styles.card}
        className={`block-picker ${className}`}
      >
        {/* <div style={styles.head}>
        {transparent && <Checkboard borderRadius="6px 6px 0 0" />}
        <div style={styles.label}>{hex}</div>
      </div> */}

        <div style={styles.body}>
          <BlockSwatches
            colors={colors}
            onClick={handleChange}
            active={ hex }
            onSwatchHover={onSwatchHover}
          />
      
          {/* <EditableInput
          style={{ input: styles.input }}
          value={hex}
          onChange={handleChange}
        /> */}
        </div>
      </div>
    </div>
  );
};

Block.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  colors: PropTypes.arrayOf(PropTypes.string),
  triangle: PropTypes.oneOf(["top", "hide"]),
  styles: PropTypes.object,
};

Block.defaultProps = {
  width: 157,
  colors: [
    "#8C8C8C",
    "#FF4B74",
    "#FFE186",
    "#88EF3E",
    "#4F95FC",
    "#A243FA",
    "#4A4A4A",
    "#DF3030",
    "#FFC733",

    "#61AF29",
    "#2377FB",
    "#7B00FA",
    "#040404",
    "#B40028",
    "#E6AE24",
    "#396716",
    "#0A48B0",
    "#5600AF",
  ],
  styles: {},
};

export default ColorWrap(Block);
