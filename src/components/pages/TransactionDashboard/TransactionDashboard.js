import React, { useEffect, useState } from "react";
import TopBar from "../TopBar/TopBar";
import "./TransactionDashboard.css";
import { connect } from "react-redux";
import TablePagination from "../../Pagination/index";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { DateRange } from "react-date-range";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { addDays } from "date-fns/esm";
import moment from "moment";
import PropTypes from "prop-types";
import NumberFormat from "react-number-format";
import { ThreeDots } from "react-loader-spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import PieChart from "../../Charts/PieChart";
import LineChart from "../../Charts/LineChart";
import { el } from "date-fns/locale";
import * as XLSX from "xlsx";

const TransactionDashboard = ({ tenant }) => {
  const [profileColor, setProfileColor] = useState();
  const [profileName, setProfileName] = useState();
  const [tenantData, setTenantData] = useState([]);
  const [tenantRetrieved, setTenantRetrieved] = useState(false);
  const [transactionSummary, setTransactionSummary] = useState();
  const [transactionSummaryExport, setTransactionSummaryExport] = useState();
  const [transactionPerformance, setTransactionPerformance] = useState();
  const [previousPerformance, setPreviousPerformance] = useState();
  const [transactionRangePerformance, setTransactionRangePerformance] = useState();
  const [transactionRetrieved, setTransactionRetrieved] = useState(false);
  const [openCalendar, setOpenCalendar] = useState(false);
  const [chartData, setChartData] = useState({});
  const chartDataDummy = {
    labels: "",
    datasets: [
      {
        label: "Net Income",
        data: 0,
        backgroundColor: "#fff",
        borderColor: profileColor,
        fill: false,
        tension: 0,
        pointBorderColor: "#000",
      },
    ],
  };
  const [chartFilteredData, setChartFilteredData] = useState();

  const [open, setOpen] = useState(false);
  const [clickedId, setClickedId] = useState(1);

  const [performanceData, setPerformanceData] = useState();

  const [page, setPage] = useState(0);
  const rowsPerPage = 7;

  const [index, setIndex] = useState(1);

  const localUrl = process.env.REACT_APP_TENANTURL;
  const orderUrl = process.env.REACT_APP_ORDERURL;

  const [range, setRange] = useState([
    {
      startDate: "",
      endDate: "",
      key: "selection",
    },
  ]);

  useEffect(() => {
    // setBtnType("termandcondition");
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

  useEffect(() => {
    let mounted = true;

    if (mounted) {
      if (tenantRetrieved === true) {
        setProfileColor(tenantData[0].profileColor);
        setProfileName(tenantData[0].name);
      }
    }
    return () => {
      mounted = false;
    };
  }, [tenantRetrieved, tenantData]);

  useEffect(() => {
    let mounted = true;

    if (mounted) {
      if (tenantRetrieved === true) {
        setProfileColor(tenantData[0].profileColor);
      }
    }
    return () => {
      mounted = false;
    };
  }, [tenantRetrieved, tenantData]);

  useEffect(() => {
    // if (tenant.tenant_id != undefined) {
    // getTransactionData();
    setClickedId(1);
    getPerformanceData();

    // }
  }, [transactionRetrieved, tenant]);

  function getTransactionData() {
    const url = orderUrl + "/summary";
    const startDate = range[0].startDate == "" ? "" : moment(range[0].startDate).format("YYYY-MM-DD");
    const endDate = range[0].endDate == "" ? "" : moment(range[0].endDate).format("YYYY-MM-DD");
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        tenant_id: tenant.tenant_id,
        start_date: startDate,
        end_date: endDate,
      }),
      headers: { "content-type": "application/JSON" },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "SUCCESS") {
          setTransactionSummary([result.data]);
          setTransactionSummaryExport(result.data);
          const backgroundColor = [];
          const borderColor = [];
          for (let i = 0; i < [result.data][0].menu_summary.length; i++) {
            const r = Math.floor(Math.random() * 255);
            const g = Math.floor(Math.random() * 255);
            const b = Math.floor(Math.random() * 255);
            backgroundColor.push("rgba(" + r + "," + g + ", " + b + ",1)");
            borderColor.push("rgba(" + r + "," + g + ", " + b + ",1)");
          }
          // setChartData({
          //   labels: [result.data][0].menu_summary.map((data) => data.menu_name),
          //   datasets: [
          //     {
          //       label: "Total Penjualan",
          //       data: [result.data][0].menu_summary.map((data) => data.total_price),
          //       // backgroundColor: backgroundColor,
          //       borderColor: "#000",
          //       borderWidth: 1.5,
          //       fill: true,
          //       tension: 0.4,
          //       pointBorderColor: "aqua",
          //     },
          //   ],
          // });

          setTransactionRetrieved(() => true);
        } else {
          setTransactionRetrieved(() => false);
        }
      });
    setOpenCalendar(false);
  }

  function getPerformanceData() {
    const url = orderUrl + "/get-performance";
    const startDate = range[0].startDate == "" ? "" : moment(range[0].startDate).format("YYYY-MM-DD");
    const endDate = range[0].endDate == "" ? "" : moment(range[0].endDate).format("YYYY-MM-DD");
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        tenant_id: tenant.tenant_id,
        start_date: startDate,
        end_date: endDate,
      }),
      headers: { "content-type": "application/JSON" },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "SUCCESS") {
          setTransactionPerformance([result.data]);
          if (startDate != "") {
            setTransactionRangePerformance(result.range_data);
          }
          // setTransactionSummaryExport(result.range_data.combined_menu)

          // const perf = transactionPerformance[0].performance;
          var performanceData = null;
          const timeoffset = 25200000;
          const checkstartdate = new Date(Date.parse(startDate) - timeoffset);
          const checkenddate = new Date(Date.parse(endDate) - timeoffset);
          const dayoffset = 3600000 * 24;
          var latestDate = "";

          if ([result.data][0] !== undefined) {
            [result.data][0].forEach((e, index) => {
              if (e.date <= moment(checkenddate).format("yyyy-MM-DD")) {
                if (e.date > moment(checkstartdate).format("yyyy-MM-DD")) {
                  if (e.date > latestDate) {
                    latestDate = e.date;
                  }
                }
              }
            });

            [result.data][0].forEach((e, index) => {
              if (latestDate == e.date) {
                performanceData = e;
              }
            });
            setPerformanceData(performanceData);

            if (startDate !== "") {
              const filteredchart = [result.data][0].filter((e) => {
                var start_date = new Date(Date.parse(startDate)).toISOString();
                var end_date = new Date(Date.parse(endDate)).toISOString();

                return e.date >= moment(start_date).format("yyyy-MM-DD") && e.date <= moment(end_date).format("yyyy-MM-DD");
              });

              setChartFilteredData(filteredchart);
              var array = [];
              for (var i = 1; i <= filteredchart.length; i++) {
                array.push(i);
              }
              setChartData({
                labels: filteredchart.map((data) => moment(new Date(data.date)).format("LL")),
                datasets: [
                  {
                    label: "Net Income",
                    data: filteredchart.map((data) => data.daily_sales),
                    backgroundColor: "#fff",
                    borderColor: profileColor,
                    fill: false,
                    tension: 0,
                    pointBorderColor: "#000",
                  },
                ],
              });
            }
          } else if ([result.data][0] == undefined) {
            setChartData({});
          }

          // var min = Math.max(...filtered.map((i) => new Date(i.date).getTime()));
          // console.log("lates4", min);
          // console.log("lates5", filtered);
          // setPerformanceData(filtered);

          setTransactionRetrieved(() => true);
        } else {
          setTransactionRetrieved(() => false);
        }
      });
    setOpenCalendar(false);
  }

  function getPreviousPerformance() {
    const url = orderUrl + "/get-previous-performance";
    const endDate = range[0].endDate == "" ? "" : moment(range[0].endDate).format("YYYY-MM-DD");

    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        tenant_id: tenant.tenant_id,
        end_date: endDate,
      }),
      headers: { "content-type": "application/JSON" },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "SUCCESS") {
          setPreviousPerformance(result.data);
          // setTransactionRetrieved(() => true);
        } else {
          setTransactionRetrieved(() => true);
        }
      });
  }

  function TablePaginationActions(props) {
    const { count, page, onPageChange } = props;

    const handleBackButtonClick = (event) => {
      onPageChange(event, page - 1);
      setIndex(index - 7);
    };

    const handleNextButtonClick = (event) => {
      onPageChange(event, page + 1);

      setIndex(index + 7);
    };

    return (
      <div className="containerbutton">
        <button onClick={handleBackButtonClick} disabled={page === 0} className={page === 0 ? "leftdisabledbutton" : "leftdisplaybutton"}>
          <FontAwesomeIcon icon={faAngleLeft} style={page === 0 ? { color: "#BEBEBE" } : { color: "#949494" }} />
        </button>

        <button onClick={handleNextButtonClick} disabled={page >= Math.ceil(count / 7) - 1} className={page >= Math.ceil(count / 7) - 1 ? "rightdisabledbutton" : "rightdisplaybutton"}>
          <FontAwesomeIcon icon={faAngleRight} style={page >= Math.ceil(count / 7) - 1 ? { color: "#BEBEBE" } : { color: "#949494" }} />
        </button>
      </div>
    );
  }

  TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const generateXlsx = () => {
    const exportData = transactionRangePerformance.combined_menu.map((e, index) => {
      return {
        No: index + 1,
        "Nama Menu": e.menu_name,
        // Kategori: e.menu_category,
        "Jumlah Order": e.order_quantity,
        "Harga Menu": e.menu_price,
        "Total Penjualan": e.total_price,
      };
    });
    var wb = XLSX.utils.book_new(),
      ws = XLSX.utils.json_to_sheet(exportData);
    XLSX.utils.book_append_sheet(wb, ws, "MySheet1");
    XLSX.writeFile(wb, `${profileName}_transactionsummary.xlsx`);
  };

  return (
    <div className="container" style={{ zoom: "70%" }}>
      <div className="topbar">
        <div className="left" style={{ color: profileColor }}>
          Transaction Dashboard
        </div>

        <TopBar />
      </div>
      {transactionRetrieved ? (
        <div className="transactiondashboardcontainer">
          <div className="transactiondashboardheader">
            <div className="transactiondashboardtitle" style={{ color: profileColor }}>
              Performance Orders
            </div>
            <div className="transactiondashboardbutton">
              {/* <div className="buttondate" style={{ color: "#fff", borderColor: profileColor, background: profileColor }}>
                {moment(range[0].startDate).format("LL") !== "Invalid date" && moment(range[0].startDate).format("LL")} - {moment(range[0].endDate).format("LL") !== "Invalid date" && moment(range[0].endDate).format("LL")}
              </div>
              <button className="buttonright" style={{ color: profileColor, borderColor: profileColor }} onClick={() => setOpenCalendar(!openCalendar)}>
                {" "}
                Start / End Date
              </button>
              */}

              <div className="calendarwrap">
                <div
                  className="inputbox"
                  onClick={() => setOpen(!open)}
                  // value={`${moment(range[0].startDate).format("LL") !== "Invalid date" ? moment(range[0].startDate).format("L") : ""} - ${
                  //   moment(range[0].endDate).format("LL") !== "Invalid date" ? moment(range[0].endDate).format("L") : ""
                  // }`}
                  style={{ color: "#fff", backgroundColor: profileColor }}
                >
                  {moment(range[0].startDate).format("LL") !== "Invalid date" ? moment(range[0].startDate).format("LL") + " -" : "Select Date"}{" "}
                  {moment(range[0].endDate).format("LL") !== "Invalid date" && moment(range[0].endDate).format("LL")}
                </div>

                {open && (
                  <div className="calendarelement">
                    <DateRangePicker onChange={(item) => setRange([item.selection])} editableDateInputs={true} moveRangeOnFirstSelection={false} ranges={range} months={2} direction="horizontal" />
                    <div className="savedatebuttonwrapper">
                      <button
                        type="submit"
                        onClick={() => {
                          // getTransactionData();
                          // getPerformanceData();
                          setTransactionRetrieved(() => false);
                          getPreviousPerformance();
                          setOpen(false);
                        }}
                        className="savedatebutton"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="downloadbutton" style={{ color: "#fff", background: profileColor }} onClick={generateXlsx}>
                Download
              </div>
            </div>
          </div>

          {/* <div className="chartsummary">
            <div className="chart">
              <PieChart data={chartData} />
            </div>

            <div className="ordertotal">
              <div className="ordertotaltext">Total Penjualan</div>
              <div className="ordertotalprice">
                <NumberFormat value={transactionSummary[0].total_sales} prefix="Rp. " decimalSeparator="." thousandSeparator="," displayType="text" />
              </div>
            </div>
          </div> */}

          {/* {transactionRangePerformance != undefined && ( */}

          <div className="outertransactiontable">
            <div className="transactiontablegraph">
              <div
                className="summarycard"
                style={clickedId === 1 ? { borderBottom: `5px solid ${profileColor}`, boxShadow: "rgba(0, 0, 0, 0.15) 0px 15px 25px, rgba(0, 0, 0, 0.05) 0px 5px 10px" } : { borderBottom: "none" }}
                onClick={() => {
                  setClickedId(1);
                  setChartData({
                    labels: chartFilteredData.map((data) => moment(new Date(data.date)).format("LL")),
                    datasets: [
                      {
                        label: "Net Income",
                        data: chartFilteredData.map((data) => data.daily_sales),
                        backgroundColor: "#fff",
                        borderColor: profileColor,
                        fill: false,
                        tension: 0,
                        pointBorderColor: "#000",
                      },
                    ],
                  });
                }}
              >
                <div className="summarycardtitle">Total Pendapatan</div>
                <div className="summarycardvalue">
                  {transactionRangePerformance == undefined ? 0 : <NumberFormat value={transactionRangePerformance.total_income_range.toFixed(2)} prefix="Rp. " decimalSeparator="." thousandSeparator="," displayType="text" />}
                </div>
                <div className="summarycardpercent">
                  <span className="percenttext" style={{ color: profileColor }}>
                    {transactionRangePerformance === undefined
                      ? 0
                      : previousPerformance !== undefined && ((transactionRangePerformance.total_income_range - previousPerformance.total_income_30day) * 100) / previousPerformance.total_income_30day > 0
                      ? previousPerformance !== undefined && "+" + parseFloat(((transactionRangePerformance.total_income_range - previousPerformance.total_income_30day) * 100) / previousPerformance.total_income_30day).toFixed(2)
                      : previousPerformance !== undefined && parseFloat(((transactionRangePerformance.total_income_range - previousPerformance.total_income_30day) * 100) / previousPerformance.total_income_30day).toFixed(2)}
                    %
                  </span>{" "}
                  <span style={{ color: "#7F7F7F", fontSize: "16" }}>dari 30 hari terakhir</span>
                </div>
              </div>
              <div
                className="summarycard"
                style={clickedId === 2 ? { borderBottom: `5px solid ${profileColor}`, boxShadow: "rgba(0, 0, 0, 0.15) 0px 15px 25px, rgba(0, 0, 0, 0.05) 0px 5px 10px" } : { borderBottom: "none" }}
                onClick={() => {
                  setClickedId(2);
                  setChartData({
                    labels: chartFilteredData.map((data) => moment(new Date(data.date)).format("LL")),
                    datasets: [
                      {
                        label: "Quantity",
                        data: chartFilteredData.map((data) => data.daily_quantity),
                        backgroundColor: "#fff",
                        borderColor: profileColor,
                        fill: false,
                        tension: 0,
                        pointBorderColor: "#000",
                      },
                    ],
                  });
                }}
              >
                <div className="summarycardtitle">Produk Terjual</div>
                <div className="summarycardvalue">{transactionRangePerformance == undefined ? 0 : transactionRangePerformance.total_quantity_range}</div>
                <div className="summarycardpercent">
                  <span className="percenttext" style={{ color: profileColor }}>
                    {transactionRangePerformance == undefined
                      ? 0
                      : previousPerformance !== undefined && ((transactionRangePerformance.total_quantity_range - previousPerformance.total_quantity_30day) * 100) / previousPerformance.total_quantity_30day > 0
                      ? previousPerformance !== undefined && "+" + parseFloat(((transactionRangePerformance.total_quantity_range - previousPerformance.total_quantity_30day) * 100) / previousPerformance.total_quantity_30day).toFixed(2)
                      : previousPerformance !== undefined && parseFloat(((transactionRangePerformance.total_quantity_range - previousPerformance.total_quantity_30day) * 100) / previousPerformance.total_quantity_30day).toFixed(2)}
                    %
                  </span>{" "}
                  <span style={{ color: "#7F7F7F", fontSize: "16" }}>dari 30 hari terakhir</span>
                </div>
              </div>
              <div
                className="summarycard"
                style={clickedId === 3 ? { borderBottom: `5px solid ${profileColor}`, boxShadow: "rgba(0, 0, 0, 0.15) 0px 15px 25px, rgba(0, 0, 0, 0.05) 0px 5px 10px" } : { borderBottom: "none" }}
                onClick={() => {
                  setClickedId(3);
                  setChartData({
                    labels: chartFilteredData.map((data) => moment(new Date(data.date)).format("LL")),
                    datasets: [
                      {
                        label: "Count",
                        data: chartFilteredData.map((data) => data.daily_count),
                        backgroundColor: "#fff",
                        borderColor: profileColor,
                        fill: false,
                        tension: 0,
                        pointBorderColor: "#000",
                      },
                    ],
                  });
                }}
              >
                <div className="summarycardtitle">Total Order</div>
                <div className="summarycardvalue">{transactionRangePerformance == undefined ? 0 : transactionRangePerformance.total_count_range}</div>
                <div className="summarycardpercent">
                  <span className="percenttext" style={{ color: profileColor }}>
                    {transactionRangePerformance == undefined
                      ? 0
                      : previousPerformance !== undefined && ((transactionRangePerformance.total_count_range - previousPerformance.total_count_30day) * 100) / previousPerformance.total_count_30day > 0
                      ? previousPerformance !== undefined && "+" + parseFloat(((transactionRangePerformance.total_count_range - previousPerformance.total_count_30day) * 100) / previousPerformance.total_count_30day).toFixed(2)
                      : previousPerformance !== undefined && parseFloat(((transactionRangePerformance.total_count_range - previousPerformance.total_count_30day) * 100) / previousPerformance.total_count_30day).toFixed(2)}
                    %
                  </span>{" "}
                  <span style={{ color: "#7F7F7F", fontSize: "16" }}>dari 30 hari terakhir</span>
                </div>
              </div>
            </div>
            {console.log("ccc", chartData)}
            <div className="chartwrapper">{Object.keys(chartData).length !== 0 ? <LineChart data={chartData} /> : <LineChart data={chartDataDummy} />}</div>
          </div>
          {/* )} */}

          <div className="outertransactiontable">
            <div className="transactiontable">
              <div className="transactionheader">
                <div className="transactionleft" style={{ color: profileColor }}>
                  Summary
                </div>
                <div className="transactionright"></div>
              </div>

              <Modal open={openCalendar} onClose={() => setOpenCalendar(false)}>
                <Box className="calendarbox">
                  <DateRange onChange={(item) => setRange([item.selection])} editableDateInputs={true} moveRangeOnFirstSelection={false} ranges={range} months={1} direction="vertical" className="calendarElement" />
                  <button
                    type="submit"
                    onClick={() => {
                      // getTransactionData();
                      // getPerformanceData();
                      setTransactionRetrieved(() => false);
                      getPreviousPerformance();
                    }}
                    className="savedatebutton"
                  >
                    Save
                  </button>
                </Box>
              </Modal>

              <div className="transactionheadertitlegrid">
                <div className="transactionheadertitle">NO</div>
                <div className="transactionheadertitle">NAMA MENU</div>
                <div className="transactionheadertitle">KATEGORI</div>
                <div className="transactionheadertitle">PRODUK TERJUAL</div>
                <div className="transactionheadertitle">HARGA PER ITEM</div>
                <div className="transactionheadertitle">PENDAPATAN BERSIH (Per Item)</div>
              </div>

              {performanceData !== undefined && performanceData !== null && (
                <div className="transactionrendercontainer">
                  {transactionRangePerformance !== undefined &&
                    transactionRangePerformance.combined_menu.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((post, i) => {
                      return (
                        <div className={i != 7 ? "bordered" : "noborder"}>
                          <div className="transactionrendergrid">
                            <div className="transactiontext">{i + index}</div>
                            <div className="transactiontext">{post.menu_name}</div>
                            <div className="transactiontext">{post.menu_category}</div>
                            <div className="transactiontext">{post.order_quantity}</div>
                            <div className="transactiontext">
                              <NumberFormat value={post.menu_price} prefix="Rp. " decimalSeparator="." thousandSeparator="," displayType="text" />
                            </div>
                            <div className="transactiontext">
                              <NumberFormat value={post.total_price} prefix="Rp. " decimalSeparator="." thousandSeparator="," displayType="text" />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
          <div className="footer">
            {performanceData !== null && performanceData !== undefined && transactionRangePerformance !== undefined && (
              <TablePagination colSpan={3} count={transactionRangePerformance.combined_menu.length} rowsPerPage={rowsPerPage} page={page} onPageChange={handleChangePage} ActionsComponent={TablePaginationActions} />
            )}
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
};

const mapStateToProps = ({ session }) => ({
  tenant: session.user,
});

export default connect(mapStateToProps)(TransactionDashboard);
