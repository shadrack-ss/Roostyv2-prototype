'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// The homepage hero, modelled on the Lighthouse Scholarship hero: every photo
// carries its own headline, line and button, and each time a slide appears
// its text flies in piece by piece (fade up 20px, 0.8s each, about 0.3s
// apart). Previous/next arrows sit at the bottom on tablet and up.
//
// Slides come from Collections > Hero slides. A slide's empty headline or
// button falls back to the Hero block on the Home page.
//
// The photos keep this site's own look: a 1.2s crossfade and a slow drift-in
// zoom on the slide that is showing. All of the layout and type styles for
// .rh-hero-* live with the rest of the hero CSS in app/(site)/page.tsx.

export type HeroSlideData = {
  imageUrl: string;
  alt: string;
  heading: string;
  text: string;
  buttonLabel: string;
  buttonHref: string;
};

type Props = {
  slides: HeroSlideData[];
  fallback: { headline: string; primaryLabel: string; primaryHref: string; secondaryLabel: string; secondaryHref: string };
  highlights: string[];
};

// Long enough to read the line once the text has finished flying in (~2s).
const AUTOPLAY_MS = 7000;

// The headline's "&" is set in the gold Lora italic accent. Splitting on it
// here lets the admin write a plain sentence and still get the styling.
function Headline({ text }: { text: string }) {
  return (
    <>
      {text.split('&').map((part, i) => (
        <span key={i}>
          {i > 0 && <span className="amp">&amp;</span>}
          {part}
        </span>
      ))}
    </>
  );
}

function Arrow({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {dir === 'left' ? <path d="M19 12H5M12 19l-7-7 7-7" /> : <path d="M5 12h14M12 5l7 7-7 7" />}
    </svg>
  );
}

export default function HeroSlider({ slides, fallback, highlights }: Props) {
  const count = slides.length;
  const [index, setIndex] = useState(0);
  // The slide that just left keeps its zoom running while it fades out,
  // instead of snapping back to full size mid-fade.
  const [leaving, setLeaving] = useState(-1);

  function go(delta: number) {
    setLeaving(index);
    setIndex((index + delta + count) % count);
  }

  // A fresh timer per slide, so using the arrows restarts the countdown.
  useEffect(() => {
    if (count < 2) return;
    const id = setTimeout(() => {
      setLeaving(index);
      setIndex((index + 1) % count);
    }, AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [index, count]);

  const slide = slides[index];
  const heading = slide?.heading || fallback.headline;
  const buttonLabel = slide?.buttonLabel || fallback.primaryLabel;
  const buttonHref = slide?.buttonLabel ? slide.buttonHref || '/book' : fallback.primaryHref || '/book';

  return (
    <section className="rh-hero">
      {count > 0 && (
        <div className="rh-hero-slideshow">
          {slides.map((s, i) => (
            <div
              key={`${s.imageUrl}-${i}`}
              className={`rh-hero-slide${i === index ? ' is-active' : ''}${i === leaving ? ' is-leaving' : ''}`}
              aria-hidden={i !== index}
            >
              <Image src={s.imageUrl} alt={s.alt} fill priority={i === 0} sizes="100vw" style={{ objectFit: 'cover' }} />
            </div>
          ))}
        </div>
      )}
      <div className="rh-hero-scrim" />

      {/* Keyed on the slide, so the fly-in replays every time it changes. */}
      <div className="rh-hero-inner" key={index}>
        <h1 className="rh-fly" style={{ animationDelay: '0.3s' }}>
          <Headline text={heading} />
        </h1>
        {slide?.text && (
          <p className="rh-hero-text rh-fly" style={{ animationDelay: '0.6s' }}>
            {slide.text}
          </p>
        )}
        {highlights.length > 0 && (
          <ul className="rh-hero-facts rh-fly" style={{ animationDelay: '0.8s' }}>
            {highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        )}
        <div className="rh-hero-cta rh-fly" style={{ animationDelay: '1s' }}>
          {buttonLabel && (
            <Link href={buttonHref} className="rh-hero-btn rh-hero-btn-solid">{buttonLabel}</Link>
          )}
          {fallback.secondaryLabel && (
            <Link href={fallback.secondaryHref || '/rooms'} className="rh-hero-btn rh-hero-btn-ghost">{fallback.secondaryLabel}</Link>
          )}
        </div>
      </div>

      {count > 1 && (
        <div className="rh-hero-arrows">
          <button type="button" onClick={() => go(-1)} aria-label="Previous slide">
            <Arrow dir="left" />
          </button>
          <button type="button" onClick={() => go(1)} aria-label="Next slide">
            <Arrow dir="right" />
          </button>
        </div>
      )}

      <style href="rh-hero-slider" precedence="theme">{`
        .rh-hero-slideshow { position:absolute; top:0; right:0; bottom:0; left:0; z-index:0; overflow:hidden; background:#0a2216; }
        .rh-hero-slide { position:absolute; top:0; right:0; bottom:0; left:0; opacity:0; transition:opacity 1.2s ease; }
        .rh-hero-slide.is-active { opacity:1; }
        /* Same keyframes on both classes, so the zoom carries on (rather
           than restarting) as a slide hands over from active to leaving. */
        .rh-hero-slide.is-active, .rh-hero-slide.is-leaving { animation:rh-hero-pan 10s linear both; }
        @keyframes rh-hero-pan {
          from { transform:scale(1) translate(0, 0); }
          to { transform:scale(1.09) translate(-1.5%, -1.5%); }
        }

        /* Lighthouse's fadeInUp entrance. "both" holds each piece hidden
           until its own delay comes round. */
        .rh-fly { animation:rh-fly-up .8s ease both; }
        @keyframes rh-fly-up {
          from { opacity:0; transform:translateY(20px); }
          to { opacity:1; transform:translateY(0); }
        }

        .rh-hero-arrows { position:absolute; left:0; right:0; bottom:2rem; z-index:3; display:none; justify-content:center; gap:1rem; }
        @media (min-width:768px) { .rh-hero-arrows { display:flex; } }
        .rh-hero-arrows button {
          display:flex; align-items:center; justify-content:center; width:52px; height:52px; padding:0;
          border-radius:50%; border:2px solid rgba(255,255,255,.25); background:transparent; color:#fff;
          cursor:pointer; transition:background-color .3s ease, border-color .3s ease, color .3s ease;
        }
        .rh-hero-arrows button:hover, .rh-hero-arrows button:focus-visible { background:#fff; border-color:#fff; color:#13482c; }

        @media (prefers-reduced-motion: reduce) {
          .rh-fly, .rh-hero-slide.is-active, .rh-hero-slide.is-leaving { animation:none; }
        }
      `}</style>
    </section>
  );
}
