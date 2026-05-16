'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, Loader2, X, ZoomIn, ZoomOut } from 'lucide-react';

const FRAME = 320;
const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const OUTPUT_SIZE = 1024;

type Shape = 'circle' | 'square' | 'rounded';

const FRAME_SHAPE: Record<Shape, string> = {
  circle: 'rounded-full',
  square: 'rounded-none',
  rounded: 'rounded-2xl',
};

export type CropResult = { blob: Blob; mime: string };

export function MediaCrop({
  file,
  shape = 'rounded',
  onConfirm,
  onCancel,
}: {
  file: File;
  shape?: Shape;
  onConfirm: (result: CropResult) => void;
  onCancel: () => void;
}) {
  const objectUrl = useMemo(() => URL.createObjectURL(file), [file]);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [busy, setBusy] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; baseX: number; baseY: number } | null>(
    null,
  );

  useEffect(() => {
    return () => URL.revokeObjectURL(objectUrl);
  }, [objectUrl]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCancel]);

  // Baseline scale to cover the frame (object-fit: cover) at zoom = 1.
  const baseScale = img ? Math.max(FRAME / img.naturalWidth, FRAME / img.naturalHeight) : 1;

  function clampOffset(next: { x: number; y: number }, scale: number) {
    if (!img) return next;
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    const maxX = Math.max(0, (w - FRAME) / 2);
    const maxY = Math.max(0, (h - FRAME) / 2);
    return {
      x: Math.min(maxX, Math.max(-maxX, next.x)),
      y: Math.min(maxY, Math.max(-maxY, next.y)),
    };
  }

  function onPointerDown(e: React.PointerEvent) {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      baseX: offset.x,
      baseY: offset.y,
    };
  }

  function onPointerMove(e: React.PointerEvent) {
    const d = dragRef.current;
    if (!d) return;
    const next = {
      x: d.baseX + (e.clientX - d.startX),
      y: d.baseY + (e.clientY - d.startY),
    };
    setOffset(clampOffset(next, baseScale * zoom));
  }

  function onPointerUp(e: React.PointerEvent) {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    dragRef.current = null;
  }

  function onWheel(e: React.WheelEvent) {
    if (!img) return;
    const next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom - e.deltaY * 0.002));
    setZoom(next);
    setOffset((o) => clampOffset(o, baseScale * next));
  }

  function onZoomChange(value: number) {
    setZoom(value);
    setOffset((o) => clampOffset(o, baseScale * value));
  }

  async function handleConfirm() {
    if (!img) return;
    setBusy(true);
    try {
      const scale = baseScale * zoom;
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      // Frame top-left in scaled-image coords:
      const left = w / 2 - FRAME / 2 - offset.x;
      const top = h / 2 - FRAME / 2 - offset.y;
      // Convert to natural-image coords:
      const srcX = left / scale;
      const srcY = top / scale;
      const srcSize = FRAME / scale;

      const canvas = document.createElement('canvas');
      canvas.width = OUTPUT_SIZE;
      canvas.height = OUTPUT_SIZE;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('canvas_ctx_unavailable');
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, srcX, srcY, srcSize, srcSize, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

      const mime = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
      const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, mime, 0.92));
      if (!blob) throw new Error('canvas_toBlob_failed');
      onConfirm({ blob, mime });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/80 p-4">
      <div className="w-full max-w-md rounded-2xl bg-[#15151a] ring-1 ring-white/10 flex flex-col overflow-hidden">
        <header className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
          <h3 className="text-sm font-semibold">Căn chỉnh ảnh</h3>
          <button
            type="button"
            onClick={onCancel}
            className="ml-auto h-8 w-8 grid place-items-center rounded-lg hover:bg-white/10"
            aria-label="Huỷ"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="p-4 flex flex-col items-center gap-3">
          <div
            className={`relative bg-black/50 ring-1 ring-white/10 overflow-hidden touch-none select-none cursor-grab active:cursor-grabbing ${FRAME_SHAPE[shape]}`}
            style={{ width: FRAME, height: FRAME }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onWheel={onWheel}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={objectUrl}
              alt=""
              draggable={false}
              onLoad={(e) => setImg(e.currentTarget)}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) scale(${
                  baseScale * zoom
                })`,
                transformOrigin: 'center',
                maxWidth: 'none',
                maxHeight: 'none',
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            />
            {!img ? (
              <div className="absolute inset-0 grid place-items-center text-xs text-white/50">
                Đang tải ảnh…
              </div>
            ) : null}
          </div>

          <div className="w-full flex items-center gap-3 px-1">
            <button
              type="button"
              onClick={() => onZoomChange(Math.max(MIN_ZOOM, zoom - 0.2))}
              className="h-8 w-8 grid place-items-center rounded-lg bg-white/5 hover:bg-white/10 ring-1 ring-white/10"
              aria-label="Thu nhỏ"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <input
              type="range"
              min={MIN_ZOOM}
              max={MAX_ZOOM}
              step={0.01}
              value={zoom}
              onChange={(e) => onZoomChange(Number(e.target.value))}
              className="flex-1 accent-[var(--brand)]"
              aria-label="Zoom"
            />
            <button
              type="button"
              onClick={() => onZoomChange(Math.min(MAX_ZOOM, zoom + 0.2))}
              className="h-8 w-8 grid place-items-center rounded-lg bg-white/5 hover:bg-white/10 ring-1 ring-white/10"
              aria-label="Phóng to"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
          </div>

          <p className="text-xs text-white/50 text-center">
            Kéo để di chuyển · Cuộn / dùng thanh trượt để zoom
          </p>
        </div>

        <footer className="flex items-center gap-2 px-4 py-3 border-t border-white/10">
          <button
            type="button"
            onClick={onCancel}
            className="text-sm rounded-lg bg-white/5 hover:bg-white/10 ring-1 ring-white/10 px-3 py-2"
          >
            Huỷ
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!img || busy}
            className="ml-auto inline-flex items-center gap-1.5 text-sm rounded-lg bg-[var(--brand)] text-[var(--brand-fg)] font-semibold px-3 py-2 disabled:opacity-50"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            {busy ? 'Đang xử lý…' : 'Lưu ảnh'}
          </button>
        </footer>
      </div>
    </div>
  );
}
