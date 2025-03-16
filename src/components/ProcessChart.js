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
          
          // Create labels for the y-axis
          const labels = processIds.map(id => `${id}`);
          
          // Prepare datasets for the chart
          const datasets = [];
          
          // Group data by process ID for RR and STCF
          if (processGroup.name === "RR" || processGroup.name === "STCF") {
            // Create one dataset per process ID
            processIds.forEach(processId => {
              // Find all segments for this process ID
              const processInstances = processGroup.result.filter(p => p.processId === processId);
              
              // Collect all segments
              const allSegments = [];
              processInstances.forEach(process => {
                const segments = process.segments || process.executionSegments || [];
                segments.forEach(segment => {
                  allSegments.push({
                    startTime: segment.startTime,
                    endTime: segment.endTime
                  });
                });
              });
              
              // Add all segments as separate data points in the same dataset
              datasets.push({
                label: `Process ${processId}`,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                data: allSegments.map(segment => ({
                  x: [segment.startTime, segment.endTime],
                  y: `${processId}`
                })),
                barPercentage: 0.95
              });
            });
          } else {
            // For FIFO or SJF, keep the original approach
            processGroup.result.forEach(process => {
              const processId = process.processId;
              const backgroundColor = 'rgba(75, 192, 192, 0.6)';
              
              datasets.push({
                label: `Process ${processId}`,
                backgroundColor,
                data: [{ 
                  x: [process.startTime, process.endTime], 
                  y: `${processId}` 
                }],
                barPercentage: 0.95
              });
            });
          }

          const data = {
            labels: labels,
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
                title: {
                  display: true,
                  text: 'Process ID'
                },
                type: 'category',
                position: 'left'
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