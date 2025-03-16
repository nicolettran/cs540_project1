export const stcf = (processes) => {
  let currentTime = 0;
  const results = [];
  const remainingProcesses = processes.map((process) => ({
    ...process,
    remainingTime: process.burstTime,
    startTime: null,
    segments: [],
    lastStartTime: null,
  }));

  while (remainingProcesses.length > 0) {
    // Filter processes that have arrived
    const availableProcesses = remainingProcesses.filter(
      (process) => process.arrivalTime <= currentTime
    );

    if (availableProcesses.length === 0) {
      // No processes available, increment time to the next arrival
      const nextArrival = remainingProcesses.reduce(
        (min, p) => Math.min(min, p.arrivalTime),
        Infinity
      );
      currentTime = nextArrival;
      continue;
    }

    // Find the process with the shortest remaining time
    const nextProcess = availableProcesses.reduce((prev, curr) =>
      curr.remainingTime < prev.remainingTime ? curr : prev
    );

    // If the process hasn't started yet or is starting a new segment after preemption
    if (nextProcess.lastStartTime === null) {
      nextProcess.lastStartTime = currentTime;
      
      // If this is the first time executing, set the initial startTime
      if (nextProcess.startTime === null) {
        nextProcess.startTime = currentTime;
      }
    }

    // Calculate how long this process will run before potential preemption
    let runUntil = currentTime + nextProcess.remainingTime;
    
    // Check if any process will arrive before this one completes
    for (const process of remainingProcesses) {
      // Skip the current process and processes that have already arrived
      if (process === nextProcess || process.arrivalTime <= currentTime) continue;
      
      // If a process arrives before the current one completes
      if (process.arrivalTime < runUntil) {
        runUntil = process.arrivalTime;
      }
    }
    
    // Calculate how long this process will run in this segment
    const timeSlice = runUntil - currentTime;
    
    // Update the process's remaining time
    nextProcess.remainingTime -= timeSlice;
    currentTime = runUntil;

    // Check if the process is completed
    if (nextProcess.remainingTime === 0) {
      // Process completed, record its segment and end time
      nextProcess.segments.push({
        startTime: nextProcess.lastStartTime,
        endTime: currentTime
      });
      
      // Calculate total waiting time
      const waitingTime = currentTime - nextProcess.arrivalTime - nextProcess.burstTime;
      
      // Create final result for this process
      const processResult = {
        ...nextProcess,
        endTime: currentTime,
        waitingTime,
        segments: nextProcess.segments
      };
      
      results.push(processResult);
      remainingProcesses.splice(remainingProcesses.indexOf(nextProcess), 1);
    } else {
      // Check if we need to preempt this process
      const nextAvailableProcesses = remainingProcesses.filter(
        (process) => process.arrivalTime <= currentTime && process !== nextProcess
      );
      
      if (nextAvailableProcesses.length > 0) {
        const nextShortestProcess = nextAvailableProcesses.reduce((prev, curr) =>
          curr.remainingTime < prev.remainingTime ? curr : prev
        );
        
        // If there's a process with shorter remaining time, preempt the current one
        if (nextShortestProcess.remainingTime < nextProcess.remainingTime) {
          // Record the execution segment of the current process
          nextProcess.segments.push({
            startTime: nextProcess.lastStartTime,
            endTime: currentTime
          });
          
          // Reset lastStartTime for the next time this process runs
          nextProcess.lastStartTime = null;
        }
      }
    }
  }

  return results;
};