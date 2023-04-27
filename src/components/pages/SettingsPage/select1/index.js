import makeStyles from "@material-ui/styles/makeStyles";
import timeSelectStyles from "./TimeSelect.styles";

const useTimeSelectStyles = makeStyles(timeSelectStyles, {
  name: "TimeSelect",
});

export { timeSelectStyles, useTimeSelectStyles };
export { default } from "./TimeSelect.styles";
