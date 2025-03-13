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

const ProcessChart = ({ processes, currentTime, numProcesses }) => {
  if (!processes || processes.length === 0) {
    return <div>No processes to display.</div>;
  }

  // Calculate dynamic height based on the number of processes
  const chartHeight = Math.max(200, numProcesses * 40); // Minimum height of 200px, 40px per process

  return (
    <div>
      <h3>Process Gantt Charts</h3>
      <div className="gantt-container">
        {processes.map((processGroup) => {
          // Prepare the dataset for the current algorithm's Gantt chart
          const dataset = {
            label: processGroup.name, // The algorithm name
            data: processGroup.result.map((process) => ({
              y: process.processId, // Process ID on the Y axis (just the number)
              x: [process.startTime, process.endTime], // Start and end time on the X axis
              backgroundColor: "rgba(75, 192, 192, 0.6)", // Color for bars
            })),
            backgroundColor: "rgba(75, 192, 192, 0.6)", // Color for bars
          };

          // Prepare the data for the chart
          const data = {
            labels: processGroup.result.map((process) => process.processId.toString()), // Only numbers
            datasets: [dataset],
          };

          const options = {
            indexAxis: "y", // Swaps the axes (y-axis for processes, x-axis for time)
            responsive: true,
            maintainAspectRatio: false, // Allows custom sizing
            plugins: {
              legend: {
                display: false, // Remove legend (since the title already states the algorithm)
              },
              title: {
                display: false, // Remove extra title
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
                  text: "Process ID", // Added y-axis label
                },
              },
            },
          };

          return (
            <div key={processGroup.name} className="gantt-chart" style={{ height: `${chartHeight}px` }}>
              <h4 className="gantt-algo-title">{processGroup.name}</h4>
              <div className="chart-wrapper">
                <Bar data={data} options={options} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProcessChart;