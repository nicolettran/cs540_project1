export const generateProcesses = (numProcesses) => {
    const processes = [];
    for (let i = 1; i <= numProcesses; i++) {
      processes.push({
        processId: i,
        arrivalTime: Math.floor(Math.random() * 10), // Random arrival time between 0 and 9
        burstTime: Math.floor(Math.random() * 10) + 1, // Random burst time between 1 and 10
      });
    }
    return processes;
  };