import React from "react";

const ResultsDisplay = ({ results }) => {
  return (
    <div>
      <h3>Scheduling Results</h3>
      {results.length > 0 ? (
        <table border="1">
          <thead>
            <tr>
              <th>Process</th>
              <th>Arrival Time</th>
              <th>Burst Time</th>
              <th>Completion Time</th>
            </tr>
          </thead>
          <tbody>
            {results.map((process) => (
              <tr key={process.id}>
                <td>{`P${process.id}`}</td> {/* Using process.id instead of index */}
                <td>{process.arrivalTime}</td>
                <td>{process.burstTime}</td>
                <td>{process.completionTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No results yet. Run an algorithm.</p>
      )}
    </div>
  );
};

export default ResultsDisplay;
