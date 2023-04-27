import React from "react";
import "./PrintPage.css";
import OasisMonochrome from "../../image/oasis_logo_300.png";
import moment from "moment";

const PrintPage = () => {
  const tenantData = window.data.tenant;
  const orderData = window.data.order;
  const orderStatus = window.data.status;
  const tableNumber = window.data.tableNumber;

  // console.log("teamt", tenantData, orderData, tableNumber);
  let total = 0;
  let stringTotal = "";
  return (
    <body>
      <div class="ticket">
        {orderStatus === "2" ? (
          <>
            <div className="informationwrapper">
              <div class="title">{tenantData.name}</div>
              <div class="address">{tenantData.address === "" || tenantData.address == "please input detail address" ? "" : tenantData.address}</div>
              <div class="phonenumber">{tenantData.phoneNumber === "" || tenantData.phoneNumber == "please input phone number" ? "" : tenantData.phoneNumber}</div>
            </div>
            <div className="receiptinformation">
              <div>
                Time : {moment(orderData.order_time).format("l")} - {moment(orderData.order_time).format("LT")}
              </div>
              <div>Table : {tableNumber}</div>
              <div>note : {orderData.order_instruction == "" ? "-" : orderData.order_instruction}</div>
            </div>
            <br />
            <table className="tablereceipt">
              <thead>
                <tr>
                  <th class="quantity">Q</th>
                  <th class="description">Description</th>
                  {/* <th class="price">Price</th> */}
                </tr>
              </thead>
              <tbody>
                {orderData.order_menu.map((e) => {
                  total += parseInt(e.price.replace(/\D/g, "")) * e.orderQuantity;
                  return (
                    <tr className="isi">
                      <td class="quantity">{e.orderQuantity}</td>
                      <td class="descriptioncenter">{e.name}</td>
                      {/* <td class="price">{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(parseInt(e.price.replace(/\D/g, "")) * e.orderQuantity).slice(0, -3)}</td> */}
                    </tr>
                  );
                })}
                {/* <div style={{ display: "none" }}>{(stringTotal = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(total).slice(0, -3))}</div>
              <tr className="totalwrapper">
                <td class="quantity"></td>
                <td class="description">SubTotal</td>
                <td class="price">{stringTotal}</td>
              </tr>
              <tr className="totalwrapper">
                <td class="quantity"></td>
                <td class="description">Service Charge</td>
                <td class="price">{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(orderData.order_servicecharge).slice(0, -3)}</td>
              </tr>
              <tr>
                <td class="quantity"></td>
                <td class="description">Tax</td>
                <td class="price">{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(orderData.order_taxcharge).slice(0, -3)}</td>
              </tr>
              <tr>
                <td class="quantity"></td>
                <td class="description">Total</td>
                <td class="price">{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(orderData.order_total).slice(0, -3)}</td>
              </tr> */}
              </tbody>
            </table>

            {/* <img src={OasisMonochrome} height={150} /> */}
            <div style={{ fontWeight: 800, margin: "10px" }}>-- OASIS ONE --</div>
            <button
              id="btnPrint"
              class="hidden-print"
              onClick={() => {
                window.print();
              }}
            >
              Print
            </button>
          </>
        ) : (
          <>
            <div className="informationwrapper">
              <div class="title">{tenantData.name}</div>
              <div class="address">{tenantData.address === "" || tenantData.address == "please input detail address" ? "" : tenantData.address}</div>
              <div class="phonenumber">{tenantData.phoneNumber === "" || tenantData.phoneNumber == "please input phone number" ? "" : tenantData.phoneNumber}</div>
            </div>
            <div className="receiptinformation">
              <div>
                Time : {moment(orderData.order_time).format("l")} - {moment(orderData.order_time).format("LT")}
              </div>
              <div>Table : {tableNumber}</div>
            </div>
            <br />
            <table>
              <thead>
                <tr>
                  <th class="quantity">Q</th>
                  <th class="description">Description</th>
                  <th class="price">Price</th>
                </tr>
              </thead>
              <tbody>
                {orderData.order_menu.map((e) => {
                  total += parseInt(e.price.replace(/\D/g, "")) * e.orderQuantity;
                  return (
                    <tr>
                      <td class="quantity">{e.orderQuantity}</td>
                      <td class="description">{e.name}</td>
                      <td class="price">{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(parseInt(e.price.replace(/\D/g, "")) * e.orderQuantity).slice(0, -3)}</td>
                    </tr>
                  );
                })}

                <div style={{ display: "none" }}>{(stringTotal = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(total).slice(0, -3))}</div>
                <tr className="totalwrapper">
                  <td class="quantity"></td>
                  <td class="description">SubTotal</td>
                  <td class="price">{stringTotal}</td>
                </tr>
                <tr className="totalwrapper">
                  <td class="quantity"></td>
                  <td class="description">Service Charge</td>
                  <td class="price">{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(orderData.order_servicecharge).slice(0, -3)}</td>
                </tr>
                <tr>
                  <td class="quantity"></td>
                  <td class="description">Tax</td>
                  <td class="price">{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(orderData.order_taxcharge).slice(0, -3)}</td>
                </tr>
                <tr>
                  <td class="quantity"></td>
                  <td class="description">Total</td>
                  <td class="price">{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(orderData.order_total).slice(0, -3)}</td>
                </tr>
              </tbody>
            </table>

            {/* <img src={OasisMonochrome} height={150} /> */}
            <div style={{ fontWeight: 800, margin: "10px" }}>-- OASIS ONE --</div>

            <button
              id="btnPrint"
              class="hidden-print"
              onClick={() => {
                window.print();
              }}
            >
              Print
            </button>
          </>
        )}
      </div>
    </body>
  );
};

export default PrintPage;
