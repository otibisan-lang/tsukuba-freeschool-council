import { useEffect, useState } from "react";

// 講師募集フォームの回答シートを「ファイル > 共有 > ウェブに公開」で
// CSV形式で発行したURLを設定してください。
const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRCUc_QBFpONYdqxJaxpQWS_qVBXy7l5_2Cy9qvqIRsQfLuU8NNs-wKDohz2sDsm-cQkEnzXimElWfL/pub?gid=1214685065&single=true&output=csv";

interface Lecturer {
  name: string;
  title: string;
  keyword: string;
  target: string;
  bio: string;
  style: string;
  contact: string;
  siteUrl: string;
  pdfUrl: string;
  iconUrl: string;
  postedOn: string;
}

// ダブルクォート内のカンマ・改行に対応した簡易CSVパーサー
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      rows.push(row);
      row = [];
    } else {
      field += c;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((cell) => cell.trim() !== ""));
}

// 見出し名で列を探す(フォームの質問を並べ替えても、列の追加があっても壊れないように)
function findColumn(header: string[], keyword: string): number {
  return header.findIndex((h) => h.includes(keyword));
}

// 申込先の文から、リンク先を作る(URLがあればそのページ、メールアドレスがあればmailto)
function contactHref(text: string): string {
  const url = text.match(/https?:\/\/[^\s]+/);
  if (url) return url[0];
  const mail = text.match(/[\w.+-]+@[\w-]+\.[\w.-]+/);
  return mail ? `mailto:${mail[0]}` : "";
}

// タイムスタンプ(例: 2026/10/05 10:58:02)の日付部分を「2026年10月5日」にする
function formatPostedDate(timestamp: string): string {
  const datePart = timestamp.trim().split(" ")[0];
  const [y, m, d] = datePart.split(/[\/-]/);
  if (!y || !m || !d) return "";
  return `${y}年${Number(m)}月${Number(d)}日`;
}

function parseLecturers(csvText: string): Lecturer[] {
  const [header, ...body] = parseCsv(csvText);
  if (!header) return [];

  const col = {
    name: findColumn(header, "お名前"),
    title: findColumn(header, "肩書"),
    keyword: findColumn(header, "キーワード"),
    target: findColumn(header, "主な対象"),
    bio: findColumn(header, "自己紹介"),
    style: findColumn(header, "活動形態"),
    contact: findColumn(header, "お申し込み先"),
    siteUrl: findColumn(header, "サイトURL"),
    // 管理者が手動で入力する「掲載用PDFファイル名」(public/lecturer-pdfs/ 内のファイル名)
    pdf: findColumn(header, "掲載用PDF"),
    // 管理者が手動で入力する「掲載用アイコンファイル名」(public/lecturer-icons/ 内のファイル名、任意)
    icon: findColumn(header, "掲載用アイコン"),
    approved: findColumn(header, "承認"),
    timestamp: findColumn(header, "タイムスタンプ"),
  };
  // 承認列がまだ無いシートでは、誰も掲載されないようにする
  if (col.approved < 0) return [];

  const get = (r: string[], i: number) => (i >= 0 ? (r[i] || "").trim() : "");

  // 新しい申込みを上に出す(タイムスタンプの新しい順。同じ時刻なら、シートの下の行を優先)
  const withOrder = body.map((r, i) => {
    const ts = Date.parse(get(r, col.timestamp).replace(/\//g, "-").replace(" ", "T"));
    return { r, i, ts: Number.isNaN(ts) ? 0 : ts };
  });
  withOrder.sort((a, b) => b.ts - a.ts || b.i - a.i);

  return withOrder
    .map(({ r }) => r)
    .filter((r) => get(r, col.approved) !== "")
    .map((r) => ({
      name: get(r, col.name),
      title: get(r, col.title),
      keyword: get(r, col.keyword),
      target: get(r, col.target),
      bio: get(r, col.bio),
      style: get(r, col.style),
      contact: get(r, col.contact),
      siteUrl: get(r, col.siteUrl),
      pdfUrl: get(r, col.pdf) ? `/lecturer-pdfs/${encodeURIComponent(get(r, col.pdf))}` : "",
      postedOn: formatPostedDate(get(r, col.timestamp)),
      iconUrl: get(r, col.icon) ? `/lecturer-icons/${encodeURIComponent(get(r, col.icon))}` : "",
    }))
    .filter((l) => l.name !== "");
}

// キーワード等の区切り(「、」「,」「/」「空白」)で1つずつに分ける
function splitKeywords(text: string): string[] {
  return text.split(/[、,，/／\s]+/).map((k) => k.trim()).filter((k) => k !== "");
}

// 1人分のカード: 名前・所属・キーワードは常に表示。スマホでは、残りは「詳しく見る」で開く
function LecturerCard({ l }: { l: Lecturer }) {
  const [open, setOpen] = useState(false);
  return (
    <article className={`lecturer-card${open ? " is-open" : ""}`}>
      <div className="lecturer-core">
        <div className="lecturer-head">
          {l.iconUrl ? (
            <img className="lecturer-avatar" src={l.iconUrl} alt={`${l.name}さん`} />
          ) : (
            <span className="lecturer-avatar" aria-hidden="true">{l.name.charAt(0)}</span>
          )}
          <div>
            <h3>{l.name}さん</h3>
            {l.title && <p className="lecturer-title">{l.title}</p>}
          </div>
        </div>
        {l.keyword && (
          <div className="lecturer-styles">
            {splitKeywords(l.keyword).map((k) => (
              <span key={k} className="lecturer-keyword">{k}</span>
            ))}
          </div>
        )}
      </div>
      <div className="lecturer-details">
        {l.target && <p className="lecturer-target">対象：{l.target}</p>}
        {l.style && (
          <div className="lecturer-styles">
            {splitKeywords(l.style).map((k) => (
              <span key={k} className="lecturer-style">{k}</span>
            ))}
          </div>
        )}
        {l.bio && <p className="lecturer-bio">{l.bio}</p>}
        <div className="lecturer-links">
          {l.contact && (
            <span className="lecturer-contact">
              申込先：{contactHref(l.contact) ? (
                <a href={contactHref(l.contact)} target={contactHref(l.contact).startsWith("http") ? "_blank" : undefined} rel="noreferrer">{l.contact}</a>
              ) : (
                l.contact
              )}
            </span>
          )}
          {l.siteUrl && (
            <a className="lecturer-pdf" href={l.siteUrl} target="_blank" rel="noreferrer">サイトを見る →</a>
          )}
          {l.pdfUrl && (
            <a className="lecturer-pdf" href={l.pdfUrl} target="_blank" rel="noreferrer">資料PDFを見る →</a>
          )}
        </div>
        {l.postedOn && <p className="lecturer-posted">掲載日：{l.postedOn}</p>}
      </div>
      <button type="button" className="lecturer-toggle" aria-expanded={open} onClick={() => setOpen(!open)}>
        {open ? "閉じる −" : "詳しく見る +"}
      </button>
    </article>
  );
}

type Status = "loading" | "ready" | "empty" | "unconfigured" | "error";

export default function LecturerDirectory() {
  const [status, setStatus] = useState<Status>(SHEET_CSV_URL ? "loading" : "unconfigured");
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [keyword, setKeyword] = useState<string | null>(null);
  const [styleFilter, setStyleFilter] = useState<string | null>(null);
  // 10件ずつ表示する(「もっと見る」で増える)
  const [shownCount, setShownCount] = useState(10);

  useEffect(() => {
    if (!SHEET_CSV_URL) return;
    let cancelled = false;
    fetch(SHEET_CSV_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then((text) => {
        if (cancelled) return;
        const list = parseLecturers(text);
        setLecturers(list);
        setStatus(list.length > 0 ? "ready" : "empty");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (status === "loading") {
    return <div className="notice-card">読み込み中です…</div>;
  }

  if (status !== "ready") {
    return (
      <div className="notice-card">
        掲載情報を準備中です。掲載をご希望の方は事務局へお問い合わせください。
      </div>
    );
  }

  // キーワードは「、」「,」「/」「空白」で区切って、1つずつボタンにする

  const keywordCounts = new Map<string, number>();
  lecturers.forEach((l) =>
    splitKeywords(l.keyword).forEach((k) => keywordCounts.set(k, (keywordCounts.get(k) || 0) + 1)),
  );
  const keywordList = Array.from(keywordCounts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "ja"))
    .map(([k]) => k);
  const styleCounts = new Map<string, number>();
  lecturers.forEach((l) =>
    splitKeywords(l.style).forEach((k) => styleCounts.set(k, (styleCounts.get(k) || 0) + 1)),
  );
  const styleList = Array.from(styleCounts.keys()).sort((a, b) => a.localeCompare(b, "ja"));
  const filtered = lecturers
    .filter((l) => (keyword ? splitKeywords(l.keyword).includes(keyword) : true))
    .filter((l) => (styleFilter ? splitKeywords(l.style).includes(styleFilter) : true));
  const isFiltered = keyword !== null || styleFilter !== null;
  const visible = filtered.slice(0, shownCount);

  return (
    <>
      {styleList.length > 0 && (
        <div className="keyword-filter" role="group" aria-label="出張先で絞り込む">
          <span className="filter-label">出張先：</span>
          <button
            type="button"
            className={`keyword-chip${styleFilter === null ? " active" : ""}`}
            onClick={() => setStyleFilter(null)}
          >
            すべて
          </button>
          {styleList.map((k) => (
            <button
              key={k}
              type="button"
              className={`keyword-chip${styleFilter === k ? " active" : ""}`}
              onClick={() => setStyleFilter(styleFilter === k ? null : k)}
            >
              {k}
            </button>
          ))}
        </div>
      )}
      {keywordList.length > 0 && (
        <div className="keyword-filter" role="group" aria-label="キーワードで絞り込む">
          <span className="filter-label">キーワード：</span>
          <button
            type="button"
            className={`keyword-chip${keyword === null ? " active" : ""}`}
            onClick={() => setKeyword(null)}
          >
            すべて
          </button>
          {keywordList.map((k) => (
            <button
              key={k}
              type="button"
              className={`keyword-chip${keyword === k ? " active" : ""}`}
              onClick={() => setKeyword(keyword === k ? null : k)}
            >
              {k}
            </button>
          ))}
        </div>
      )}
      <p className="keyword-count">
        {isFiltered
          ? `該当の講師は${filtered.length}人です(掲載中は全${lecturers.length}人)`
          : `現在、掲載中の講師は${lecturers.length}人です`}
      </p>
      {filtered.length === 0 ? (
        <div className="notice-card">該当する講師はいません。</div>
      ) : (
    <div className="lecturer-grid">
      {visible.map((l, i) => (
        <LecturerCard key={`${l.name}-${i}`} l={l} />
      ))}
    </div>
      )}
      {filtered.length > shownCount && (
        <button type="button" className="more-button" onClick={() => setShownCount(shownCount + 10)}>
          もっと見る(残り{filtered.length - shownCount}人)
        </button>
      )}
    </>
  );
}
