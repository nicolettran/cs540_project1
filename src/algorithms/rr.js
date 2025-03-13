// algorithms/rr.js
export const rr = (processes, timeQuantum) => {
  if (!processes || processes.length === 0) {
    return []; // Return an empty array if no processes are provided
  }

  // Create a copy of processes and sort them by arrival time
  let remainingProcesses = processes.map((p) => ({ ...p })).sort((a, b) => a.arrivalTime - b.arrivalTime);
  let queue = []; // Queue to hold processes ready for execution
  let results = []; // Final results with completion times
  let currentTime = 0; // Current time in the simulation

  while (remainingProcesses.length > 0 || queue.length > 0) {
    // Add processes to the queue that have arrived by the current time
    while (
      remainingProcesses.length > 0 &&
      remainingProcesses[0].arrivalTime <= currentTime
    ) {
      queue.push(remainingProcesses.shift());
    }

    if (queue.length === 0) {
      // If no process is ready, advance time to the next process arrival
      currentTime = remainingProcesses[0].arrivalTime;
      continue;
    }

    // Get the next process from the queue
    let process = queue.shift();

    // Execute the process for the time quantum or its remaining burst time
    let executionTime = Math.min(timeQuantum, process.remainingBurstTime);
    currentTime += executionTime;
    process.remainingBurstTime -= executionTime;

    // Add processes that arrived during this execution time to the queue
    while (
      remainingProcesses.length > 0 &&
      remainingProcesses[0].arrivalTime <= currentTime
    ) {
      queue.push(remainingProcesses.shift());
    }

    if (process.remainingBurstTime > 0) {
      // If the process is not completed, add it back to the queue
      queue.push(process);
    } else {
      // If the process is completed, record its completion time
      process.completionTime = currentTime;
      results.push(process);
    }
  }

  // Sort results by process ID for consistent output
  results.sort((a, b) => a.id - b.id);
  return results;
};