import React, { useState } from "react";
import { generateProcesses } from "./utils/processGenerator";
import { fifo } from "./algorithms/fifo";
import { sjf } from "./algorithms/sjf";
import { stcf } from "./algorithms/stcf";
import { rr } from "./algorithms/rr";
import { mlfq } from "./algorithms/mlfq";
import ResultsDisplay from "./components/ResultsDisplay";

function App() {
  const [numProcesses, setNumProcesses] = useState(5);
  const [timeQuantum, setTimeQuantum] = useState(2);
  const [processes, setProcesses] = useState([]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("FIFO");
  const [results, setResults] = useState({});
  const [allResults, setAllResults] = useState({});

  // Generate random processes
  const handleGenerateProcesses = () => {
    const generatedProcesses = generateProcesses(numProcesses);
    setProcesses(generatedProcesses);
    setResults({}); // Clear previous results
    setAllResults({}); // Clear all results
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

    setResults({ [selectedAlgorithm]: results });
  };

  // Run all algorithms
  const runAllAlgorithms = () => {
    if (processes.length === 0) {
      alert("Please generate processes first.");
      return;
    }

    const allResults = {
      FIFO: fifo([...processes]),
      SJF: sjf([...processes]),
      STCF: stcf([...processes]),
      RR: rr([...processes], timeQuantum),
      MLFQ: mlfq([...processes]),
    };

    setAllResults(allResults);
  };

  return (
    <div>
      <h1>CPU Scheduling Simulator</h1>
      <div>
        <label>Number of Processes: </label>
        <input
          type="number"
          value={numProcesses}
          onChange={(e) => setNumProcesses(parseInt(e.target.value))}
        />
      </div>
      <div>
        <label>Time Quantum (for RR): </label>
        <input
          type="number"
          value={timeQuantum}
          onChange={(e) => setTimeQuantum(parseInt(e.target.value))}
        />
      </div>
      <button onClick={handleGenerateProcesses}>Generate Processes</button>
      <div>
        <label>Select Algorithm: </label>
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
        <button onClick={runAlgorithm}>Run Algorithm</button>
        <button onClick={runAllAlgorithms}>Run All Algorithms</button>
      </div>
      {Object.keys(results).length > 0 && (
        <div>
          <h2>{selectedAlgorithm} Results</h2>
          <ResultsDisplay results={results[selectedAlgorithm]} />
        </div>
      )}
      {Object.keys(allResults).length > 0 && (
        <div>
          <h2>All Algorithms Results</h2>
          {Object.entries(allResults).map(([algorithm, results]) => (
            <div key={algorithm}>
              <h3>{algorithm}</h3>
              <ResultsDisplay results={results} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;