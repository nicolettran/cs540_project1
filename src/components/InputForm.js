import React, { useState } from "react";

const InputForm = ({ onSubmit }) => {
  const [numProcesses, setNumProcesses] = useState(5);
  const [timeQuantum, setTimeQuantum] = useState(2); // Only used for RR

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ numProcesses, timeQuantum });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Number of Processes:
        <input
          type="number"
          value={numProcesses}
          onChange={(e) => setNumProcesses(e.target.value)}
          min="1"
        />
      </label>
      <br />
      <label>
        Time Quantum (for RR):
        <input
          type="number"
          value={timeQuantum}
          onChange={(e) => setTimeQuantum(e.target.value)}
          min="1"
        />
      </label>
      <br />
      <button type="submit">Generate Processes</button>
    </form>
  );
};

export default InputForm;
