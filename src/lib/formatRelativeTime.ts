const formatRelativeTime = (timestamp: string): string => {
  // Parse the input timestamp
  const inputTime = new Date(timestamp);
  const now = new Date();

  // Calculate the difference in milliseconds
  const diff = now.getTime() - inputTime.getTime();

  // Convert milliseconds to minutes, hours, days, and years
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  const years = Math.floor(days / 365);

  // Determine the largest unit of time to display
  if (years >= 1) {
    return `${years}y`;
  } else if (days >= 1) {
    return `${days}d`;
  } else if (hours >= 1) {
    return `${hours}h`;
  } else if (minutes >= 1) {
    return `${minutes}m`;
  } else {
    return "now";
  }
};

export default formatRelativeTime;
