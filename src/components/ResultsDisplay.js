import React, { useEffect, useState } from "react";

const ResultsDisplay = ({ results, processesGenerated }) => {
  const [loadingText, setLoadingText] = useState("Generating processes");
  const [dots, setDots] = useState("");

  // Animate the loading text with dots
  useEffect(() => {
    if (processesGenerated && results.length === 0) {
      const dotInterval = setInterval(() => {
        setDots((prevDots) => {
          if (prevDots.length < 3) {
            return prevDots + ".";
          } else {
            return ".";
          }
        });
      }, 500);

      // Clear the interval after 3 dots
      return () => clearInterval(dotInterval);
    }
  }, [processesGenerated, results]);

  return (
    <div>
      {/* Show "No results to display" initially */}
      {results.length === 0 && !processesGenerated && (
        <div>No results to display.</div>
      )}

      {/* Show "Generating processes..." with animated dots */}
      {processesGenerated && results.length === 0 && (
        <div>
          <div>{loadingText}{dots}</div>
        </div>
      )}

      {/* Show "Please choose any algorithms to run" after processes are generated */}
      {processesGenerated && results.length === 0 && dots === "." && (
        <div>Please choose any algorithm to run.</div>
      )}

      {/* Show the results if available */}
      {results.map((algorithmResult) => (
        <div key={algorithmResult.name}>
          <h4 className="algorithm-title">{algorithmResult.name}</h4> {/* Smaller text */}
          <table>
            <thead>
              <tr>
                <th>Process ID</th>
                <th>Arrival Time</th>
                <th>Burst Time</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Waiting Time</th> {/* Add Waiting Time column */}
              </tr>
            </thead>
            <tbody>
              {algorithmResult.result.map((result) => (
                <tr key={result.processId}>
                  <td>{result.processId}</td>
                  <td>{result.arrivalTime}</td>
                  <td>{result.burstTime}</td>
                  <td>{result.startTime}</td>
                  <td>{result.endTime}</td>
                  <td>{result.waitingTime}</td> {/* Display Waiting Time */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default ResultsDisplay;

