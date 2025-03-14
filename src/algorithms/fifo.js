export const fifo = (processes) => {
  // Sort processes by arrival time
  processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

  let currentTime = 0;
  const results = processes.map((process) => {
    // Calculate the start time: it's either the current time or the process's arrival time, whichever is later
    const startTime = Math.max(currentTime, process.arrivalTime);
    
    // Calculate the end time: start time + burst time
    const endTime = startTime + process.burstTime;
    
    // Calculate the waiting time: start time - arrival time
    const waitingTime = startTime - process.arrivalTime;

    // Update current time for the next process
    currentTime = endTime;

    // Return the process info with waiting time
    return { ...process, startTime, endTime, waitingTime };
  });

  return results;
};
