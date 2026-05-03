'use client';

import { useRef, useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';

type Shape = 'circle' | 'square' | 'rounded';

const SHAPE_CLASS: Record<Shape, string> = {
  circle: 'rounded-full',
  square: 'rounded-none',
  rounded: 'rounded-lg',
};

export function ImageUpload({
  value,
  onChange,
  onError,
  onSessionExpired,
  size = 64,
  shape = 'circle',
  buttonLabel = 'Tải ảnh lên',
  showUrlField = true,
  urlPlaceholder = 'hoặc dán URL: https://… / /api/uploads/abc.png',
}: {
  value: string;
  onChange: (url: string) => void;
  onError: (msg: string) => void;
  onSessionExpired: () => void;
  size?: number;
  shape?: Shape;
  buttonLabel?: string;
  showUrlField?: boolean;
  urlPlaceholder?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      if (res.status === 401) {
        onSessionExpired();
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const msg =
          data?.error === 'file_too_large'
            ? 'File quá lớn (tối đa 4MB)'
            : data?.error === 'unsupported_type'
            ? 'Định dạng không hỗ trợ (chỉ nhận png/jpeg/webp/gif/svg)'
            : 'Upload thất bại';
        onError(msg);
        return;
      }
      const { url } = (await res.json()) as { url: string };
      onChange(url);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  const previewStyle = {
    height: `${size}px`,
    width: `${size}px`,
  } as React.CSSProperties;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <div
          style={previewStyle}
          className={`overflow-hidden ring-2 ring-white/10 bg-white/5 shrink-0 grid place-items-center ${SHAPE_CLASS[shape]}`}
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-xs text-white/40">trống</span>
          )}
        </div>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-1.5 text-sm rounded-lg bg-white/5 hover:bg-white/10 ring-1 ring-white/10 px-3 py-2 disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          {uploading ? 'Đang tải…' : buttonLabel}
        </button>
        {value ? (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-xs text-white/50 hover:text-red-400"
          >
            Xoá
          </button>
        ) : null}
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
          onChange={onFileChange}
          className="hidden"
        />
      </div>
      {showUrlField ? (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={urlPlaceholder}
          className="w-full rounded-lg bg-black/30 ring-1 ring-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--brand)] text-sm"
        />
      ) : null}
    </div>
  );
}
