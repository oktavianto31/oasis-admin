import { FormControlLabel } from "@material-ui/core";
import { useField } from "formik";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import { useState } from "react";
import Checkbox from "@material-ui/core/Checkbox";
import TermsAndConditions from "../pages/TermsAndConditionsPage/component/TermsAndConditions";
import PrivacyPolicy from "../pages/TermsAndConditionsPage/component/PrivacyPolicy";

const CustomCheckbox = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  // console.log("labelll",label,props)
  const [modalTermAndCondition, setModalTermAndCondition] = useState(false);
  const [modalPrivacyPolicy, setModalPrivacyPolicy] = useState(false);

  return (
    <>
      <Modal open={modalTermAndCondition}>
        <Box className="ordermodalboxtof" style={{ zoom: "80%" }}>
          <div className="modalclose">
            <button className="modalclosebutton" onClick={() => setModalTermAndCondition(false)}>
              <FontAwesomeIcon className="closebuttonicon" icon={faCircleXmark} />
            </button>
          </div>
          <div className="innermodalboxtof">
            <TermsAndConditions />
            {/* <CustomCheckbox type="checkbox" name="acceptedTos" />
              <div style={{ alignItems: "center", display: "flex", justifyContent: "center", marginTop: "4%", marginBottom: "4%" }}>
                <button onClick={() => setModalTof(false)} type="submit" className="loginbutton">
                  Accept
                </button>
              </div> */}
          </div>
        </Box>
      </Modal>
      <Modal open={modalPrivacyPolicy}>
        <Box className="ordermodalboxtof" style={{ zoom: "80%" }}>
          <div className="modalclose">
            <button className="modalclosebutton" onClick={() => setModalPrivacyPolicy(false)}>
              <FontAwesomeIcon className="closebuttonicon" icon={faCircleXmark} />
            </button>
          </div>
          <div className="innermodalboxtof">
            <PrivacyPolicy />
          </div>
        </Box>
      </Modal>
      <div className="checkbox">
        <input {...field} {...props} className={meta.touched && meta.error ? "input-error" : ""} />
        <div style={{ fontWeight: 600, marginLeft: "1%" }}>
          {" "}
          Saya menyetujui{" "}
          <span style={{ color: "blue", cursor: "pointer" }} onClick={() => setModalTermAndCondition(true)}>
            Syarat & Ketentuan
          </span>{" "}
          serta{" "}
          <span style={{ color: "blue", cursor: "pointer" }} onClick={() => setModalPrivacyPolicy(true)}>
            Kebijakan Privasi
          </span>{" "}
          Oasis One
        </div>
      </div>

      {meta.touched && meta.error && <div className="error">{meta.error}</div>}
    </>
  );
};
export default CustomCheckbox;
