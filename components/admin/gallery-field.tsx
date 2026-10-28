"use client";

import { useEffect, useRef, useState } from "react";

/**
 * An ordered set of photos. Posts back what lib/content/parse.ts expects:
 * one hidden `<name>__keep` per photo already saved, in display order, plus
 * the multi-file input `<name>` for new photos (added after the kept ones).
 */
export function GalleryField({ name, id, value }: { name: string; id?: string; value: string[] }) {
  const [kept, setKept] = useState<string[]>(value);
  const [pending, setPending] = useState<{ url: string; name: string }[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  // Release the preview object URLs when they are replaced or on unmount.
  useEffect(() => () => pending.forEach((p) => URL.revokeObjectURL(p.url)), [pending]);

  function move(index: number, delta: number) {
    setKept((list) => {
      const to = index + delta;
      if (to < 0 || to >= list.length) return list;
      const next = [...list];
      [next[index], next[to]] = [next[to], next[index]];
      return next;
    });
  }

  function onFiles(files: FileList | null) {
    setPending([...(files ?? [])].map((f) => ({ url: URL.createObjectURL(f), name: f.name })));
  }

  function clearNew() {
    if (fileRef.current) fileRef.current.value = "";
    setPending([]);
  }

  const control = "rounded bg-white/90 px-1.5 text-xs leading-5 text-ink shadow hover:bg-white disabled:opacity-40";

  return (
    <div className="space-y-3">
      {kept.map((url) => (
        <input key={url} type="hidden" name={`${name}__keep`} value={url} />
      ))}

      {kept.length > 0 ? (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {kept.map((url, i) => (
            <li key={url} className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-line bg-canvas">
              {/* eslint-disable-next-line @next/next/no-img-element -- admin thumbnails of arbitrary stored paths */}
              <img src={url} alt="" className="h-full w-full object-cover" />
              <span className="absolute left-1.5 top-1.5 rounded bg-black/60 px-1.5 text-xs leading-5 text-white">{i + 1}</span>
              <div className="absolute inset-x-1.5 bottom-1.5 flex justify-between gap-1">
                <span className="flex gap-1">
                  <button type="button" className={control} onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move earlier">&larr;</button>
                  <button type="button" className={control} onClick={() => move(i, 1)} disabled={i === kept.length - 1} aria-label="Move later">&rarr;</button>
                </span>
                <button
                  type="button"
                  className={`${control} text-red-700`}
                  onClick={() => setKept((list) => list.filter((u) => u !== url))}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-lg border border-dashed border-line px-4 py-6 text-center text-sm text-muted">No photos yet.</p>
      )}

      <div>
        <input
          ref={fileRef}
          id={id ?? name}
          name={name}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => onFiles(e.target.files)}
          className="block w-full text-sm text-muted file:mr-3 file:rounded-md file:border-0 file:bg-brand-soft file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-brand hover:file:bg-brand/15"
        />
        {pending.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {pending.map((p) => (
              // eslint-disable-next-line @next/next/no-img-element -- blob: previews of files not yet uploaded
              <img key={p.url} src={p.url} alt={p.name} className="h-14 w-20 rounded-md border border-gold object-cover" />
            ))}
            <span className="text-xs text-muted">
              {pending.length} new photo{pending.length === 1 ? "" : "s"}, added at the end when you save.{" "}
              <button type="button" onClick={clearNew} className="font-medium text-red-700 hover:underline">Clear</button>
            </span>
          </div>
        )}
        <p className="mt-1 text-xs text-muted">Select several at once if you like. JPEG, PNG or WebP, resized automatically.</p>
      </div>
    </div>
  );
}
