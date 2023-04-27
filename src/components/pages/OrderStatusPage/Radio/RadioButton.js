import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { Formik, Form } from "formik";
import {TextField} from "../Forms/FormLib";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
   faCheck
  } from "@fortawesome/free-solid-svg-icons";
import "./RadioButton.css";

const BpIcon = styled('span')(({ theme }) => ({
  borderRadius: '50%',
  width: 18,
  height:18,

  boxShadow:
    theme.palette.mode === 'dark'
      ? '0 0 0 2px rgb(16 22 26 / 40%)'
      : 'inset 0 0 0 2px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
  backgroundColor: theme.palette.mode === 'dark' ? '#394b59' : '#ffff',
  backgroundImage:
    theme.palette.mode === 'dark'
      ? 'linear-gradient(180deg,hsla(0,0%,100%,.05),hsla(0,0%,100%,0))'
      : 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
  '.Mui-focusVisible &': {
    outline: '2px solid #c4c4c4',
    outlineOffset: 2,
  },
  'input:hover ~ &': {
    backgroundColor: theme.palette.mode === 'dark' ? '#30404d' : '#ebf1f5',
  },
  'input:disabled ~ &': {
    boxShadow: 'none',
    background:
      theme.palette.mode === 'dark' ? 'rgba(57,75,89,.5)' : 'rgba(206,217,224,.5)',
  },
}));

const BpCheckedIcon = styled(BpIcon)({
  backgroundColor: '#137cbd',
  '&:before': {
    display: 'block',
    width: 18,
    height: 18,
    backgroundImage: 'radial-gradient(#fff,#fff 28%,transparent 32%)',
    content: '""',
  },
  'input:hover ~ &': {
    backgroundColor: '#106ba3',
  },
});

// Inspired by blueprintjs
function BpRadio(props) {
  return (
    <Radio
      sx={{
        '&:hover': {
          bgcolor: 'transparent',
        },
      }}
      disableRipple
      color="default"
      checkedIcon={<div className="checkedicon"><FontAwesomeIcon icon={faCheck} /></div>}
      icon={<BpIcon />}
      {...props}
    />
  );
}

export function CustomizedRadios( {setStatus}) {

  const [selected, setSelected] = useState("")
  const [other, setOther] = useState()

return (
  <FormControl>
    <RadioGroup
      defaultValue=""
    >
      <FormControlLabel  value="Costumer asks to be cancelled" control={<BpRadio />} 
        onChange={(e)=> { 
          setStatus(e.target.value);
          setSelected(e.target.value);
        }} 
        label={<span className='radiogroup'>Costumer asks to be cancelled</span>}
        />
      <FormControlLabel  value="Food stocks are depleted" control={<BpRadio />} 
        onChange={(e)=>{
          setStatus(e.target.value);
          setSelected(e.target.value);
          }} 
        label={<span className='radiogroup'>Food stocks are depleted</span>}/>
      <FormControlLabel  value="Double Order" control={<BpRadio />} 
        onChange={(e)=>{
          setStatus(e.target.value);
          setSelected(e.target.value);
          }} 
        label={<span className='radiogroup'>Double Order</span>}/>
      <FormControlLabel  value="Others" control={<BpRadio />} 
        onChange={(e)=>{
          setStatus(e.target.value);
          setSelected(e.target.value);
        }} 
        label={
            <Formik initialValues={{ others: "" }}>
            <Form>
           <TextField
           disabled={selected == "Others" || selected == "" && selected == undefined ? false : true}
           name="others"
           type="text"
           placeholder="Others..."
           value={selected == "Others" || selected == "" ? other: ""}
           onChange={(e)=>setOther(e.target.value)}
         />
         </Form>
         </Formik>
      } />
     
    </RadioGroup>
  </FormControl>
);
}