export function sjf(processes) {
    let currentTime = 0; // Tracks CPU time
    let remainingProcesses = [...processes]; // Clone the array of processes
    let scheduledProcesses = [];
  
    // Continue while there are remaining processes
    while (remainingProcesses.length > 0) {
      // Get available processes that have arrived by the current time
      let availableProcesses = [];
      
      for (let i = 0; i < remainingProcesses.length; i++) {
        if (remainingProcesses[i].arrivalTime <= currentTime) {
          availableProcesses.push(remainingProcesses[i]);
        }
      }
  
      if (availableProcesses.length === 0) {
        // If no process is available, jump to the next arrival time
        // Update current time to the next process arrival time
        currentTime = Math.min(...remainingProcesses.map((p) => p.arrivalTime));
        continue;
      }
  
      // Find the process with the shortest burst time
      let shortestJob = null;
      let shortestBurstTime = Infinity;
  
      // Loop through available processes and pick the one with the shortest burst time
      for (let process of availableProcesses) {
        if (process.burstTime < shortestBurstTime) {
          shortestBurstTime = process.burstTime;
          shortestJob = process;
        }
      }
  
      // Once the shortest job is selected, update the current time and store the result
      let completionTime = currentTime + shortestJob.burstTime;
      currentTime = completionTime; // Update current time to completion time of the job
  
      // Store the process with its completion time
      scheduledProcesses.push({ ...shortestJob, completionTime });
  
      // Remove the selected process from the remaining processes
      remainingProcesses = remainingProcesses.filter((p) => p.id !== shortestJob.id);
    }
  
    return scheduledProcesses;
  }
  
  
  
  
  