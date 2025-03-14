export const rr = (processes, timeQuantum) => {
  let currentTime = 0; // Tracks the total time elapsed
  let queue = []; // Ready queue
  let results = []; // Final results array

  // Initialize remaining time, waiting time, and other fields for each process
  let remainingProcesses = processes.map((p) => ({
    ...p,
    remainingTime: p.burstTime, // Initialize remaining burst time
    startTime: null,
    endTime: 0,
    waitingTime: 0,
    turnaroundTime: 0,
  }));

  // Sort processes by arrival time
  remainingProcesses.sort((a, b) => a.arrivalTime - b.arrivalTime);

  let index = 0; // Keeps track of the index of the next process to arrive

  while (queue.length > 0 || index < remainingProcesses.length) {
    // Add processes that have arrived to the queue
    while (index < remainingProcesses.length && remainingProcesses[index].arrivalTime <= currentTime) {
      queue.push(remainingProcesses[index]);
      index++;
    }

    if (queue.length === 0) {
      // If no process is ready, jump to the next arrival
      if (index < remainingProcesses.length) {
        currentTime = remainingProcesses[index].arrivalTime;
      }
      continue;
    }

    let process = queue.shift(); // Pick the first process in the queue

    // Record the start time if it hasn't been set yet
    if (process.startTime === null) {
      process.startTime = currentTime;
    }

    // Calculate the execution time as the minimum between time quantum and remaining burst time
    let executionTime = Math.min(timeQuantum, process.remainingTime);
    process.remainingTime -= executionTime;
    currentTime += executionTime;

    // If the process has finished
    if (process.remainingTime === 0) {
      process.endTime = currentTime;
      process.turnaroundTime = process.endTime - process.arrivalTime;
      process.waitingTime = process.turnaroundTime - process.burstTime;
      results.push(process);
    } else {
      // Re-add the process to the queue if it isn't finished
      queue.push(process);
    }
  }

  return results;
};
