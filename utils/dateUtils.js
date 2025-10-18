// utils/dateUtils.js
export function formatDate(dateStr) {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatTime(timeStr) {
  if (!timeStr) return null;
  try {
    // Remove microseconds if present (e.g., "00:57:36.280378" → "00:57:36")
    const [hh, mm, ss] = timeStr.split(".")[0].split(":");
    const date = new Date();
    date.setHours(hh, mm, ss);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true, // change to false if you prefer 24-hour
    });
  } catch {
    return timeStr; // fallback: return raw if parsing fails
  }
}