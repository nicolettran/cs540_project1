export const fifo = (processes) => {
  // Sort processes by arrival time
  processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

  let currentTime = 0;
  const results = processes.map((process) => {
    const startTime = Math.max(currentTime, process.arrivalTime);
    const endTime = startTime + process.burstTime;
    currentTime = endTime;
    return { ...process, startTime, endTime };
  });

  return results;
};
  