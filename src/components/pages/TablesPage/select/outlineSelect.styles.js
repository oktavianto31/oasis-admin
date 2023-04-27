export default () => ({
  select: {
    display: 'flex',
    alignItems : "Center",
    minWidth: 125,
    background: '#FFE4E5',
    borderRadius: 20,
    border: "thin solid #F10C0C" ,
    height: "43px",
    boxShadow: 'none',
    fontFamily: 'Nunito Sans, sans-serif',
    fontWeight: 600,
    fontSize: 20,
    lineheight: 22,
    padding: '0 20px',
    boxSizing: "border-box",
    color: "#F10C0C",

    "&:focus":{
      borderRadius: 20,
      background: '#FFE4E5',
    },
    
    "& > div":{
      display:'inline-flex' // this shows the icon in the SelectInput but not the dropdown
    }
  },
  icon:{
    display: 'flex',
    alignItems : "Center",
    marginRight: 15,
    color: '#F10C0C',
    userSelect: 'none',
    pointerEvents: 'none',
  },
  paper: {
    borderRadius: 20,
    marginTop: 5
  },
  
  list: {
    height: 200,
    paddingTop:0,
    paddingBottom:0,
    overflowY: "scroll",
    background:'#FFE4E5',
    border: "thin solid #F10C0C" ,

    "& li":{
      paddingTop:12,
      paddingBottom:12,
    },
    "& li:hover":{
      borderRadius: 5,
      background: '#fcb1bd'
    },
    "& li.Mui-selected":{
      color:'#424242',
      background: '#FFE4E5'
    },
    "& li.Mui-selected:hover":{
      borderRadius: 5,
      background: '#fcb1bd'
    }
  },

});