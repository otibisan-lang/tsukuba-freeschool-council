export type HistoryItem = { text: string; href?: string };
export type HistoryEntry = { date: string; items: HistoryItem[] };

// 新しい更新ほど先頭に追加してください(date は YYYY-MM-DD)
export const historyEntries: HistoryEntry[] = [
  { date: "2026-10-22", items: [
    { text: "「保護者の方へ」に、「保護者の方に知っておいてほしい10のこと」を追加", href: "/parents" },
    { text: "「協議会とは」に、イラスト・サイト・ロゴデザインについての記述を追加", href: "/about" },
  ] },
  { date: "2026-10-16", items: [
    { text: "たよりを11月号に更新", href: "/" },
  ] },
  { date: "2026-10-10", items: [{ text: "本公開（旧サイトから移転）" }] },
  { date: "2026-10-06", items: [{ text: "サイトのプレ公開、出張講師の募集開始" }] },
];

export function formatDateSlash(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${y}/${m}/${d}`;
}

export const latestUpdate = historyEntries[0];
