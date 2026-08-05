import Image from 'next/image';

// Port of the other Roosty's Homes build's hero slideshow. That project is
// Tailwind-based; this one is not, so every utility class has been rewritten
// as plain scoped CSS — the animation timings, keyframes and layering are
// otherwise identical.
const SLIDES = [
  '/roosty-photos/real/exterior-01.jpg',
  '/roosty-photos/real/exterior-02.jpg',
  '/roosty-photos/real/exterior-03.jpg',
  '/roosty-photos/real/family-exterior.jpg',
  '/roosty-photos/real/livingroom-01.jpg',
  '/roosty-photos/real/livingroom-02.jpg',
];

const SLOT = 8; // seconds each photo is fully visible
const FADE = 2.5; // seconds of crossfade into/out of each photo
const CYCLE = SLIDES.length * SLOT;

// Percent-of-cycle points for a single slide's opacity keyframe. Every slide
// shares this exact keyframe; the "gliding" stagger comes entirely from
// giving each one a negative animation-delay of its own slot offset, so it's
// already partway into the shared cycle when the page loads.
const fadeInEnd = (FADE / CYCLE) * 100;
const holdEnd = ((FADE + SLOT) / CYCLE) * 100;
const fadeOutEnd = ((2 * FADE + SLOT) / CYCLE) * 100;

// No client JS at all — the crossfade and slow Ken Burns drift are pure CSS
// animations, so this can stay a server component. (The old hero here was a
// jQuery Owl Carousel; this replaces it with zero runtime dependencies.)
export default function HeroSlideshow() {
  return (
    <div className="rh-hero-slideshow">
      {SLIDES.map((src, i) => (
        <div key={src} className="rh-hero-slide" style={{ animationDelay: `-${i * SLOT}s` }}>
          <Image
            src={src}
            alt="Roosty's Homes premises"
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
            rh-hero-fade ${CYCLE}s linear infinite,
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
          .rh-hero-slide { animation: rh-hero-fade ${CYCLE}s linear infinite; }
        }
      `}</style>
    </div>
  );
}
