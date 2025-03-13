export function stcf(processes) {
    let currentTime = 0; // Tracks the current time (CPU time)
    let remainingProcesses = processes.map((p) => ({
      ...p,
      remainingBurstTime: p.burstTime, // Initialize remaining burst time for each process
    }));
    let completedProcesses = []; // Keep track of completed processes
    let scheduledProcesses = []; // Store the results
  
    // Sort processes by arrival time initially
    remainingProcesses.sort((a, b) => a.arrivalTime - b.arrivalTime);
  
    // While there are remaining processes to schedule
    while (completedProcesses.length < processes.length) {
      // Store current time in a local variable for safe reference
      const currentTimeSnapshot = currentTime;
  
      // Get the available processes that have arrived by currentTimeSnapshot
      let availableProcesses = remainingProcesses.filter(
        (p) => p.arrivalTime <= currentTimeSnapshot && !completedProcesses.includes(p.id)
      );
  
      if (availableProcesses.length === 0) {
        // If no process is available, jump to the next arrival time
        const nextArrivalTime = Math.min(
          ...remainingProcesses
            .filter((p) => !completedProcesses.includes(p.id))
            .map((p) => p.arrivalTime)
        );
        currentTime = nextArrivalTime;
        continue;
      }
  
      // Find the process with the shortest remaining burst time among the available processes
      let nextProcess = availableProcesses.reduce((shortest, process) =>
        process.remainingBurstTime < shortest.remainingBurstTime ? process : shortest
      );
  
      // Process the selected job (decrease remaining burst time)
      nextProcess.remainingBurstTime--;
      currentTime++;
  
      // If the process is completed (remaining burst time reaches 0)
      if (nextProcess.remainingBurstTime === 0) {
        completedProcesses.push(nextProcess.id);
        scheduledProcesses.push({
          id: nextProcess.id,
          arrivalTime: nextProcess.arrivalTime,
          burstTime: nextProcess.burstTime,
          completionTime: currentTime,
        });
      }
    }
  
    return scheduledProcesses;
  }
  

  