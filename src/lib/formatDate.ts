function formatDate(dateString: Date): string {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const date = new Date(dateString);
  const month = months[date.getMonth()];
  const day = date.getDate();
  const hours = date.getHours() % 12 || 12;
  const minutes = date.getMinutes();
  const ampm = date.getHours() < 12 ? "AM" : "PM";
  return `${month} ${day} at ${hours}:${minutes
    .toString()
    .padStart(2, "0")} ${ampm}`;
}

export default formatDate;
