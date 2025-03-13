import React from "react";

const AlgorithmSelector = ({ onSelectAlgorithm }) => {
  const algorithms = ["FIFO", "SJF", "STCF", "RR", "MLFQ"];

  return (
    <div>
      <h3>Select CPU Scheduling Algorithm</h3>
      {algorithms.map((algo) => (
        <button key={algo} onClick={() => onSelectAlgorithm(algo)}>
          {algo}
        </button>
      ))}
    </div>
  );
};

export default AlgorithmSelector;

