export type HistorySegment = string | { text: string; href: string };
export type HistoryEntry = { date: string; items: HistorySegment[][] };

// 新しい更新ほど先頭に追加してください(date は YYYY-MM-DD)
// items の各要素は1行分。文字列と { text, href } を混ぜて、リンクにしたい部分だけ { text, href } にできます
export const historyEntries: HistoryEntry[] = [
  { date: "2026-10-30", items: [
    ["協議会に、", { text: "つくばヘレナ高等学院ヘレナ中等部", href: "/" }, "が新しく加入"],
    ["「", { text: "三つ折りパンフレット", href: "/documents/pamphlet.pdf" }, "」を、つくばヘレナ高等学院を追加したバージョンに更新"],
  ] },
  { date: "2026-10-25", items: [
    ["「", { text: "出張講師", href: "/lecturers" }, "」に、康寧堂さんを追加"],
  ] },
  { date: "2026-10-22", items: [
    ["「", { text: "保護者の方へ", href: "/parents" }, "」に、「保護者の方に知っておいてほしい10のこと」を追加"],
    ["「", { text: "協議会とは", href: "/about" }, "」に、イラスト・サイト・ロゴデザインについての記述を追加"],
  ] },
  { date: "2026-10-16", items: [
    ["たよりを11月号に更新"],
  ] },
  { date: "2026-10-10", items: [
    ["本公開（旧サイトから移転）"],
    ["「", { text: "出張講師", href: "/lecturers" }, "」に、己書さゆ凛さんを追加"],
  ] },
  { date: "2026-10-09", items: [
    ["「", { text: "出張講師", href: "/lecturers" }, "」に、マエストロさんを追加"],
  ] },
  { date: "2026-10-08", items: [
    ["「", { text: "出張講師", href: "/lecturers" }, "」に、宮村歓奈さんを追加"],
  ] },
  { date: "2026-10-07", items: [
    ["「", { text: "出張講師", href: "/lecturers" }, "」に、はっすー(蓮田拓歩)さん・もっさん(宮本亮)さん・飯島幸紀さん・谷藤賢一さんを追加"],
  ] },
  { date: "2026-10-06", items: [
    ["サイトのプレ公開、", { text: "出張講師", href: "/lecturers" }, "の募集開始"],
    ["「", { text: "出張講師", href: "/lecturers" }, "」に、西脇順子さん・島本真帆子さん・飯塚隆志さんを追加"],
  ] },
];

export function formatDateSlash(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${y}/${m}/${d}`;
}

export const latestUpdate = historyEntries[0];
