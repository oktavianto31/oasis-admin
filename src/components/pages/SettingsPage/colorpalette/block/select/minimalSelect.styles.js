export default () => ({
  select: {
    display: 'flex',
    alignItems : "Center",
    minWidth: 200,
    background: '#F8FAFB',
    borderRadius: 10,
    border: "none" ,
    height: "36px",
    boxShadow: 'none',
    fontFamily: 'Nunito Sans, sans-serif',
    fontWeight: 600,
    fontSize: 18,
    lineheight: 25,
    padding: '0 10%',
    boxSizing: "border-box",
    color: "#424242",

    "&:focus":{
      borderRadius: 10,
      background: '#F8FAFB',
    },
    
    "& > div":{
      display:'inline-flex' // this shows the icon in the SelectInput but not the dropdown
    }
  },
  icon:{
    display: 'flex',
    alignItems : "Center",
    marginRight: 15,
    color: '#949494',
    userSelect: 'none',
    pointerEvents: 'none',
  },
  paper: {
    borderRadius: 20,
    marginTop: 8,
  },
  
  list: {
    height: 'auto',
    paddingTop:0,
    paddingBottom:0,
    background:'#F8FAFB',
    border: "none" ,

    "& li":{
      paddingTop:12,
      paddingBottom:12,
    },
    "& li:hover":{
      borderRadius: 5,
      color: '#fff',
      background: '#949494'
    },
    "& li.Mui-selected":{
      color:'#424242',
      background: '#F8FAFB'
    },
    "& li.Mui-selected:hover":{
      borderRadius: 5,
      color: '#fff',
      background: '#949494'
    }
  },

});