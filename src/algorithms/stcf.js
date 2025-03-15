export const stcf = (processes) => {
  let currentTime = 0;
  const results = [];
  const remainingProcesses = processes.map((process) => ({
    ...process,
    remainingTime: process.burstTime,
    startTime: null,
  }));

  while (remainingProcesses.length > 0) {
    // Filter processes that have arrived
    const availableProcesses = remainingProcesses.filter(
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

    // If the process hasn't started yet, assign its start time
    if (nextProcess.startTime === null) {
      nextProcess.startTime = currentTime;
    }

    // Simulate 1 unit of time for the selected process
    nextProcess.remainingTime -= 1;
    currentTime++;

    if (nextProcess.remainingTime === 0) {
      // Process completed, record its end time and remove it from the list
      const endTime = currentTime;
      const waitingTime = endTime - nextProcess.arrivalTime - nextProcess.burstTime;

      results.push({
        ...nextProcess,
        endTime,
        waitingTime,
      });

      remainingProcesses.splice(remainingProcesses.indexOf(nextProcess), 1);
    }
  }

  return results;
};