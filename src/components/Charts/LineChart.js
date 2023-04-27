import React from "react";
import { Line } from "react-chartjs-2";
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale } from "chart.js";
import { Chart as ChartJS, ArcElement } from "chart.js";
ChartJS.register(ArcElement, CategoryScale, LineController, LineElement, PointElement, LinearScale, CategoryScale);

const LineChart = ({ data }) => {
  return <Line height={500} data={data} options={{ maintainAspectRatio: false, responsive: true }} />;
};

export default LineChart;
