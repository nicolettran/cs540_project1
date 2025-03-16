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
          // Get all unique process IDs
          const processIds = [...new Set(processGroup.result.map(p => p.processId))];
          
          // Sort process IDs numerically
          processIds.sort((a, b) => a - b);
          
          // Create datasets for each process's segments
          const datasets = [];
          
          processIds.forEach(pid => {
            // Find the process(es) with this ID
            const processEntries = processGroup.result.filter(p => p.processId === pid);
            
            processEntries.forEach(process => {
              // For FIFO and SJF, use startTime and endTime directly
              if (processGroup.name === "FIFO" || processGroup.name === "SJF") {
                datasets.push({
                  label: `Process ${process.processId}`,
                  data: [{
                    y: process.processId, // Use process ID as y value
                    x: [process.startTime, process.endTime]
                  }],
                  backgroundColor: `rgba(75, 192, 192, 0.6)`,
                  barPercentage: 0.95
                });
              } else {
                // For RR and STCF, use segments or executionSegments
                if (process.segments && process.segments.length > 0) {
                  process.segments.forEach((segment, index) => {
                    datasets.push({
                      label: `Process ${process.processId} (Segment ${index + 1})`,
                      data: [{
                        y: process.processId, // Use process ID as y value
                        x: [segment.startTime, segment.endTime]
                      }],
                      backgroundColor: `rgba(75, 192, 192, 0.6)`,
                      barPercentage: 0.95
                    });
                  });
                } else if (process.executionSegments && process.executionSegments.length > 0) {
                  process.executionSegments.forEach((segment, index) => {
                    datasets.push({
                      label: `Process ${process.processId} (Segment ${index + 1})`,
                      data: [{
                        y: process.processId, // Use process ID as y value
                        x: [segment.startTime, segment.endTime]
                      }],
                      backgroundColor: `rgba(75, 192, 192, 0.6)`,
                      barPercentage: 0.95
                    });
                  });
                }
              }
            });
          });

          // Prepare the data for the chart
          const data = {
            labels: processIds.map(id => `Process ${id}`), // Labels for the y-axis
            datasets: datasets
          };

          const options = {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              },
              title: {
                display: false
              },
              tooltip: {
                callbacks: {
                  title: (tooltipItems) => {
                    return `Process ${tooltipItems[0].raw.y}`;
                  },
                  label: (tooltipItem) => {
                    const start = tooltipItem.raw.x[0];
                    const end = tooltipItem.raw.x[1];
                    return `Time: ${start} - ${end}`;
                  }
                }
              }
            },
            scales: {
              x: {
                type: 'linear',
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Time'
                }
              },
              y: {
                type: 'category',
                title: {
                  display: true,
                  text: 'Process ID'
                },
                reverse: true, // Process 1 at the bottom, increasing upwards
                ticks: {
                  // Ensure the y-axis labels match the process IDs
                  callback: (value) => `Process ${value}`
                }
              }
            }
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