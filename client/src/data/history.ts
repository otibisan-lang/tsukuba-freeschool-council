export type HistoryEntry = { date: string; text: string };

// 新しい更新ほど先頭に追加してください(date は YYYY-MM-DD)
export const historyEntries: HistoryEntry[] = [
  { date: "2026-10-10", text: "本公開（旧サイトから移転）" },
  { date: "2026-10-06", text: "サイトのプレ公開、出張講師の募集開始" },
];

export function formatDateSlash(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${y}/${m}/${d}`;
}

export const latestUpdate = historyEntries[0];
