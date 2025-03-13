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
  if (!processes || processes.length === 0) {
    return <div>No processes to display.</div>;
  }

  return (
    <div>
      <h3>Process Gantt Charts</h3>
      {processes.map((processGroup) => {
        // Prepare the dataset for the current algorithm's Gantt chart
        const dataset = {
          label: processGroup.name, // The algorithm name
          data: processGroup.result.map((process) => ({
            y: `Process ${process.processId}`, // Process ID on the Y axis
            x: [process.startTime, process.endTime], // Start and end time on the X axis
            backgroundColor: "rgba(75, 192, 192, 0.6)", // Color for bars
          })),
          backgroundColor: "rgba(75, 192, 192, 0.6)", // Color for bars
        };

        // Prepare the data for the chart
        const data = {
          labels: processGroup.result.map((process) => `Process ${process.processId}`),
          datasets: [dataset],
        };

        const options = {
          indexAxis: "y", // Swaps the axes (y-axis for processes, x-axis for time)
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: `${processGroup.name} Gantt Chart`,
            },
          },
          scales: {
            x: {
              type: "linear", // X-axis represents time (linear scale)
              beginAtZero: true,
              title: {
                display: true,
                text: "Time",
              },
            },
            y: {
              type: "category", // Y-axis represents process IDs (category scale)
              title: {
                display: true,
                text: "Processes",
              },
            },
          },
        };

        return (
          <div key={processGroup.name} style={{ marginBottom: "40px" }}>
            <h4>{processGroup.name}</h4>
            <Bar data={data} options={options} />
          </div>
        );
      })}
    </div>
  );
};

export default ProcessChart;