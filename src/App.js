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

  // Generate random processes
  const handleGenerateProcesses = () => {
    const generatedProcesses = generateProcesses(numProcesses);
    setProcesses(generatedProcesses);
    setResults([]); // Clear previous results
    setCurrentTime(0); // Reset time
    setIsRunning(false); // Stop any running simulation
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
    setIsRunning(true); // Start the simulation
  };

  // Simulate the passage of time
  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setCurrentTime((prevTime) => prevTime + 1);
      }, 1000); // Update every second

      // Stop the simulation when all processes are completed
      if (currentTime >= Math.max(...results.flatMap(result => result.result.map(process => process.endTime)))) {
        setIsRunning(false);
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
          <label>Select algorithms: </label>
          <div>
            {["FIFO", "SJF", "STCF", "RR", "MLFQ"].map((algorithm) => (
              <div key={algorithm}>
                <input
                  type="checkbox"
                  name={algorithm}
                  checked={selectedAlgorithms[algorithm]}
                  onChange={handleAlgorithmSelection}
                />
                <label>{algorithm}</label>
              </div>
            ))}
          </div>
        </div>
        <button onClick={runAlgorithms}>Run algorithms</button>
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


