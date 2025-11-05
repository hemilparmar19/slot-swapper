export const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const calculateDuration = (startTime, endTime) => {
  const duration = (new Date(endTime) - new Date(startTime)) / 60000;
  if (duration < 60) {
    return `${duration} min`;
  }
  const hours = Math.floor(duration / 60);
  const mins = duration % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};
