'use client';

import { useEffect, useRef, useState } from 'react';
import { Upload, Loader2, Images, X } from 'lucide-react';
import { MediaCrop, type CropResult } from './MediaCrop';

const CROPPABLE_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp']);

type Shape = 'circle' | 'square' | 'rounded';

const SHAPE_CLASS: Record<Shape, string> = {
  circle: 'rounded-full',
  square: 'rounded-none',
  rounded: 'rounded-lg',
};

type LibraryItem = { name: string; url: string; mtime: number };

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
  enableLibrary = false,
  enableCrop = true,
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
  enableLibrary?: boolean;
  enableCrop?: boolean;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [library, setLibrary] = useState<LibraryItem[] | null>(null);
  const [libraryLoading, setLibraryLoading] = useState(false);
  const [cropFile, setCropFile] = useState<File | null>(null);

  async function openPicker() {
    setPickerOpen(true);
    if (library !== null) return;
    setLibraryLoading(true);
    try {
      const res = await fetch('/api/uploads/list');
      if (res.status === 401) {
        onSessionExpired();
        return;
      }
      if (!res.ok) {
        onError('Không tải được kho ảnh');
        return;
      }
      const { items } = (await res.json()) as { items: LibraryItem[] };
      setLibrary(items);
    } finally {
      setLibraryLoading(false);
    }
  }

  function pick(url: string) {
    onChange(url);
    setPickerOpen(false);
  }

  async function uploadBlob(blob: Blob, filename: string) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', blob, filename);
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
      setLibrary(null);
    } finally {
      setUploading(false);
    }
  }

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (fileRef.current) fileRef.current.value = '';
    if (!file) return;

    if (enableCrop && CROPPABLE_TYPES.has(file.type)) {
      setCropFile(file);
      return;
    }
    await uploadBlob(file, file.name);
  }

  async function handleCropConfirm({ blob, mime }: CropResult) {
    setCropFile(null);
    const ext = mime === 'image/png' ? 'png' : 'jpg';
    await uploadBlob(blob, `crop.${ext}`);
  }

  useEffect(() => {
    if (!pickerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPickerOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [pickerOpen]);

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
        {enableLibrary ? (
          <button
            type="button"
            onClick={openPicker}
            className="inline-flex items-center gap-1.5 text-sm rounded-lg bg-white/5 hover:bg-white/10 ring-1 ring-white/10 px-3 py-2"
          >
            <Images className="h-4 w-4" /> Chọn từ kho
          </button>
        ) : null}
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

      {cropFile ? (
        <MediaCrop
          file={cropFile}
          shape={shape}
          onConfirm={handleCropConfirm}
          onCancel={() => setCropFile(null)}
        />
      ) : null}

      {pickerOpen ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4"
          onClick={() => setPickerOpen(false)}
        >
          <div
            className="w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-2xl bg-[#15151a] ring-1 ring-white/10 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
              <h3 className="text-sm font-semibold">Kho ảnh đã upload</h3>
              <button
                type="button"
                onClick={() => setPickerOpen(false)}
                className="ml-auto h-8 w-8 grid place-items-center rounded-lg hover:bg-white/10"
                aria-label="Đóng"
              >
                <X className="h-4 w-4" />
              </button>
            </header>
            <div className="overflow-auto p-4">
              {libraryLoading ? (
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <Loader2 className="h-4 w-4 animate-spin" /> Đang tải…
                </div>
              ) : !library || library.length === 0 ? (
                <p className="text-sm text-white/60">Chưa có ảnh nào trong kho.</p>
              ) : (
                <ul className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                  {library.map((item) => {
                    const selected = item.url === value;
                    return (
                      <li key={item.name}>
                        <button
                          type="button"
                          onClick={() => pick(item.url)}
                          title={item.name}
                          className={`block w-full aspect-square overflow-hidden rounded-lg ring-1 transition ${
                            selected
                              ? 'ring-2 ring-[var(--brand)]'
                              : 'ring-white/10 hover:ring-white/30'
                          }`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.url}
                            alt={item.name}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
