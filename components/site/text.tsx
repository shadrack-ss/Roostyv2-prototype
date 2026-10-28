import { Fragment } from "react";

/**
 * Turns admin-typed plain text into markup without ever using
 * dangerouslySetInnerHTML: line breaks become <br>, blank lines start a new
 * paragraph.
 */

export function Lines({ text }: { text: string }) {
  const lines = text.split(/\r?\n/);
  return (
    <>
      {lines.map((line, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {line}
        </Fragment>
      ))}
    </>
  );
}

export function Paragraphs({ text, className }: { text: string; className?: string }) {
  return (
    <>
      {text
        .split(/\r?\n\s*\r?\n/)
        .map((p) => p.trim())
        .filter(Boolean)
        .map((p, i) => (
          <p key={i} className={className}>
            <Lines text={p} />
          </p>
        ))}
    </>
  );
}

/** The magnific-popup class for a video link: the theme runtime binds these. */
export function videoPopupClass(url: string): string {
  return /vimeo\.com/i.test(url) ? "popup-vimeo" : "popup-youtube";
}

/** Up to two initials from a name, for avatars without a photo. */
export function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}
