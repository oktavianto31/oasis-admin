import Color from "color";

const mainColor = "#E52C32";
const encodedMainColor = encodeURIComponent(mainColor);
const lightColor = Color(mainColor).fade(0.8).toString();

const errorColor = "#d52731";
const lightErrorColor = Color(errorColor).fade(0.8).toString();

export default () => ({
  root: {
    "& + *": {
      fontFamily: "Nunito Sans, sans-serif",
      fontWeight: 600,
      fontSize: 18,
      lineHeight: "25px",
      marginTop: "2px",
      fontSize: "0.875rem",
    },
    "&:hover, &.Mui-focusVisible": {
      backgroundColor: "transparent !important",
    },
    "& input + *": {
      border: "2px solid #808080",
      borderRadius: 2,
      width: 14,
      height: 14,
      boxShadow: "none",
      background: "transparent",
      outline: "none",
    },
    "& input:disabled + *": {
      boxShadow: "none !important",
      background: "transparent !important",
    },
    "&:not($checked)": {
      "& input + *": {
        boxShadow: "none",
        backgroundColor: "transparent",
        paddingLeft: "20%",
      },
      "& input:hover ~ *, & input:focus + *": {
        boxShadow: "none",
        backgroundColor: "transparent",
      },
      "& input + .Mui-error": {
        boxShadow: "none",
      },
      "& input:hover + .Mui-error, input:focus + .Mui-error": {
        background: "transparent",
      },
    },
  },
  checked: {
    "& input + *": {
      border: "2px solid #E52C32",
      boxShadow: "none",
      backgroundColor: "#FFE4E5",
      "&:before": {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
        marginTop: "-6%",
        marginLeft: "-3%",
        width: 16,
        height: 16,
        backgroundImage:
          `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath` +
          " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
          `1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='${encodedMainColor}'/%3E%3C/svg%3E")`,
        content: '""',
      },
    },
    "& input:focus + *": {
      backgroundColor: "#FFE4E5",
    },
  },
});
