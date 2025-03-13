export const stcf = (processes) => {
  let currentTime = 0;
  const results = [];
  const remainingProcesses = processes.map((process) => ({
    ...process,
    remainingTime: process.burstTime,
  }));

  while (remainingProcesses.length > 0) {
    // Filter processes that have arrived
    const availableProcesses = remainingProcesses.filter(
      // eslint-disable-next-line no-loop-func
      (process) => process.arrivalTime <= currentTime
    );

    if (availableProcesses.length === 0) {
      // No processes available, increment time
      currentTime++;
      continue;
    }

    // Find the process with the shortest remaining time
    const nextProcess = availableProcesses.reduce((prev, curr) =>
      curr.remainingTime < prev.remainingTime ? curr : prev
    );

    const startTime = currentTime;
    const endTime = startTime + 1; // Simulate 1 unit of time
    nextProcess.remainingTime -= 1;
    currentTime = endTime;

    if (nextProcess.remainingTime === 0) {
      // Process completed
      results.push({
        ...nextProcess,
        startTime,
        endTime: currentTime,
      });
      // Remove the completed process
      remainingProcesses.splice(remainingProcesses.indexOf(nextProcess), 1);
    }
  }

  return results;
};
  
  