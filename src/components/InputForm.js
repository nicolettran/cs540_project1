import React from "react";

const InputForm = ({
  numProcesses,
  setNumProcesses,
  timeQuantum,
  setTimeQuantum,
  selectedAlgorithm,
  setSelectedAlgorithm,
  runAlgorithm,
}) => {
  return (
    <div>
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
      </div>
      <button onClick={runAlgorithm}>Run Algorithm</button>
    </div>
  );
};

export default InputForm;
