export function formatDate(dateString) {
  const date = new Date(dateString);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}`;
}

export function isEnded(createdAtISO, milestoneType) {
  const createdAt = new Date(createdAtISO);
  const now = new Date();
  const daysPassed = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));

  const milestoneDurations = {
    seven: 7,
    three: 3,
  };

  const requiredDays = milestoneDurations[milestoneType] || 0;

  return daysPassed >= requiredDays;
}
