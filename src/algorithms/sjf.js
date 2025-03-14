export const sjf = (processes) => {
  let currentTime = 0;
  const results = [];

  // Sort processes by arrival time to ensure we always check the earliest arrival first
  processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

  while (processes.length > 0) {
    // Filter processes that have arrived
    const availableProcesses = processes.filter(
      (process) => process.arrivalTime <= currentTime
    );

    if (availableProcesses.length === 0) {
      // If no processes have arrived, move time forward to the next process's arrival time
      currentTime = Math.min(...processes.map((p) => p.arrivalTime));
      continue;
    }

    // Find the process with the shortest burst time
    const nextProcess = availableProcesses.reduce((prev, curr) =>
      curr.burstTime < prev.burstTime ? curr : prev
    );

    const startTime = currentTime;
    const endTime = startTime + nextProcess.burstTime;
    currentTime = endTime;

    const waitingTime = startTime - nextProcess.arrivalTime; // Waiting time calculation

    results.push({ ...nextProcess, startTime, endTime, waitingTime });

    // Remove the scheduled process from the list
    processes = processes.filter(
      (process) => process.processId !== nextProcess.processId
    );
  }

  return results;
};
