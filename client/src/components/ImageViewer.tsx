import { useEffect, useState } from "react";
import { Copy, Share2 } from "lucide-react";

// 共有ボタン(画像を共有する)
export function ShareButtons({ src, alt, shareText }: { src: string; alt: string; shareText?: string }) {
  const [copied, setCopied] = useState(false);
  const text = shareText ?? `${alt}を共有します。`;
  const imageUrl = () => new URL(src, window.location.href).href;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(imageUrl());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch { /* clipboard permission denied */ }
  };

  const shareNative = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: alt, text, url: imageUrl() }); } catch { /* cancelled */ }
    } else {
      await copyLink();
    }
  };

  return (
    <div className="share-actions">
      <button type="button" className="letter-share-button" onClick={shareNative}><Share2 size={16}/>共有</button>
      <a className="letter-share-button" href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(imageUrl())}`} target="_blank" rel="noreferrer">X</a>
      <a className="letter-share-button" href={`https://line.me/R/msg/text/?${encodeURIComponent(`${text}\n${imageUrl()}`)}`} target="_blank" rel="noreferrer">LINE</a>
      <button type="button" className="letter-share-button" onClick={copyLink}><Copy size={16}/>{copied ? "コピーしました" : "コピー"}</button>
    </div>
  );
}

// 画像をそのまま表示し、タップすると画面いっぱいに表示する(拡大・移動はしない)
export default function ImageViewer({ src, alt, shareText, showShare = true, triggerClassName = "", lightboxClassName = "" }: { src: string; alt: string; shareText?: string; showShare?: boolean; triggerClassName?: string; lightboxClassName?: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button type="button" className={`image-viewer-trigger ${triggerClassName}`.trim()} onClick={() => setOpen(true)} aria-label={`${alt}を画面いっぱいに表示`}>
        <img className="image-viewer-thumb" src={src} alt={alt} loading="lazy" />
      </button>
      {showShare && <ShareButtons src={src} alt={alt} shareText={shareText} />}
      {open && (
        <div className={`image-lightbox ${lightboxClassName}`.trim()} role="dialog" aria-modal="true" onClick={() => setOpen(false)}>
          <img src={src} alt={alt} />
          <button type="button" className="image-lightbox-close" aria-label="閉じる" onClick={() => setOpen(false)}>×</button>
        </div>
      )}
    </>
  );
}
