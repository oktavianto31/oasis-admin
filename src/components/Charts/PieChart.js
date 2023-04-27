import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement ,Legend, Tooltip } from "chart.js";
ChartJS.register(ArcElement, Legend, Tooltip);

const PieChart = ({ data }) => {
  console.log("pieeee", data);
  //   return <Pie data={data}/>
  return <Pie width={450} height={450} data={data} />;
};

export default PieChart;
