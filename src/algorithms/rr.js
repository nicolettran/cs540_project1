export const rr = (processes, timeQuantum) => {
  let currentTime = 0;
  const results = [];
  const queue = [];
  const remainingProcesses = processes.map((process) => ({
    ...process,
    remainingTime: process.burstTime, // Track remaining burst time
    waitingTime: 0,                   // Track waiting time
    startTime: null,                  // Track start time
  }));

  // While there are processes remaining to be scheduled or queue is not empty
  while (remainingProcesses.length > 0 || queue.length > 0) {
    // Add all processes that have arrived up to the current time to the queue
    for (let i = 0; i < remainingProcesses.length; i++) {
      if (remainingProcesses[i].arrivalTime <= currentTime) {
        queue.push(remainingProcesses[i]);
        remainingProcesses.splice(i, 1);
        i--; // Adjust index after splicing
      }
    }

    // If no processes are in the queue, jump forward to the next process arrival time
    if (queue.length === 0) {
      if (remainingProcesses.length > 0) {
        currentTime = remainingProcesses[0].arrivalTime;
      }
      continue;
    }

    // Get the next process from the queue
    const nextProcess = queue.shift();

    // Set start time if not already set (first time it's executing)
    if (nextProcess.startTime === null) {
      nextProcess.startTime = currentTime;
    }

    // Calculate execution time (either the time quantum or the remaining time of the process)
    const executionTime = Math.min(timeQuantum, nextProcess.remainingTime);
    nextProcess.remainingTime -= executionTime;
    currentTime += executionTime; // Update the current time

    // If the process has finished, record the end time
    if (nextProcess.remainingTime === 0) {
      nextProcess.endTime = currentTime;
      results.push({ ...nextProcess });
    } else {
      // If the process is not finished, add it back to the queue for the next cycle
      queue.push(nextProcess);
    }

    // Update waiting times for all processes in the queue (they waited for executionTime)
    queue.forEach((process) => {
      process.waitingTime += executionTime;
    });
  }

  // Calculate the final turnaround time and waiting time after all processes finish
  results.forEach((process) => {
    process.turnaroundTime = process.endTime - process.arrivalTime;
    process.waitingTime = process.turnaroundTime - process.burstTime;
  });

  return results;
};
