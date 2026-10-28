"use client";

import { useRef, useState } from "react";

/**
 * Upload a new image or keep/point at an existing one. Posts two inputs that
 * lib/content/parse.ts reads back: `<name>` (the file, if any) and
 * `<name>__url` (the current path). Clearing the path removes the image.
 */
export function ImageField({ name, id, value, required }: { name: string; id?: string; value: string; required?: boolean }) {
  const [url, setUrl] = useState(value);
  const [preview, setPreview] = useState(value);
  const fileRef = useRef<HTMLInputElement>(null);

  function onFile(file: File | undefined) {
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  }

  function clear() {
    setUrl("");
    setPreview("");
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
      <div className="flex h-24 w-36 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-line bg-canvas">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element -- previews of arbitrary paths and blob: URLs
          <img src={preview} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="text-xs text-muted">No image</span>
        )}
      </div>
      <div className="min-w-0 flex-1 space-y-2">
        <input
          ref={fileRef}
          id={id ?? name}
          name={name}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => onFile(e.target.files?.[0])}
          className="block w-full text-sm text-muted file:mr-3 file:rounded-md file:border-0 file:bg-brand-soft file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-brand hover:file:bg-brand/15"
        />
        <div className="flex gap-2">
          <input
            name={`${name}__url`}
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setPreview(e.target.value);
            }}
            placeholder="or an image path, e.g. /roosty-photos/photo.jpg"
            className="min-w-0 flex-1 rounded-lg border border-line px-3 py-1.5 text-xs text-muted focus:border-brand focus:outline-none"
          />
          {url && !required && (
            <button type="button" onClick={clear} className="text-xs font-medium text-red-700 hover:underline">
              Remove
            </button>
          )}
        </div>
        <p className="text-xs text-muted">JPEG, PNG or WebP. Uploads are resized and optimised automatically.</p>
      </div>
    </div>
  );
}
