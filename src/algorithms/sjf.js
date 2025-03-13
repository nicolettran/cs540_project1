export const sjf = (processes) => {
  let currentTime = 0;
  const results = [];

  while (processes.length > 0) {
    // Filter processes that have arrived
    const availableProcesses = processes.filter(
      (process) => process.arrivalTime <= currentTime
    );

    if (availableProcesses.length === 0) {
      // No processes available, increment time
      currentTime++;
      continue;
    }

    // Find the process with the shortest burst time
    const nextProcess = availableProcesses.reduce((prev, curr) =>
      curr.burstTime < prev.burstTime ? curr : prev
    );

    const startTime = currentTime;
    const endTime = startTime + nextProcess.burstTime;
    currentTime = endTime;

    results.push({ ...nextProcess, startTime, endTime });

    // Remove the scheduled process from the list
    processes = processes.filter(
      (process) => process.processId !== nextProcess.processId
    );
  }

  return results;
};
  
  