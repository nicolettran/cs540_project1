export const mlfq = (processes) => {
    // Define multiple queues with different time quanta
    const queues = [
      { timeQuantum: 5, processes: [] },
      { timeQuantum: 10, processes: [] },
      { timeQuantum: Infinity, processes: [] }, // Lowest priority queue (FIFO)
    ];
  
    let currentTime = 0;
    const results = [];
    const remainingProcesses = processes.map((process) => ({
      ...process,
      remainingTime: process.burstTime,
      queueLevel: 0, // Start in the highest priority queue
    }));
  
    while (remainingProcesses.length > 0) {
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
          const startTime = currentTime;
          const executionTime = Math.min(
            queue.timeQuantum,
            nextProcess.remainingTime
          );
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