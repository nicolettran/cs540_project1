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
        {processes.map((processGroup, groupIndex) => {
          // Get all unique process IDs
          let processIds = [...new Set(processGroup.result.map(p => p.processId))];
          processIds.sort((a, b) => a - b); // Ensure numerical sorting
          
          // Create a proper sequential numbering from 1 to N
          const processIdToIndexMap = {};
          processIds.forEach((id, index) => {
            processIdToIndexMap[id] = index + 1; // Map to 1-based index
          });
          
          // Create labels for the y-axis with sequential numbering
          const labels = Array.from({ length: processIds.length }, (_, i) => `${i + 1}`);
          
          // Prepare datasets for the chart
          const datasets = [];
          
          // Group data by process ID for RR, STCF, and MLFQ
          if (processGroup.name === "RR" || processGroup.name === "STCF" || processGroup.name === "MLFQ") {
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
              
              // Use the mapped index (1-based) for display
              const displayId = processIdToIndexMap[processId];
              
              datasets.push({
                label: `Process ${displayId}`,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                data: allSegments.map(segment => ({
                  x: [segment.startTime, segment.endTime],
                  y: `${displayId}`
                })),
                barPercentage: 6,
                categoryPercentage: .4,
              });
            });
          } else {
            // For FIFO or SJF, keep the original approach but with mapped IDs
            processGroup.result.forEach(process => {
              const processId = process.processId;
              const displayId = processIdToIndexMap[processId];
              const backgroundColor = 'rgba(75, 192, 192, 0.6)';
              
              datasets.push({
                label: `Process ${displayId}`,
                backgroundColor,
                data: [{ 
                  x: [process.startTime, process.endTime], 
                  y: `${displayId}` 
                }],
                barPercentage: 6,
                categoryPercentage: .4,
              });
            });
          }

          // Prevent empty datasets and handle case for very few processes
          if (datasets.length === 0) {
            return null; // Skip rendering if no data is available for this process group
          }

          const data = {
            labels,
            datasets
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
                position: 'left',
                min: 0,
                max: numProcesses,
                ticks: {
                  autoSkip: false
                }
              }
            }
          };

          return (
            <div key={processGroup.name} className="gantt-chart" style={{ height: `${chartHeight}px` }}>
              <h4 className="gantt-algo-title">{processGroup.name}</h4>
              <div className="chart-wrapper">
                <Bar
                  id={`gantt-chart-${processGroup.name}-${groupIndex}`} // Add a unique ID for each chart
                  data={data}
                  options={options}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProcessChart;
