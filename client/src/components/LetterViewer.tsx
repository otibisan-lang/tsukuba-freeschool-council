import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent, WheelEvent as ReactWheelEvent } from "react";
import { Check, Copy, Download, Minus, Plus, RotateCcw, Search, Share2, X } from "lucide-react";

export default function LetterViewer({ src, alt, downloadName = "image.png", shareText = `${alt}を共有します。` }: { src: string; alt: string; downloadName?: string; shareText?: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; panX: number; panY: number; moved: boolean } | null>(null);

  const resetZoom = () => {
    setScale(1);
    setPan({ x: 0, y: 0 });
  };

  const close = () => {
    setOpen(false);
    setCopied(false);
    resetZoom();
  };

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && close();
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  const imageUrl = () => new URL(src, window.location.href).href;
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

  const zoomBy = (delta: number) => {
    setScale((prev) => {
      const next = Math.min(4, Math.max(1, Math.round((prev + delta) * 100) / 100));
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  };

  const onWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    zoomBy(event.deltaY < 0 ? 0.4 : -0.4);
  };

  const onImageClick = () => {
    if (dragRef.current?.moved) return;
    setScale((prev) => {
      if (prev > 1) {
        setPan({ x: 0, y: 0 });
        return 1;
      }
      return 2;
    });
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLImageElement>) => {
    if (scale <= 1) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { startX: event.clientX, startY: event.clientY, panX: pan.x, panY: pan.y, moved: false };
    setIsDragging(true);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLImageElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) drag.moved = true;
    setPan({ x: drag.panX + dx, y: drag.panY + dy });
  };

  const endDrag = () => {
    dragRef.current = null;
    setIsDragging(false);
  };

  return <>
    <button className="letter-viewer-trigger" type="button" onClick={() => setOpen(true)} aria-label={`${alt}を全面表示`}>
      <img src={src} alt={alt} />
      <span className="letter-viewer-hint"><Search size={13}/>拡大表示</span>
    </button>
    {open && <div className="letter-lightbox" role="dialog" aria-modal="true" aria-label={`${alt}の拡大表示`} onClick={close}>
      <button className="letter-lightbox-close" type="button" onClick={close} aria-label="閉じる"><X size={28}/></button>
      <div className="letter-lightbox-content" onClick={(event) => event.stopPropagation()}>
        <div className="letter-zoom-viewport" onWheel={onWheel}>
          <img
            src={src}
            alt={alt}
            draggable={false}
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
              cursor: scale > 1 ? (isDragging ? "grabbing" : "grab") : "zoom-in",
              transition: isDragging ? "none" : "transform .12s ease-out",
            }}
            onClick={onImageClick}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onPointerLeave={() => dragRef.current && endDrag()}
          />
        </div>
        <div className="letter-zoom-controls" aria-label="拡大・縮小の操作">
          <button type="button" onClick={() => zoomBy(-0.5)} aria-label="縮小する" disabled={scale <= 1}><Minus size={16}/></button>
          <span>{Math.round(scale * 100)}%</span>
          <button type="button" onClick={() => zoomBy(0.5)} aria-label="拡大する" disabled={scale >= 4}><Plus size={16}/></button>
          <button type="button" onClick={resetZoom} aria-label="拡大率を戻す" disabled={scale === 1}><RotateCcw size={16}/></button>
          <span className="letter-zoom-hint">クリックで拡大・ドラッグで移動</span>
        </div>
        <div className="letter-share-panel" aria-label="画像を共有する">
          <a className="letter-share-button" href={imageUrl()} download={downloadName}><Download size={16}/>保存する</a>
          <button className="letter-share-button" type="button" onClick={shareNative}><Share2 size={16}/>共有</button>
          <a className="letter-share-button" href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(imageUrl())}`} target="_blank" rel="noreferrer">X</a>
          <a className="letter-share-button" href={`https://line.me/R/msg/text/?${encodeURIComponent(`${shareText}\n${imageUrl()}`)}`} target="_blank" rel="noreferrer">LINE</a>
          <button className="letter-share-button" type="button" onClick={copyLink}>{copied ? <Check size={16}/> : <Copy size={16}/>} {copied ? "コピーしました" : "リンクをコピー"}</button>
        </div>
      </div>
    </div>}
  </>;
}
