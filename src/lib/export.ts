export async function copyIdsToClipboard(ids: string[]): Promise<void> {
  await navigator.clipboard.writeText(ids.join("\n"));
}

export function downloadIdsJson(
  ids: string[],
  region: string,
  date?: string
): void {
  const dateStr = date ?? new Date().toISOString().slice(0, 10);
  const json = JSON.stringify(ids, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `top-picks-${region}-${dateStr}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
