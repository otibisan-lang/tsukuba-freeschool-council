export type HistorySegment = string | { text: string; href: string };
export type HistoryEntry = { date: string; items: HistorySegment[][] };

// 新しい更新ほど先頭に追加してください(date は YYYY-MM-DD)
// items の各要素は1行分。文字列と { text, href } を混ぜて、リンクにしたい部分だけ { text, href } にできます
export const historyEntries: HistoryEntry[] = [
  { date: "2026-10-22", items: [
    ["「", { text: "保護者の方へ", href: "/parents" }, "」に、「保護者の方に知っておいてほしい10のこと」を追加"],
    ["「", { text: "協議会とは", href: "/about" }, "」に、イラスト・サイト・ロゴデザインについての記述を追加"],
  ] },
  { date: "2026-10-16", items: [
    ["たよりを11月号に更新"],
  ] },
  { date: "2026-10-10", items: [["本公開（旧サイトから移転）"]] },
  { date: "2026-10-06", items: [["サイトのプレ公開、", { text: "出張講師", href: "/lecturers" }, "の募集開始"]] },
];

export function formatDateSlash(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${y}/${m}/${d}`;
}

export const latestUpdate = historyEntries[0];
