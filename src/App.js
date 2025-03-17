import React, { useState, useEffect } from "react";
import { generateProcesses } from "./utils/processGenerator";
import { fifo } from "./algorithms/fifo";
import { sjf } from "./algorithms/sjf";
import { stcf } from "./algorithms/stcf";
import { rr } from "./algorithms/rr";
import { mlfq } from "./algorithms/mlfq";
import ResultsDisplay from "./components/ResultsDisplay";
import ProcessChart from "./components/ProcessChart";
import { jsPDF } from "jspdf";
import { applyPlugin } from "jspdf-autotable";
import "./styles/App.css";

// Apply the autoTable plugin to jsPDF
applyPlugin(jsPDF);

function App() {
  const [numProcesses, setNumProcesses] = useState(5);
  const [timeQuantum, setTimeQuantum] = useState(2);
  const [processes, setProcesses] = useState([]);
  const [selectedAlgorithms, setSelectedAlgorithms] = useState({
    FIFO: false,
    SJF: false,
    STCF: false,
    RR: false,
    MLFQ: false,
  });
  const [results, setResults] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("No results to display.");
  const [showChooseAlgorithmsMessage, setShowChooseAlgorithmsMessage] = useState(false);
  const [chartsReady, setChartsReady] = useState(false);

  // Generate random processes
  const handleGenerateProcesses = () => {
    setLoadingMessage("Generating processes");
    let dots = 0;
    const loadingInterval = setInterval(() => {
      setLoadingMessage("Generating processes" + ".".repeat(dots));
      dots = (dots + 1) % 4;
    }, 500);

    const generatedProcesses = generateProcesses(numProcesses);
    setProcesses(generatedProcesses);
    setResults([]);
    setCurrentTime(0);
    setIsRunning(false);
    setChartsReady(false);

    setTimeout(() => {
      clearInterval(loadingInterval);
      setLoadingMessage("");
      setShowChooseAlgorithmsMessage(true);
    }, 2500);
  };

  // Run selected algorithms
  const runAlgorithms = () => {
    if (processes.length === 0) {
      alert("Please generate processes first.");
      return;
    }

    const algorithmsResults = [];
    if (selectedAlgorithms.FIFO) {
      algorithmsResults.push({ name: "FIFO", result: fifo([...processes]) });
    }
    if (selectedAlgorithms.SJF) {
      algorithmsResults.push({ name: "SJF", result: sjf([...processes]) });
    }
    if (selectedAlgorithms.STCF) {
      algorithmsResults.push({ name: "STCF", result: stcf([...processes]) });
    }
    if (selectedAlgorithms.RR) {
      algorithmsResults.push({ name: "RR", result: rr([...processes], timeQuantum) });
    }
    if (selectedAlgorithms.MLFQ) {
      algorithmsResults.push({ name: "MLFQ", result: mlfq([...processes]) });
    }

    setResults(algorithmsResults);
    setIsRunning(true);
    setShowChooseAlgorithmsMessage(false);
    setChartsReady(false);
    
    // Set a timer to mark charts as ready after a delay
    setTimeout(() => {
      setChartsReady(true);
    }, 1000);
  };

  // Function to export the table and Gantt charts as PDF
  const exportToPDF = () => {
    if (!chartsReady) {
      // If charts aren't ready yet, wait a bit longer
      setTimeout(exportToPDF, 500);
      return;
    }
    
    const doc = new jsPDF();
    let yOffset = 20;

    results.forEach((algorithmResult, index) => {
      const tableData = algorithmResult.result.map((result) => {
        const row = [
          result.processId,
          result.arrivalTime,
          result.burstTime,
          result.startTime,
          result.endTime,
          result.waitingTime,
        ];

        if (["RR", "STCF", "MLFQ"].includes(algorithmResult.name)) {
          row.push(
            result.segments
              ? result.segments.map((segment) => `${segment.startTime}-${segment.endTime}`).join(", ")
              : "No segments"
          );
        }

        return row;
      });

      const headers = [
        "Process ID",
        "Arrival Time",
        "Burst Time",
        "Start Time",
        "End Time",
        "Waiting Time",
      ];

      if (["RR", "STCF", "MLFQ"].includes(algorithmResult.name)) {
        headers.push("Execution Segments");
      }

      doc.text(algorithmResult.name, 10, yOffset);
      doc.autoTable({
        head: [headers],
        body: tableData,
        startY: yOffset + 10,
        theme: "grid",
      });

      const tableHeight = doc.lastAutoTable.finalY;
      yOffset = tableHeight + 20;

      // Find and capture the chart
      const chartElement = document.querySelector(`.gantt-chart:nth-child(${index + 1}) canvas`);
      
      if (chartElement) {
        try {
          const imgData = chartElement.toDataURL("image/png");
          const chartWidth = 140;
          const chartHeight = 60;
          doc.addImage(imgData, "PNG", 10, yOffset, chartWidth, chartHeight);
          yOffset += chartHeight + 20;
        } catch (error) {
          console.error("Error capturing chart:", error);
        }
      }

      if (index < results.length - 1) {
        doc.addPage();
        yOffset = 20;
      }
    });

    doc.save("results.pdf");
  };

  // Simulate the passage of time
  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setCurrentTime((prevTime) => prevTime + 1);
      }, 1000);

      if (currentTime >= Math.max(...results.flatMap(result => result.result.map(process => process.endTime)))) {
        setIsRunning(false);
        // Mark charts as ready when simulation completes
        setChartsReady(true);
      }

      return () => clearInterval(interval);
    }
  }, [isRunning, currentTime, results]);

  const handleAlgorithmSelection = (e) => {
    const { name, checked } = e.target;
    setSelectedAlgorithms((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  return (
    <div className="app-container">
      <h1 className="fade-in">₊˚⊹ ꒰ᐢ. .ᐢ꒱ᰔ˚₊‧ ୨୧ ‧₊˚ ⋅ CPU Scheduling Simulator ⋅˚₊‧ ୨୧ ‧₊˚❀⋆.ೃ࿔*:･</h1>
      <div className="input-container slide-in">
        <div className="input-group">
          <label>Number of processes: </label>
          <input
            type="number"
            value={numProcesses}
            onChange={(e) => setNumProcesses(parseInt(e.target.value))}
          />
        </div>
        <div className="input-group">
          <label>Time Quantum (for RR): </label>
          <input
            type="number"
            value={timeQuantum}
            onChange={(e) => setTimeQuantum(parseInt(e.target.value))}
          />
        </div>
        <button onClick={handleGenerateProcesses}>Generate processes</button>
        <div className="input-group">
          <label>Select algorithms: </label>
          <div>
            {["FIFO", "SJF", "STCF", "RR", "MLFQ"].map((algorithm) => (
              <div key={algorithm} className="checkbox-group">
                <input
                  type="checkbox"
                  name={algorithm}
                  id={algorithm}
                  checked={selectedAlgorithms[algorithm]}
                  onChange={handleAlgorithmSelection}
                />
                <label htmlFor={algorithm}>{algorithm}</label>
              </div>
            ))}
          </div>
        </div>
        <button onClick={runAlgorithms}>Run algorithms</button>
      </div>
      <div className="results-container fade-in">
        <h2>Results ₍⑅ᐢ..ᐢ₎</h2>
        <div className="loading-message">{loadingMessage}</div>
        {showChooseAlgorithmsMessage && !results.length && (
          <div className="loading-message">Please choose any algorithm to run.</div>
        )}
        {results.length > 0 && (
          <>
            <ResultsDisplay results={results} />
            <button className="button-common" onClick={exportToPDF} disabled={!chartsReady}>
              Export as PDF
            </button>
          </>
        )}
      </div>
      <div className="animation-container slide-in">
        <h2>Simulation ₍ᐢ.  ̫.ᐢ₎</h2>
        <ProcessChart processes={results} currentTime={currentTime} numProcesses={numProcesses} />
      </div>
    </div>
  );
}

export default App;