import React, { useState } from "react";

const InputForm = ({ onSubmit }) => {
  const [numProcesses, setNumProcesses] = useState(5); // Corrected variable name
  const [timeQuantum, setTimeQuantum] = useState(2); // Only used for RR

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ numProcesses, timeQuantum }); // Pass the correct variable name
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Number of Processes:
        <input
          type="number"
          value={numProcesses}
          onChange={(e) => setNumProcesses(parseInt(e.target.value, 10))} // Ensure it's a number
          min="1"
        />
      </label>
      <br />
      <label>
        Time Quantum (for RR):
        <input
          type="number"
          value={timeQuantum}
          onChange={(e) => setTimeQuantum(parseInt(e.target.value, 10))} // Ensure it's a number
          min="1"
        />
      </label>
      <br />
      <button type="submit">Generate Processes</button>
    </form>
  );
};

export default InputForm;

