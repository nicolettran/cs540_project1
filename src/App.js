import React, { useState } from "react";
import InputForm from "./components/InputForm";
import AlgorithmSelector from "./components/AlgorithmSelector";
import ResultsDisplay from "./components/ResultsDisplay";
import { fifo } from "./algorithms/fifo";
import { sjf } from "./algorithms/sjf";
import { stcf } from "./algorithms/stcf";

function App() {
  const [processes, setProcesses] = useState([]);
  const [results, setResults] = useState([]);

  const handleGenerateProcesses = ({ numProcesses }) => {
    const newProcesses = Array.from({ length: numProcesses }, (_, i) => ({
      id: i + 1,
      arrivalTime: Math.floor(Math.random() * 10),
      burstTime: Math.floor(Math.random() * 10) + 1,
      remainingBurstTime: Math.floor(Math.random() * 10) + 1, // Add remaining burst time for STCF
    }));

    newProcesses.sort((a, b) => a.arrivalTime - b.arrivalTime);
    setProcesses(newProcesses);
    setResults([]); // Clear previous results
  };

  const handleSelectAlgorithm = (algorithm) => {
    console.log(processes); // Log the processes to ensure they are generated correctly
    let computedResults = [];

    if (algorithm === "FIFO") {
      computedResults = fifo(processes);
    } else if (algorithm === "SJF") {
      computedResults = sjf(processes);
    } else if (algorithm === "STCF") {
      computedResults = stcf(processes);
    }

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



