import React, { useState } from "react";
import reactCSS from "reactcss";
import { handleFocus } from "./interaction";


import Checkboard from "../common/Checkboard";
import CheckIcon from '@icons/material/CheckIcon';

const ENTER = 13;

export const Swatch = ({
  color,
  style,
  onClick = () => {},
  onHover,
  title = color,
  children,
  focus,
  active,
  focusStyle = {},
}) => {
  const transparent = color === "transparent";
  const styles = reactCSS({
    default: {
      swatch: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: color,
        height: "100%",
        width: "100%",
        cursor: "pointer",
        position: "relative",
        outline: "none",
        ...style,
        ...(focus ? focusStyle : {}),
      },
      check: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#fff',
        width: '9px',
        height: '5px',
        transform: 'scale(2)',
        visibility: 'hidden'
      },
     
    },
    'active': {
      check: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#fff',
        width: '9px',
        height: '5px',
        transform: 'scale(2)',
        visibility: 'visible',
       
      },
    },
  }, {active});

  const handleClick = (e) => {
    onClick(color, e)
  };
  const handleKeyDown = (e) => e.keyCode === ENTER && onClick(color, e);
  const handleHover = (e) => onHover(color, e);

  const optionalEvents = {};
  if (onHover) {
    optionalEvents.onMouseOver = handleHover;
  }

  return (
    <div
      style={styles.swatch}
      onClick={handleClick}
      title={title}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      {...optionalEvents}
    >
      {children}
      {transparent && (
        <Checkboard
          borderRadius={styles.swatch.borderRadius}
          boxShadow="inset 0 0 0 1px rgba(0,0,0,0.1)"
        />
      )}
      <div style={ styles.check }>
        <CheckIcon style={styles.icon} />
      </div>
    </div>
  );
};

export default handleFocus(Swatch);
