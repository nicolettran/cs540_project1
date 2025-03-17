import React, { useState, useEffect } from "react";
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
  const [animationTime, setAnimationTime] = useState(0);
  const [animationRunning, setAnimationRunning] = useState(false);
  const [maxTime, setMaxTime] = useState(0);

  // Generate a moderately saturated pastel color palette for processes
  const generatePastelPalette = (numColors) => {
    const pastelColors = [
      'rgba(132, 199, 255, 0.82)',  // Moderate pastel Blue
      'rgba(245, 140, 186, 0.82)',  // Moderate pastel Pink
      'rgba(145, 214, 149, 0.82)',  // Moderate pastel Green
      'rgba(255, 183, 107, 0.82)',  // Moderate pastel Orange
      'rgba(175, 142, 225, 0.82)',  // Moderate pastel Purple
      'rgba(255, 240, 124, 0.82)',  // Moderate pastel Yellow
      'rgba(125, 211, 207, 0.82)',  // Moderate pastel Teal
      'rgba(255, 158, 140, 0.82)',  // Moderate pastel Coral
      'rgba(209, 160, 220, 0.82)',  // Moderate pastel Lavender
      'rgba(167, 213, 130, 0.82)',  // Moderate pastel Lime
      'rgba(143, 163, 174, 0.82)',  // Moderate pastel Blue Gray
      'rgba(255, 182, 154, 0.82)',  // Moderate pastel Peach
    ];
    
    // If we need more colors than in our palette, generate additional pastel colors
    if (numColors > pastelColors.length) {
      for (let i = pastelColors.length; i < numColors; i++) {
        // Generate moderately saturated pastel colors
        const r = Math.floor(Math.random() * 75) + 180; // 180-255 range
        const g = Math.floor(Math.random() * 75) + 180; // 180-255 range
        const b = Math.floor(Math.random() * 75) + 180; // 180-255 range
        pastelColors.push(`rgba(${r}, ${g}, ${b}, 0.82)`);
      }
    }
    
    return pastelColors;
  };

  // Calculate dynamic height based on the number of processes
  const chartHeight = Math.max(200, numProcesses * 40); // Minimum height of 200px, 40px per process

  // Initialize animation when processes change
  useEffect(() => {
    if (processes && processes.length > 0) {
      // Find the maximum end time across all processes
      const maxEndTime = Math.max(...processes.flatMap(processGroup => 
        processGroup.result.map(process => process.endTime)
      ));
      
      setMaxTime(maxEndTime);
      setAnimationTime(0);
      setAnimationRunning(true);
    }
  }, [processes]);

  // Run the animation
  useEffect(() => {
    if (animationRunning && maxTime > 0) {
      const animationDuration = 10000; // 10 seconds
      const stepTime = animationDuration / maxTime;
      
      const interval = setInterval(() => {
        setAnimationTime(prevTime => {
          const newTime = prevTime + 1;
          if (newTime >= maxTime) {
            clearInterval(interval);
            setAnimationRunning(false);
            return maxTime;
          }
          return newTime;
        });
      }, stepTime);
      
      return () => clearInterval(interval);
    }
  }, [animationRunning, maxTime]);

  if (!processes || processes.length === 0) {
    return <div className="no-processes-message">No processes to display.</div>;
  }

  return (
    <div>
      <h3 className="process-chart-title">Process Gantt Charts</h3>
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
          
          // Generate pastel color palette based on the number of unique processes
          const colorPalette = generatePastelPalette(processIds.length);
          
          // Prepare datasets for the chart
          const datasets = [];
          
          // Group data by process ID for RR, STCF, and MLFQ
          if (processGroup.name === "RR" || processGroup.name === "STCF" || processGroup.name === "MLFQ") {
            processIds.forEach((processId, colorIndex) => {
              // Find all segments for this process ID
              const processInstances = processGroup.result.filter(p => p.processId === processId);
              
              // Collect all segments
              const allSegments = [];
              processInstances.forEach(process => {
                const segments = process.segments || process.executionSegments || [];
                segments.forEach(segment => {
                  // Apply animation to the segment end time
                  const animatedEndTime = Math.min(
                    segment.endTime, 
                    Math.max(segment.startTime, animationTime)
                  );
                  
                  // Only include segments that have started
                  if (segment.startTime <= animationTime) {
                    allSegments.push({
                      startTime: segment.startTime,
                      endTime: animatedEndTime
                    });
                  }
                });
              });
              
              // Use the mapped index (1-based) for display
              const displayId = processIdToIndexMap[processId];
              
              // Use the color from our pastel palette based on the process index
              const backgroundColor = colorPalette[colorIndex % colorPalette.length];
              
              datasets.push({
                label: `Process ${displayId}`,
                backgroundColor,
                data: allSegments.map(segment => ({
                  x: [segment.startTime, segment.endTime],
                  y: `${displayId}`
                })),
                barPercentage: 6,
                categoryPercentage: .4,
              });
            });
          } else {
            // For FIFO or SJF
            processGroup.result.forEach(process => {
              const processId = process.processId;
              const displayId = processIdToIndexMap[processId];
              
              // Get the color index for this process - subtract 1 because displayId starts at 1
              const colorIndex = displayId - 1;
              const backgroundColor = colorPalette[colorIndex % colorPalette.length];
              
              // Apply animation to the process end time
              if (process.startTime <= animationTime) {
                const animatedEndTime = Math.min(
                  process.endTime, 
                  Math.max(process.startTime, animationTime)
                );
                
                datasets.push({
                  label: `Process ${displayId}`,
                  backgroundColor,
                  data: [{ 
                    x: [process.startTime, animatedEndTime], 
                    y: `${displayId}` 
                  }],
                  barPercentage: 6,
                  categoryPercentage: .4,
                });
              }
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
                max: maxTime, // Set max to the highest end time
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
            },
            animation: {
              duration: 0 // Disable default animations as we're handling them ourselves
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