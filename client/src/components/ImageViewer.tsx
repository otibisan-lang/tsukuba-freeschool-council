import { useEffect, useState } from "react";

// 画像をそのまま表示し、タップすると画面いっぱいに表示する(拡大・移動はしない)
export default function ImageViewer({ src, alt }: { src: string; alt: string }) {
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
      <button type="button" className="image-viewer-trigger" onClick={() => setOpen(true)} aria-label={`${alt}を画面いっぱいに表示`}>
        <img className="image-viewer-thumb" src={src} alt={alt} loading="lazy" />
      </button>
      {open && (
        <div className="image-lightbox" role="dialog" aria-modal="true" onClick={() => setOpen(false)}>
          <img src={src} alt={alt} />
          <button type="button" className="image-lightbox-close" aria-label="閉じる" onClick={() => setOpen(false)}>×</button>
        </div>
      )}
    </>
  );
}
