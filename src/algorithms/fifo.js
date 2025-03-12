export function fifo(processes) {
    let currentTime = 0; // Tracks CPU time
  
    return processes.map((process) => {
      // If CPU is idle, move to the process's arrival time
      if (currentTime < process.arrivalTime) {
        currentTime = process.arrivalTime;
      }
  
      let completionTime = currentTime + process.burstTime;
      currentTime = completionTime; // Move CPU time forward
  
      return { ...process, completionTime };
    });
  }
  