export function formatTime(s) {
  if (typeof s !== 'number' || isNaN(s) || s < 0) return '--:--';
  const days = Math.floor(s / 86400);
  const hours = Math.floor((s % 86400) / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (days > 0) {
    return `${days}d ${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  }
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  }
  return `${minutes.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}
