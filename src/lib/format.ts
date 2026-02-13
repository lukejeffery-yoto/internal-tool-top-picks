export function formatPrice(price: string): string {
  const num = parseFloat(price);
  return num > 0 ? `£${num.toFixed(2)}` : "";
}

export function formatAgeRange(range: [number | null, number | null]): string {
  const [min, max] = range;
  if (min === null && max === null) return "";
  if (min === null) return `Ages 0-${max}`;
  if (max === null) return `Ages ${min}+`;
  return `Ages ${min}-${max}`;
}

export function formatRuntime(seconds: number): string {
  if (!seconds) return "";
  const mins = Math.round(seconds / 60);
  if (mins < 60) return `${mins} min`;
  const hrs = Math.floor(mins / 60);
  const rem = mins % 60;
  return rem ? `${hrs}h ${rem}m` : `${hrs}h`;
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
