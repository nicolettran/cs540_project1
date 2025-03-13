export const rr = (processes, timeQuantum) => {
  let currentTime = 0;
  const results = [];
  const queue = [];
  const remainingProcesses = processes.map((process) => ({
    ...process,
    remainingTime: process.burstTime,
  }));

  while (remainingProcesses.length > 0 || queue.length > 0) {
    // Add processes that have arrived to the queue
    remainingProcesses.forEach((process) => {
      if (process.arrivalTime <= currentTime) {
        queue.push(process);
        remainingProcesses.splice(remainingProcesses.indexOf(process), 1);
      }
    });

    if (queue.length === 0) {
      // No processes in the queue, increment time
      currentTime++;
      continue;
    }

    const nextProcess = queue.shift();
    const startTime = currentTime;
    const executionTime = Math.min(timeQuantum, nextProcess.remainingTime);
    const endTime = startTime + executionTime;
    nextProcess.remainingTime -= executionTime;
    currentTime = endTime;

    if (nextProcess.remainingTime === 0) {
      // Process completed
      results.push({
        ...nextProcess,
        startTime,
        endTime,
      });
    } else {
      // Re-add the process to the queue
      queue.push(nextProcess);
    }
  }

  return results;
};