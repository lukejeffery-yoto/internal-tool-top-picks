export async function copyIdsToClipboard(ids: string[]): Promise<void> {
  await navigator.clipboard.writeText(ids.join("\n"));
}

export function downloadIdsCsv(
  ids: string[],
  region: string,
  date?: string
): void {
  const dateStr = date ?? new Date().toISOString().slice(0, 10);
  const csv = "product_id\n" + ids.join("\n") + "\n";
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `top-picks-${region}-${dateStr}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
