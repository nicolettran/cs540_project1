export const rr = (processes, timeQuantum) => {
  let currentTime = 0; // Tracks total time elapsed
  let queue = []; // Ready queue
  let results = []; // Final results array

  // Initialize process tracking
  let remainingProcesses = processes.map((p) => ({
    ...p,
    remainingTime: p.burstTime,
    startTime: null,
    endTime: null,
    waitingTime: 0,
    turnaroundTime: 0,
    lastCompletionTime: 0, // Track when a process last finished executing
  }));

  // Sort processes by arrival time
  remainingProcesses.sort((a, b) => a.arrivalTime - b.arrivalTime);

  let index = 0; // Track next process to arrive

  // Add initial processes arriving at time 0
  while (index < remainingProcesses.length && remainingProcesses[index].arrivalTime <= currentTime) {
    queue.push(remainingProcesses[index]);
    index++;
  }

  // Main scheduling loop
  while (queue.length > 0 || index < remainingProcesses.length) {
    if (queue.length === 0) {
      // Jump to next arriving process if queue is empty
      currentTime = remainingProcesses[index].arrivalTime;
      while (index < remainingProcesses.length && remainingProcesses[index].arrivalTime <= currentTime) {
        queue.push(remainingProcesses[index]);
        index++;
      }
      continue;
    }

    let process = queue.shift();

    // Calculate waiting time correctly
    if (process.startTime === null) {
      process.waitingTime = currentTime - process.arrivalTime;
    } else {
      process.waitingTime += currentTime - process.lastCompletionTime;
    }

    // Set start time only the first time it runs
    if (process.startTime === null) {
      process.startTime = currentTime;
    }

    // Execution time
    let executionTime = Math.min(timeQuantum, process.remainingTime);
    process.remainingTime -= executionTime;
    currentTime += executionTime;
    
    // Update the completion time
    process.lastCompletionTime = currentTime;

    // Add new arrivals during execution **before re-adding current process**
    while (index < remainingProcesses.length && remainingProcesses[index].arrivalTime <= currentTime) {
      queue.push(remainingProcesses[index]);
      index++;
    }

    if (process.remainingTime === 0) {
      // Process is completed
      process.endTime = currentTime;
      process.turnaroundTime = process.endTime - process.arrivalTime;
      results.push(process);
    } else {
      // Re-add to queue **after** processing new arrivals
      queue.push(process);
    }
  }

  return results;
};
