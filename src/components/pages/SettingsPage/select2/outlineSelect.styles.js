export default () => ({
  select: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minWidth: 75,
    background: "#FFE4E5",
    borderRadius: 10,
    border: "thin solid #F10C0C",

    boxShadow: "none",
    fontFamily: "Nunito Sans, sans-serif",
    fontWeight: 600,
    fontSize: "18px",
    lineheight: "25px",
    boxSizing: "border-box",
    color: "#F10C0C",

    "&:focus": {
      borderRadius: 10,
      background: "#FFE4E5",
    },

    "& > div": {
      display: "inline-flex", // this shows the icon in the SelectInput but not the dropdown
    },
  },
  selectdisabled: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minWidth: 75,
    background: "transparent",
    borderRadius: 10,
    border: "1px solid #C4C4C4",

    boxShadow: "none",
    fontFamily: "Nunito Sans, sans-serif",
    fontWeight: 600,
    fontSize: "18px",
    lineheight: "25px",
    boxSizing: "border-box",
  },
  icon: {
    display: "flex",
    alignItems: "Center",
    marginRight: 5,
    color: "#F10C0C",
    userSelect: "none",
    pointerEvents: "none",
  },
  icondisabled: {
    display: "flex",
    alignItems: "Center",
    marginRight: 5,
    color: "#C4C4C4",
    userSelect: "none",
    pointerEvents: "none",
  },
  paper: {
    borderRadius: 10,
    marginTop: 0,
  },

  list: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "auto !important",
    fontFamily: "Nunito Sans, sans-serif",
    fontWeight: 600,
    fontSize: "16px",
    lineHeight: "25px",
    padding: "0px 0px",
    background: "#FFE4E5 !important",
    border: "none",

    "& li": {
      width: "100%",
      paddingTop: 12,
      paddingBottom: 12,
      background: "#FFE4E5 !important",
    },
    "& li:hover": {
      width: "100%",
      borderRadius: 5,
      background: "#fcb1bd !important",
    },
    "& li.Mui-selected": {
      color: "#F10C0C",
      background: "#FFE4E5 !important",
    },
    "& li.Mui-selected:hover": {
      width: "100%",
      borderRadius: 5,
      background: "#fcb1bd !important",
    },
  },
});
