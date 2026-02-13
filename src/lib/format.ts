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
