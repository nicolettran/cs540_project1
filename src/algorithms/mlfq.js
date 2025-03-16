export const mlfq = (processes) => {
  // Define multiple queues with different time quanta
  const queues = [
    { timeQuantum: 5, processes: [] }, // Highest priority
    { timeQuantum: 10, processes: [] }, // Medium priority
    { timeQuantum: Infinity, processes: [] }, // Lowest priority (FIFO)
  ];

  let currentTime = 0;
  const results = [];
  const remainingProcesses = processes.map((process) => ({
    ...process,
    remainingTime: process.burstTime,
    queueLevel: 0, // Start in the highest priority queue
    startTime: null, // Track the first time the process starts execution
    endTime: null, // Track when the process completes
    waitingTime: 0, // Track total waiting time
    segments: [], // Track execution segments
    lastStartTime: null, // Track when the process last started execution
  }));

  while (remainingProcesses.length > 0 || queues.some((q) => q.processes.length > 0)) {
    // Add processes that have arrived to the appropriate queue
    remainingProcesses.forEach((process) => {
      if (process.arrivalTime <= currentTime) {
        queues[process.queueLevel].processes.push(process);
        remainingProcesses.splice(remainingProcesses.indexOf(process), 1);
      }
    });

    let executed = false;

    // Execute processes from the highest priority queue
    for (let i = 0; i < queues.length; i++) {
      const queue = queues[i];
      if (queue.processes.length > 0) {
        const nextProcess = queue.processes.shift();

        // Calculate waiting time if this is the first execution segment
        if (nextProcess.lastStartTime === null) {
          nextProcess.waitingTime += currentTime - (nextProcess.arrivalTime + (nextProcess.burstTime - nextProcess.remainingTime));
        }

        // Set start time only the first time it runs
        if (nextProcess.startTime === null) {
          nextProcess.startTime = currentTime;
        }

        // Mark the start of this execution segment
        nextProcess.lastStartTime = currentTime;

        // Execution time
        const executionTime = Math.min(queue.timeQuantum, nextProcess.remainingTime);
        nextProcess.remainingTime -= executionTime;
        currentTime += executionTime;

        // Record this execution segment
        nextProcess.segments.push({
          startTime: nextProcess.lastStartTime,
          endTime: currentTime,
        });

        // Reset lastStartTime for next time
        nextProcess.lastStartTime = null;

        if (nextProcess.remainingTime === 0) {
          // Process completed
          nextProcess.endTime = currentTime;
          results.push(nextProcess);
        } else {
          // Demote the process to the next lower priority queue
          nextProcess.queueLevel = Math.min(
            nextProcess.queueLevel + 1,
            queues.length - 1
          );
          queues[nextProcess.queueLevel].processes.push(nextProcess);
        }

        executed = true;
        break;
      }
    }

    if (!executed) {
      // No processes in any queue, increment time
      currentTime++;
    }
  }

  return results;
};