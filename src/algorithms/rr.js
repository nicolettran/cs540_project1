export const rr = (processes, timeQuantum) => {
  let currentTime = 0;
  let queue = [];
  let results = [];

  // Initialize process tracking
  let remainingProcesses = processes.map((p) => ({
    ...p,
    remainingTime: p.burstTime,
    startTime: null,
    endTime: null,
    waitingTime: 0,
    segments: [], // Track execution segments
    lastStartTime: null // Track when the process last started execution
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
    if (process.lastStartTime === null) {
      // If this is a new segment, update waiting time
      process.waitingTime += currentTime - (process.arrivalTime + (process.burstTime - process.remainingTime));
    }

    // Set start time only the first time it runs
    if (process.startTime === null) {
      process.startTime = currentTime;
    }

    // Mark the start of this execution segment
    process.lastStartTime = currentTime;

    // Execution time
    let executionTime = Math.min(timeQuantum, process.remainingTime);
    process.remainingTime -= executionTime;
    currentTime += executionTime;

    // Record this execution segment
    process.segments.push({
      startTime: process.lastStartTime,
      endTime: currentTime
    });
    
    // Reset lastStartTime for next time
    process.lastStartTime = null;

    // Add new arrivals during execution
    while (index < remainingProcesses.length && remainingProcesses[index].arrivalTime <= currentTime) {
      queue.push(remainingProcesses[index]);
      index++;
    }

    if (process.remainingTime === 0) {
      // Process is completed
      process.endTime = currentTime;
      results.push(process);
    } else {
      // Re-add to queue
      queue.push(process);
    }
  }

  return results;
};