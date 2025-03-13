import React, { useState, useEffect } from "react";
import { generateProcesses } from "./utils/processGenerator";
import { fifo } from "./algorithms/fifo";
import { sjf } from "./algorithms/sjf";
import { stcf } from "./algorithms/stcf";
import { rr } from "./algorithms/rr";
import { mlfq } from "./algorithms/mlfq";
import ResultsDisplay from "./components/ResultsDisplay";
import ProcessChart from "./components/ProcessChart";
import "./styles/App.css"; // Import the CSS file

function App() {
  const [numProcesses, setNumProcesses] = useState(5);
  const [timeQuantum, setTimeQuantum] = useState(2);
  const [processes, setProcesses] = useState([]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("FIFO");
  const [results, setResults] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // Generate random processes
  const handleGenerateProcesses = () => {
    const generatedProcesses = generateProcesses(numProcesses);
    setProcesses(generatedProcesses);
    setResults([]); // Clear previous results
    setCurrentTime(0); // Reset time
    setIsRunning(false); // Stop any running simulation
  };

  // Run the selected algorithm
  const runAlgorithm = () => {
    if (processes.length === 0) {
      alert("Please generate processes first.");
      return;
    }

    let results;

    switch (selectedAlgorithm) {
      case "FIFO":
        results = fifo([...processes]);
        break;
      case "SJF":
        results = sjf([...processes]);
        break;
      case "STCF":
        results = stcf([...processes]);
        break;
      case "RR":
        results = rr([...processes], timeQuantum);
        break;
      case "MLFQ":
        results = mlfq([...processes]);
        break;
      default:
        results = [];
    }

    setResults(results);
    setIsRunning(true); // Start the simulation
  };

  // Simulate the passage of time
  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setCurrentTime((prevTime) => prevTime + 1);
      }, 1000); // Update every second

      // Stop the simulation when all processes are completed
      if (currentTime >= Math.max(...results.map((result) => result.endTime))) {
        setIsRunning(false);
      }

      return () => clearInterval(interval);
    }
  }, [isRunning, currentTime, results]);

  return (
    <div className="app-container">
      <h1 className="fade-in">CPU Scheduling Simulator</h1>
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
          <label>Select algorithm: </label>
          <select
            value={selectedAlgorithm}
            onChange={(e) => setSelectedAlgorithm(e.target.value)}
          >
            <option value="FIFO">FIFO</option>
            <option value="SJF">SJF</option>
            <option value="STCF">STCF</option>
            <option value="RR">RR</option>
            <option value="MLFQ">MLFQ</option>
          </select>
        </div>
        <button onClick={runAlgorithm}>Run algorithm</button>
      </div>
      <div className="results-container fade-in">
        <h2>Results</h2>
        <ResultsDisplay results={results} />
      </div>
      <div className="animation-container slide-in">
        <h2>Simulation</h2>
        <ProcessChart processes={results} currentTime={currentTime} />
      </div>
    </div>
  );
}

export default App;
