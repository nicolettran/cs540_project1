export const stcf = (processes) => {
  let currentTime = 0;
  const results = [];
  const remainingProcesses = processes.map((process) => ({
    ...process,
    remainingTime: process.burstTime,
    startTime: null,
    totalWaitTime: 0, // Track total waiting time
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

    // If the process is not being executed at this moment, increment the wait time
    if (nextProcess.startTime !== currentTime) {
      nextProcess.totalWaitTime++;
    }

    // Simulate 1 unit of time for the selected process
    nextProcess.remainingTime -= 1;
    currentTime++;

    if (nextProcess.remainingTime === 0) {
      // Process completed, record its end time and remove it from the list
      results.push({
        ...nextProcess,
        endTime: currentTime,
        waitingTime: nextProcess.totalWaitTime, // Record the total waiting time
      });
      remainingProcesses.splice(remainingProcesses.indexOf(nextProcess), 1);
    }
  }

  return results;
};

