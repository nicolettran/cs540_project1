import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import { applyPlugin } from "jspdf-autotable";

// Apply the autoTable plugin to jsPDF
applyPlugin(jsPDF);

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

      return () => clearInterval(dotInterval);
    }
  }, [processesGenerated, results]);

  // Function to export the table as PDF
  const exportToPDF = () => {
    const doc = new jsPDF();

    results.forEach((algorithmResult) => {
      const tableData = algorithmResult.result.map((result) => {
        const row = [
          result.processId,
          result.arrivalTime,
          result.burstTime,
          result.startTime,
          result.endTime,
          result.waitingTime,
        ];

        if (["RR", "STCF", "MLFQ"].includes(algorithmResult.name)) {
          row.push(
            result.segments
              ? result.segments.map((segment) => `${segment.startTime}-${segment.endTime}`).join(", ")
              : "No segments"
          );
        }

        return row;
      });

      const headers = [
        "Process ID",
        "Arrival Time",
        "Burst Time",
        "Start Time",
        "End Time",
        "Waiting Time",
      ];

      if (["RR", "STCF", "MLFQ"].includes(algorithmResult.name)) {
        headers.push("Execution Segments");
      }

      doc.text(algorithmResult.name, 10, 10);
      doc.autoTable({
        head: [headers],
        body: tableData,
        startY: 20,
      });

      if (results.indexOf(algorithmResult) < results.length - 1) {
        doc.addPage();
      }
    });

    doc.save("results.pdf");
  };

  return (
    <div>
      {results.length === 0 && !processesGenerated && (
        <div>No results to display.</div>
      )}

      {processesGenerated && results.length === 0 && (
        <div>
          <div>{loadingText}{dots}</div>
        </div>
      )}

      {processesGenerated && results.length === 0 && dots === "." && (
        <div>Please choose any algorithm to run.</div>
      )}

      {results.length > 0 && (
        <div>
          <button className="button-common" onClick={exportToPDF}>
            Export as PDF
          </button>
          {results.map((algorithmResult) => (
            <div key={algorithmResult.name}>
              <h4 className="algorithm-title">{algorithmResult.name}</h4>
              <table>
                <thead>
                  <tr>
                    <th>Process ID</th>
                    <th>Arrival Time</th>
                    <th>Burst Time</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Waiting Time</th>
                    {["RR", "STCF", "MLFQ"].includes(algorithmResult.name) && (
                      <th>Execution Segments</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {algorithmResult.result.map((result, index) => (
                    <tr key={index}>
                      <td>{result.processId}</td>
                      <td>{result.arrivalTime}</td>
                      <td>{result.burstTime}</td>
                      <td>{result.startTime}</td>
                      <td>{result.endTime}</td>
                      <td>{result.waitingTime}</td>
                      {["RR", "STCF", "MLFQ"].includes(algorithmResult.name) && (
                        <td>
                          {result.segments ? (
                            result.segments.map((segment, idx) => (
                              <div key={idx}>
                                {segment.startTime} - {segment.endTime}
                              </div>
                            ))
                          ) : (
                            <div>No segments</div>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResultsDisplay;
