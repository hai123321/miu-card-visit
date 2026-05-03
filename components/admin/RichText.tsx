'use client';

import { useEffect, useRef } from 'react';
import { Bold, Italic, Underline, Link as LinkIcon, Eraser } from 'lucide-react';

export function RichText({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Sync external value into the editor only when it diverges from what
  // the user is currently typing — avoids caret jumps mid-edit.
  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value;
    }
  }, [value]);

  function exec(cmd: string, arg?: string) {
    ref.current?.focus();
    document.execCommand(cmd, false, arg);
    if (ref.current) onChange(ref.current.innerHTML);
  }

  function onLink() {
    const url = window.prompt('URL (https://… / mailto: / tel:)?');
    if (!url) return;
    exec('createLink', url);
  }

  function onInput() {
    if (ref.current) onChange(ref.current.innerHTML);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-1">
        <ToolBtn label="Bold (Ctrl+B)" onClick={() => exec('bold')}>
          <Bold className="h-3.5 w-3.5" />
        </ToolBtn>
        <ToolBtn label="Italic (Ctrl+I)" onClick={() => exec('italic')}>
          <Italic className="h-3.5 w-3.5" />
        </ToolBtn>
        <ToolBtn label="Underline (Ctrl+U)" onClick={() => exec('underline')}>
          <Underline className="h-3.5 w-3.5" />
        </ToolBtn>
        <ToolBtn label="Liên kết" onClick={onLink}>
          <LinkIcon className="h-3.5 w-3.5" />
        </ToolBtn>
        <ToolBtn label="Xoá định dạng" onClick={() => exec('removeFormat')}>
          <Eraser className="h-3.5 w-3.5" />
        </ToolBtn>
      </div>
      <div
        ref={ref}
        contentEditable
        onInput={onInput}
        onBlur={onInput}
        suppressContentEditableWarning
        data-placeholder={placeholder ?? ''}
        className="rich-editor min-h-[100px] rounded-lg bg-black/30 ring-1 ring-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--brand)] text-sm leading-relaxed [&_a]:underline [&_a]:text-[var(--brand)]"
      />
      <style>{`
        .rich-editor:empty::before {
          content: attr(data-placeholder);
          color: rgb(255 255 255 / 0.35);
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}

function ToolBtn({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      title={label}
      aria-label={label}
      className="h-7 w-7 grid place-items-center rounded-md bg-white/5 hover:bg-white/10 ring-1 ring-white/10 text-white/80"
    >
      {children}
    </button>
  );
}
