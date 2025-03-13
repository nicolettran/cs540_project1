/*import React, { useState } from "react";
import InputForm from "./components/InputForm";
import AlgorithmSelector from "./components/AlgorithmSelector";
import ResultsDisplay from "./components/ResultsDisplay";
import { fifo } from "./algorithms/fifo";
import { sjf } from "./algorithms/sjf";
import { stcf } from "./algorithms/stcf";
import { rr } from "./algorithms/rr"; // Import the RR algorithm

function App() {
  const [processes, setProcesses] = useState([]);
  const [results, setResults] = useState([]);
  const [timeQuantum, setTimeQuantum] = useState(2); // Add state for time quantum

  const handleGenerateProcesses = ({ numProcesses, timeQuantum }) => {
    const newProcesses = Array.from({ length: numProcesses }, (_, i) => ({
      id: i + 1, // Unique Process ID
      arrivalTime: Math.floor(Math.random() * 10), // Random arrival time (0-9)
      burstTime: Math.floor(Math.random() * 10) + 1, // Random burst time (1-10)
      remainingBurstTime: Math.floor(Math.random() * 10) + 1, // Initialize remaining burst time
    }));
  
    newProcesses.sort((a, b) => a.arrivalTime - b.arrivalTime); // Sort processes by arrival time
    setProcesses(newProcesses); // Update state
    setResults([]); // Clear previous results
    setTimeQuantum(timeQuantum); // Update time quantum
  };
  

  const handleSelectAlgorithm = (algorithm) => {
    let newResults = [];
    if (algorithm === "FIFO") {
      newResults = fifo(processes);
    } else if (algorithm === "SJF") {
      newResults = sjf(processes);
    } else if (algorithm === "STCF") {
      newResults = stcf(processes);
    } else if (algorithm === "RR") {
      newResults = rr(processes, timeQuantum);
    }
    setResults(newResults || []); // Ensure results is always an array
  };

  return (
    <div>
      <h2>CPU Scheduling Simulator</h2>
      <InputForm onSubmit={handleGenerateProcesses} />
      <AlgorithmSelector onSelectAlgorithm={handleSelectAlgorithm} />
      <ResultsDisplay results={results} />
    </div>
  );
}

export default App;
*/

import { useState } from "react";
import { generateProcesses } from "../utils/processGenerator";

export default function Home() {
  const [numProcesses, setNumProcesses] = useState(0);
  const [processes, setProcesses] = useState([]);

  const handleGenerate = () => {
    const generatedProcesses = generateProcesses(numProcesses);
    setProcesses(generatedProcesses);
  };

  return (
    <div>
      <h1>CPU Scheduling Simulator</h1>
      <input
        type="number"
        placeholder="Number of Processes"
        onChange={(e) => setNumProcesses(parseInt(e.target.value))}
      />
      <button onClick={handleGenerate}>Generate Processes</button>
      <pre>{JSON.stringify(processes, null, 2)}</pre>
    </div>
  );
}