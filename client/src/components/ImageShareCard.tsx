import { useState } from "react";
import { Copy, Download, Share2 } from "lucide-react";

// たよりやマップの画像を、拡大せずに表示し、その下に共有ボタンを並べる
export default function ImageShareCard({ src, alt, downloadName = "image.png", shareText = `${alt}を共有します。`, pdfHref }: { src: string; alt: string; downloadName?: string; shareText?: string; pdfHref?: string }) {
  const [copied, setCopied] = useState(false);
  const imageUrl = () => new URL(src, window.location.href).href;
  const pdf = pdfHref ?? src.replace("/assets/", "/documents/").replace(/\.png$/, ".pdf");

  const shareNative = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: alt, text: shareText, url: imageUrl() }); } catch { /* cancelled */ }
    } else {
      await copyLink();
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(imageUrl());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch { /* clipboard permission denied */ }
  };

  return (
    <div className="share-card">
      <img className="share-card-img" src={src} alt={alt} loading="lazy" />
      <div className="share-actions">
        <button type="button" className="letter-share-button" onClick={shareNative}><Share2 size={16}/>共有する</button>
        <a className="letter-share-button" href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(imageUrl())}`} target="_blank" rel="noreferrer">X</a>
        <a className="letter-share-button" href={`https://line.me/R/msg/text/?${encodeURIComponent(`${shareText}\n${imageUrl()}`)}`} target="_blank" rel="noreferrer">LINE</a>
        <button type="button" className="letter-share-button" onClick={copyLink}><Copy size={16}/>{copied ? "コピーしました" : "リンクをコピー"}</button>
        <a className="letter-share-button" href={src} download={downloadName}><Download size={16}/>保存</a>
      </div>
      <a className="share-pdf" href={pdf} target="_blank" rel="noreferrer">PDFで見る →</a>
    </div>
  );
}
