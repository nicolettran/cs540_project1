import React, { useState } from "react";
import InputForm from "./components/InputForm";
import AlgorithmSelector from "./components/AlgorithmSelector";
import ResultsDisplay from "./components/ResultsDisplay";

function App() {
  const [processes, setProcesses] = useState([]);
  const [results, setResults] = useState([]);

  const handleGenerateProcesses = ({ numProcesses }) => {
    // Generate random processes
    const newProcesses = Array.from({ length: numProcesses }, (_, i) => ({
      arrivalTime: Math.floor(Math.random() * 10), // Random arrival time
      burstTime: Math.floor(Math.random() * 10) + 1, // Random burst time
    }));
    setProcesses(newProcesses);
    setResults([]); // Clear previous results
  };

  const handleSelectAlgorithm = (algorithm) => {
    let computedResults = [];

    // Simulate FIFO (Example)
    if (algorithm === "FIFO") {
      let completionTime = 0;
      computedResults = processes.map((process) => {
        completionTime += process.burstTime;
        return { ...process, completionTime };
      });
    }

    // Update results
    setResults(computedResults);
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
