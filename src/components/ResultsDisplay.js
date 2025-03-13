import React from "react";

const ResultsDisplay = ({ results }) => {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Process ID</th>
            <th>Arrival Time</th>
            <th>Burst Time</th>
            <th>Start Time</th>
            <th>End Time</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result) => (
            <tr key={result.processId}>
              <td>{result.processId}</td>
              <td>{result.arrivalTime}</td>
              <td>{result.burstTime}</td>
              <td>{result.startTime}</td>
              <td>{result.endTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultsDisplay;