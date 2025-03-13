import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ProcessChart = ({ processes, currentTime }) => {
  // Prepare data for the chart
  const data = {
    labels: processes.map((process) => `Process ${process.processId}`),
    datasets: [
      {
        label: "Burst Time",
        data: processes.map((process) => process.burstTime),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Completed Time",
        data: processes.map((process) => {
          if (process.endTime <= currentTime) {
            return process.burstTime; // Fully completed
          } else if (process.startTime <= currentTime) {
            return currentTime - process.startTime; // Partially completed
          } else {
            return 0; // Not started
          }
        }),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "CPU Scheduling Simulation",
      },
    },
    scales: {
      x: {
        stacked: true, // Stack the bars for each process
      },
      y: {
        stacked: true,
        beginAtZero: true,
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default ProcessChart;