import Image from 'next/image';

// The homepage hero's crossfading photos (Collections > Hero slides). Ported
// from a Tailwind build, so every utility class was rewritten as plain scoped
// CSS; the animation timings, keyframes and layering are otherwise identical.

const SLOT = 8; // seconds each photo is fully visible
const FADE = 2.5; // seconds of crossfade into/out of each photo

// No client JS at all — the crossfade and slow Ken Burns drift are pure CSS
// animations, so this can stay a server component. (The old hero here was a
// jQuery Owl Carousel; this replaces it with zero runtime dependencies.)
export default function HeroSlideshow({ slides }: { slides: { imageUrl: string; alt: string }[] }) {
  const cycle = slides.length * SLOT;
  // Percent-of-cycle points for a single slide's opacity keyframe. Every slide
  // shares this exact keyframe; the "gliding" stagger comes entirely from
  // giving each one a negative animation-delay of its own slot offset, so it's
  // already partway into the shared cycle when the page loads.
  const fadeInEnd = (FADE / cycle) * 100;
  const holdEnd = ((FADE + SLOT) / cycle) * 100;
  const fadeOutEnd = ((2 * FADE + SLOT) / cycle) * 100;
  // A single photo has nothing to fade to, so it just stays up (and still drifts).
  const single = slides.length < 2;

  return (
    <div className="rh-hero-slideshow">
      {slides.map((slide, i) => (
        <div key={`${slide.imageUrl}-${i}`} className="rh-hero-slide" style={{ animationDelay: `-${i * SLOT}s` }}>
          <Image
            src={slide.imageUrl}
            alt={slide.alt}
            fill
            priority={i === 0}
            sizes="100vw"
            style={{ objectFit: 'cover' }}
          />
        </div>
      ))}
      <style href="rh-hero-slideshow" precedence="theme">{`
        .rh-hero-slideshow {
          position: absolute;
          top: 0; right: 0; bottom: 0; left: 0;
          z-index: 0;
          overflow: hidden;
          background: #0a2216;
        }
        .rh-hero-slide {
          position: absolute;
          top: 0; right: 0; bottom: 0; left: 0;
          opacity: 0;
          animation:
            rh-hero-fade ${cycle}s linear infinite,
            rh-hero-pan ${SLOT + FADE * 2}s linear infinite alternate;
        }
        @keyframes rh-hero-fade {
          0% { opacity: 0; }
          ${fadeInEnd.toFixed(3)}% { opacity: 1; }
          ${holdEnd.toFixed(3)}% { opacity: 1; }
          ${fadeOutEnd.toFixed(3)}% { opacity: 0; }
          100% { opacity: 0; }
        }
        @keyframes rh-hero-pan {
          0% { transform: scale(1) translate(0, 0); }
          100% { transform: scale(1.09) translate(-1.5%, -1.5%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .rh-hero-slide { animation: rh-hero-fade ${cycle}s linear infinite; }
        }
        ${single ? `.rh-hero-slide { opacity: 1; animation: rh-hero-pan ${SLOT + FADE * 2}s linear infinite alternate; }` : ''}
      `}</style>
    </div>
  );
}
