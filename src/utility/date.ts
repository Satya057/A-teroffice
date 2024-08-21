export function dhm(t: number): string {
  const msPerDay = 24 * 60 * 60 * 1000;
  const msPerHour = 60 * 60 * 1000;
  const msPerMinute = 60 * 1000;

  const days = Math.floor(t / msPerDay);
  const hours = Math.floor((t % msPerDay) / msPerHour);
  const minutes = Math.floor((t % msPerHour) / msPerMinute);

  if (days > 0) {
      return `${days} days ago`;
  } else if (hours > 0) {
      return `${hours} hours, ${minutes} minutes ago`;
  } else {
      return `${minutes} minutes ago`;
  }
}
