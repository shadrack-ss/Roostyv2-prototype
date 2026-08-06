import Link from 'next/link';
import { Raleway, Lora, Jost } from 'next/font/google';
import OwlCarousel from './owl-carousel';
import HeroSlideshow from './hero-slideshow';

// Montana's own font (trying it out on the two Montana-derived sections
// below, in place of the rest of the site's Playfair Display/Work Sans, to
// see how it looks before committing).
// The hero headline is set in Plus Jakarta Sans, but that family is declared in
// app/layout.tsx, not here -- the header wordmark uses it too and lives in the
// layout, so it is loaded once there and --font-jakarta is already in scope by
// the time this page renders.
//
// Why a sans at all: this is a deliberate move away from the serif line (Lora,
// then Fraunces). The original constraint still holds and is easier to satisfy
// here -- a sans has near-uniform stroke weight, so there are no thins to break
// up over the hero photography. Jakarta over Inter because Inter is a UI face
// tuned for small screen text and flattens to something fairly neutral at
// 4.25rem, whereas Jakarta keeps warmth and distinctive letterforms that size.

// Loaded for exactly one glyph: the hero's ampersand. Jakarta's italic is a
// plain oblique, whereas Lora has a proper swash-like italic &, and that shape
// is the entire reason the character is singled out in gold. Mixing a serif
// accent into a sans headline is intentional, not an oversight.
// Italic 600 only, so the download stays tiny for its one job.
const lora = Lora({
  subsets: ['latin'],
  weight: ['600'],
  style: ['italic'],
  variable: '--font-lora',
  display: 'swap',
});

// Hero feature row only. Jost is a geometric sans with generously open,
// even-width capitals -- which is what tracked-out all-caps needs. Raleway's
// caps are comparatively narrow and slightly irregular in width, so at this
// size and letter-spacing they looked unevenly gapped.
const jost = Jost({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jost',
  display: 'swap',
});

const raleway = Raleway({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-raleway',
  display: 'swap',
});


// NOTE: the hero used to be a jQuery Owl Carousel driven by a HERO_OPTIONS
// config here. It has been replaced wholesale by the other build's hero
// (see <HeroSlideshow /> + .rh-hero below), which is pure CSS and needs no
// Owl config — so that constant is gone. Owl still drives the Latest Updates
// and testimonials carousels further down, hence the import above stays.

const TESTIMONIALS_OPTIONS = {
  center: false,
  items: 1,
  loop: true,
  stagePadding: 0,
  autoplay: true,
  margin: 20,
  nav: true,
  dots: true,
  navText: ['<span class="icon-arrow_back">', '<span class="icon-arrow_forward">'],
  responsive: {
    600: { margin: 20, stagePadding: 0, items: 1 },
    1000: { margin: 20, stagePadding: 0, items: 2 },
  },
};

// The gallery from the previous roostyshomes.com build, in its original order
// and with its original photos (public/roosty-photos holds the same files the
// old WordPress site served from wp-content/uploads/2026/01).
//
// That site served pre-cropped 550x660 thumbnails; only the full-size
// originals are vendored here, and they are a mix of landscape and portrait
// (AT8A2629 is a tall portrait shot). Left at their natural aspect they make
// the 4-across grid ragged, so .gallery-tile below crops them to a single
// ratio -- the same thing the old thumbnails were doing.
const GALLERY = [
  { src: 'AT8A2629.jpg-scaled.jpg', alt: 'Apartment living room with a wall-mounted TV and dining area' },
  { src: 'AT8A2634.jpg.jpg', alt: 'Open-plan sitting room, dining table and kitchen in an apartment' },
  { src: 'AT8A2560.jpg.jpg', alt: 'Apartment living room in teal with an orange sofa and kitchen counter' },
  { src: 'AT8A2586.jpg.jpg', alt: 'Bedroom with a carved hardwood bed and mosquito net' },
  { src: 'AT8A2584.jpg.jpg', alt: 'Blue bedroom with a dark carved four-poster bed and canopy' },
  { src: 'AT8A2653.jpg.jpg', alt: 'Bedroom with a full-height wardrobe and a canopy over the bed' },
  { src: 'AT8A2547.jpg.jpg', alt: 'Twin room with two single beds and gold curtains' },
  { src: 'AT8A2527.jpg.jpg', alt: 'Guests being served at the indoor bar counter' },
];

const EVENTS_OPTIONS = {
  center: false,
  items: 1,
  loop: true,
  stagePadding: 0,
  autoplay: true,
  margin: 20,
  nav: true,
  dots: true,
  navText: ['<span class="icon-arrow_back">', '<span class="icon-arrow_forward">'],
  responsive: {
    600: { margin: 20, stagePadding: 0, items: 1, nav: false, dots: true },
    1000: { margin: 20, stagePadding: 0, items: 2, nav: true, dots: true },
    1200: { margin: 20, stagePadding: 0, items: 3, nav: true, dots: true },
  },
};

export default function Home() {
  return (
    <div className={`raleway-page ${raleway.variable} ${lora.variable} ${jost.variable}`}>
      {/*
        Trying Raleway (Montana's own font) across the whole homepage, not
        just the two Montana-derived sections, to see how it looks against
        the rest of the site. !important is deliberate here: the theme's own
        style.css sets font-family on body and on specific heading selectors
        (.section-heading h2, .hotel-room h3, etc.) with equal or higher
        specificity than a plain class selector, so a normal cascade wouldn't
        win. This is scoped to .raleway-page only — nothing outside the
        homepage (header, footer, other routes) is affected. Revert by
        deleting this <style> block and the wrapping div/raleway import if
        the look isn't a keeper.
      */}
      <style href="raleway-page" precedence="theme">{`
        .raleway-page, .raleway-page h1, .raleway-page h2, .raleway-page h3,
        .raleway-page h4, .raleway-page h5, .raleway-page h6, .raleway-page p,
        .raleway-page a, .raleway-page blockquote {
          font-family: var(--font-raleway), "Raleway", sans-serif !important;
        }
        /* Deliberately NOT included above: span. Every icon on this theme
           (carousel nav arrows, play buttons, amenity icons) is a <span
           className="icon-..."> whose font-family is set to icomoon/
           flaticon with !important — a blanket ".raleway-page span" rule
           directly overrides that on the icon spans too (not just plain
           text spans), which is what made every icon render blank. Plain
           text spans (the About eyebrow, the video caption) still pick up
           Raleway through ordinary inheritance from this wrapper, so they
           don't need to be listed here. */
      `}</style>
      {/*
        HERO — ported wholesale from the other Roosty's Homes build. That
        design is Tailwind-based and this project is not, so every utility
        class has been rewritten as plain CSS below; the structure, colours,
        type scale, spacing and animation are otherwise identical.

        What was here before: a jQuery Owl Carousel of three
        .site-blocks-cover slides, each with its own heading/caption/CTAs and
        a CSS Ken Burns zoom. All of it is gone -- replaced by
        <HeroSlideshow />, a dependency-free CSS crossfade. The site's own
        top contact bar and navbar (in app/layout.tsx) are untouched and
        still float over this section, exactly as before.

        Palette is the other build's theme tokens, inlined since there is no
        Tailwind @theme here: forest-950 #0a2216, forest-900 #0d2b1c,
        forest-50 #f0f7f1, yellow-300 #f3e3a0, yellow-200 #f7ecbc.
      */}
      <style href="rh-hero" precedence="theme">{`
        /*
          section: relative flex items-end overflow-hidden.

          The other build uses min-h-[88vh]; here it is a full 100vh so the
          hero fills the desktop viewport exactly. The top contact bar and
          navbar are position:absolute (see app/layout.tsx), so they take up
          no flow height and simply overlay this section's first ~128px --
          which means 100vh really is the whole first screen, with nothing
          below the fold. Hero content is bottom-aligned, so it never
          collides with those bars.
        */
        .rh-hero {
          position: relative;
          display: flex;
          align-items: flex-end;
          min-height: 100vh;
          overflow: hidden;
        }
        /*
          Two stacked layers, both on this one element:

          1. A flat brand-green wash across the whole photo (the
             background-color). This is the "light overlay" -- it evens out
             the slides, which range from a bright white living room to a
             dark exterior, so the white type has a consistent surface
             underneath whichever one is showing.
          2. The gradient on top of it, deepening toward the bottom where the
             headline, feature row and buttons actually sit.

          NOTE: no backticks anywhere in this block. All of this CSS lives
          inside a JS template literal, so a stray backtick terminates the
          string early and the file stops parsing.

          Listing the gradient in background-image and the wash in
          background-color composites them in one paint with no extra DOM.
          Kept deliberately light (0.28) -- enough to unify the slides without
          muddying the photography, which is the point of the hero.
        */
        .rh-hero-scrim {
          position: absolute;
          top: 0; right: 0; bottom: 0; left: 0;
          z-index: 1;
          background-color: rgba(19, 72, 44, 0.28);
          background-image: linear-gradient(
            to top,
            rgba(10, 34, 22, 0.80) 0%,
            rgba(10, 34, 22, 0.20) 55%,
            rgba(10, 34, 22, 0.00) 100%
          );
        }
        /* inner: relative mx-auto w-full max-w-6xl px-6 pb-20 */
        .rh-hero-inner {
          position: relative;
          z-index: 2;
          margin-left: auto;
          margin-right: auto;
          width: 100%;
          max-width: 72rem;
          padding: 0 1.5rem 5rem;
        }
        /* h1: Plus Jakarta Sans.
           !important on font-family because the .raleway-page rule above sets
           Raleway on every heading with !important too, and would otherwise win.

           max-width is in ch (not rem) so the line breaks at roughly the same
           WORD at every viewport, rather than landing differently at each
           size. Kept to 3.5rem at the top end on purpose: the hero is
           bottom-aligned under an absolutely-positioned navbar, so an
           oversized headline is exactly what pushes the block up into the
           menu. */
        .rh-hero h1 {
          margin: 0 0 1.75rem;
          max-width: 18ch;
          font-family: var(--font-jakarta), "Plus Jakarta Sans", system-ui, sans-serif !important;
          font-size: 2.5rem;
          /* 1.35, up from 1.2. At 1.2 the two lines were nearly touching --
             "Elegance"'s ascenders ran close into the descender of the comma
             above. Deliberately restrained: at the 4.25rem desktop size every
             0.1 here adds ~14px; the hero is bottom-aligned under an
             absolutely-positioned navbar, so extra leading is another way to
             push the block up into the menu. */
          line-height: 1.35;
          /* 800 is Plus Jakarta Sans's heaviest cut. Worth knowing: a sans set
             this heavy over photography gains most of its readability from
             sheer mass, so the text-shadow below is doing less work than it
             was under the serifs -- but it stays, since the slideshow runs a
             bright living-room frame where the white would otherwise flatten
             into the wall behind it. */
          font-weight: 800;
          color: #ffffff;
          text-shadow: 0 2px 18px rgba(0, 0, 0, 0.5);
        }
        /* The one glyph on the page set in a serif. Lora's italic & is a
           swash-like form that Jakarta has no equivalent of, and that shape --
           not just the gold -- is what makes the character read as an accent.

           font-family needs no !important even though the h1 above uses it:
           the .raleway-page rule at the top of this file deliberately omits
           the span selector from its list, so nothing is forcing a family onto
           this element and a plain declaration wins over inheritance.
           (No backticks anywhere in this block -- it is a JS template literal.)

           600 against the line's 800 is a wider gap than before, and that is
           intentional -- the swash's appeal is in its thin strokes, which a
           heavier cut would thicken away just as the headline got heavier. */
        .rh-hero h1 .amp {
          font-family: var(--font-lora), "Lora", Georgia, serif;
          font-style: italic;
          font-weight: 600;
          color: #f0dfae;
        }
        @media (min-width: 640px) { .rh-hero h1 { font-size: 3.25rem; } }
        @media (min-width: 1024px) { .rh-hero h1 { font-size: 4.25rem; } }
        /* Separators are drawn as ::before on every item except
           the first, so the list can wrap and reflow without leaving a
           dangling dot at the end of a line. */
        .rh-hero-facts {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem 1.5rem;
          margin: 0;
          padding: 0;
          list-style: none;
        }
        /* Jost at 500, not 600: a geometric sans in wide-tracked caps reads
           heavier than its weight suggests, and 600 fought the headline for
           attention. Tracking is up to .2em -- geometric caps need more air
           between them than a humanist face does. */
        .rh-hero-facts li {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          font-family: var(--font-jost), "Jost", sans-serif;
          font-size: 0.875rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #ffffff;
          text-shadow: 0 1px 6px rgba(0, 0, 0, 0.6);
        }
        .rh-hero-facts li + li::before {
          content: '';
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #c99e54;
          flex: none;
        }
        .rh-hero-cta {
          margin-top: 2rem;
          display: flex;
          flex-wrap: wrap;
          gap: 0.875rem;
        }
        .rh-hero-btn {
          display: inline-block;
          border-radius: 9999px;
          padding: 0.875rem 2rem;
          font-size: 0.875rem;
          font-weight: 600;
          letter-spacing: 0.03em;
          transition: background-color .3s ease, color .3s ease, border-color .3s ease, transform .3s ease;
        }
        .rh-hero-btn:hover { transform: translateY(-2px); }
        .rh-hero-btn-solid {
          background: #c99e54;
          color: #13482c;
          box-shadow: 0 10px 24px -8px rgba(0,0,0,.45);
        }
        .rh-hero-btn-solid:hover { background: #f3e3a0; color: #13482c; }
        /* Frosted rather than a plain outline: over a photo a 1px white
           border alone can vanish against bright patches, and the blur also
           keeps the label readable whatever is behind it. */
        .rh-hero-btn-ghost {
          border: 1px solid rgba(255, 255, 255, 0.55);
          background: rgba(255, 255, 255, 0.08);
          -webkit-backdrop-filter: blur(6px);
          backdrop-filter: blur(6px);
          color: #ffffff;
        }
        .rh-hero-btn-ghost:hover { background: rgba(255, 255, 255, 0.18); border-color: #ffffff; color: #ffffff; }
        @media (max-width: 575px) {
          .rh-hero-btn { flex: 1 1 100%; text-align: center; }
        }
      `}</style>
      <section className="rh-hero">
        <HeroSlideshow />
        <div className="rh-hero-scrim" />
        <div className="rh-hero-inner">
          <h1>
            Experience Comfort <span className="amp">&amp;</span> Relaxation
          </h1>
          <ul className="rh-hero-facts">
            <li>Cottages &amp; Apartments</li>
            <li>Bar &amp; Restaurant</li>
            <li>Party Gardens</li>
            <li>Secure Parking</li>
          </ul>
          <div className="rh-hero-cta">
            <Link href="/book" className="rh-hero-btn rh-hero-btn-solid">Book Your Stay</Link>
            <Link href="/rooms" className="rh-hero-btn rh-hero-btn-ghost">Explore Rooms</Link>
          </div>
        </div>
      </section>

      <div className="site-section">
        <style href="about-intro" precedence="theme">{`
          .about-intro { font-family:var(--font-raleway),"Raleway",sans-serif; }
          .about-intro .about-eyebrow { display:block; color:#c99e54; font-size:14px; font-weight:400; margin-bottom:15px; }
          .about-intro .about-title { font-size:46px; line-height:56px; font-weight:500; color:#1f1f1f; margin:0 0 20px; }
          .about-intro p { font-size:16px; line-height:28px; margin:0 0 30px; }
          /* Montana's line-button: a permanent full-width underline bar
             (not just on :hover), rather than a plain text-decoration. */
          .about-intro a.text-uppercase { position:relative; display:inline-block; line-height:1; padding-bottom:4px; text-decoration:none; }
          .about-intro a.text-uppercase::before { content:""; position:absolute; left:0; bottom:0; width:100%; height:1px; background:#2aa845; }
          @media (max-width:767px) {
            .about-intro .about-title { font-size:30px; line-height:36px; }
            .about-intro .about-title br { display:none; }
            /* On mobile the two columns stack, and in source order the photos
               come first -- so a visitor scrolling out of the hero hits a
               second block of imagery before being told anything. Flip the
               order so the copy leads and the photos follow it.

               Done with flex order (no backticks anywhere in this block --
               it is a JS template literal) rather than by moving the markup: the
               desktop layout wants photos on the LEFT, which is exactly what
               source order gives it, so reordering the JSX would just push
               the problem to the other breakpoint. .row is already
               display:flex, so order works with no other layout change.

               The margin swap matters too -- the image column carries the
               gap between the two (mb-5), which sits in the wrong place once
               it is the second item. */
            .about-row .about-media { order:2; margin-bottom:0 !important; }
            .about-row .about-copy { order:1; margin-bottom:2.5rem; }
          }
          @media (min-width:768px) and (max-width:991px) {
            .about-intro .about-title { font-size:36px; line-height:42px; }
          }
        `}</style>
        <div className="container">
          <div className="row align-items-center about-row">
            <div className="col-md-6 mb-5 mb-md-0 about-media">
              <div className="img-border">
                <a href="https://vimeo.com/28959265" className="popup-vimeo image-play">
                  <span className="icon-wrap">
                    <span className="icon icon-play"></span>
                  </span>
                  <img src="/theme/images/img_2.jpg" alt="" className="img-fluid" fetchPriority="high" decoding="sync" />
                </a>
              </div>

              <img src="/theme/images/img_1.jpg" alt="Image" className="img-fluid image-absolute" fetchPriority="high" decoding="sync" />
            </div>
            <div className="col-md-5 ml-auto about-copy">
              {/*
                Montana's about_info text structure: small eyebrow label, a
                large two-line headline, then body copy. The eyebrow uses this
                site's gold rather than Montana's blue, and the Learn More link
                keeps the theme's own styling.
              */}
              <div className={`about-intro ${raleway.variable}`}>
                <span className="about-eyebrow">About Us</span>
                <h2 className="about-title">
                  Comfort, Great Food <br />
                  &amp; Peaceful Stays
                </h2>
                <p>
                  Experience the ultimate getaway at Roosty&apos;s Homes. From cozy cottages and
                  modern apartments to our vibrant bar, restaurant, lush gardens, and fun kids&apos;
                  play area - where comfort meets great food, refreshing drinks, and peaceful
                  stays.
                </p>
                <p>
                  <Link href="/about" className="text-uppercase">
                    Learn More <span className="icon-arrow-right small"></span>
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="site-section bg-light">
        <div className="container">
          <div className="row">
            <div className="col-md-6 mx-auto text-center mb-5 section-heading">
              <h2 className="mb-5">Our Rooms</h2>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 col-lg-3 mb-5">
              <div className="hotel-room text-center">
                <Link href="/rooms" className="d-block mb-0 thumbnail">
                  <img src="/roosty-photos/AT8A2643.jpg.jpg" alt="One Bedroom Occupancy" className="img-fluid" loading="lazy" decoding="async" />
                </Link>
                <div className="hotel-room-body">
                  <h3 className="heading mb-0"><Link href="/rooms">One Bedroom Occupancy</Link></h3>
                  <strong className="price">UGX 200,000 / per night</strong>
                  <span className="d-block text-muted small mt-2">2 Guests &middot; 190 sqm</span>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3 mb-5">
              <div className="hotel-room text-center">
                <Link href="/rooms" className="d-block mb-0 thumbnail">
                  <img src="/roosty-photos/AT8A2449.jpg.jpg" alt="Deluxe Cottage" className="img-fluid" loading="lazy" decoding="async" />
                </Link>
                <div className="hotel-room-body">
                  <h3 className="heading mb-0"><Link href="/rooms">Deluxe Cottage</Link></h3>
                  <strong className="price">UGX 200,000 / per night</strong>
                  <span className="d-block text-muted small mt-2">2 Guests &middot; 600 sqm</span>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3 mb-5">
              <div className="hotel-room text-center">
                <Link href="/rooms" className="d-block mb-0 thumbnail">
                  <img src="/roosty-photos/AT8A2448.jpg.jpg" alt="Two Bedroom Occupancy" className="img-fluid" loading="lazy" decoding="async" />
                </Link>
                <div className="hotel-room-body">
                  <h3 className="heading mb-0"><Link href="/rooms">Two Bedroom Occupancy</Link></h3>
                  <strong className="price">UGX 250,000 / per night</strong>
                  <span className="d-block text-muted small mt-2">6 Guests &middot; 150 sqm</span>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3 mb-5">
              <div className="hotel-room text-center">
                <Link href="/rooms" className="d-block mb-0 thumbnail">
                  <img src="/roosty-photos/g-2.jpg" alt="Family Suite" className="img-fluid" loading="lazy" decoding="async" />
                </Link>
                <div className="hotel-room-body">
                  <h3 className="heading mb-0"><Link href="/rooms">Family Suite</Link></h3>
                  <strong className="price">UGX 360,000 / per night</strong>
                  <span className="d-block text-muted small mt-2">4 Guests &middot; 400 sqm</span>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 text-center">
              <Link href="/rooms" className="btn btn-primary pill text-white px-4">
                View All Rooms
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="site-section">
        <div className="container">
          <div className="row">
            <div className="col-md-6 mx-auto text-center mb-5 section-heading">
              <h2 className="mb-5">Our Amenities</h2>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-6 col-md-4 col-lg-3">
              <div className="text-center p-4 item">
                <span className="flaticon-pool display-3 mb-3 d-block text-primary"></span>
                <h2 className="h5">Pool Table</h2>
              </div>
            </div>
            <div className="col-sm-6 col-md-4 col-lg-3">
              <div className="text-center p-4 item">
                <span className="flaticon-desk display-3 mb-3 d-block text-primary"></span>
                <h2 className="h5">24/7 Reservation</h2>
              </div>
            </div>
            <div className="col-sm-6 col-md-4 col-lg-3">
              <div className="text-center p-4 item">
                <span className="flaticon-exit display-3 mb-3 d-block text-primary"></span>
                <h2 className="h5">Secure Premises</h2>
              </div>
            </div>
            <div className="col-sm-6 col-md-4 col-lg-3">
              <div className="text-center p-4 item">
                <span className="flaticon-parking display-3 mb-3 d-block text-primary"></span>
                <h2 className="h5">Car Parking</h2>
              </div>
            </div>

            <div className="col-sm-6 col-md-4 col-lg-3">
              <div className="text-center p-4 item">
                <span className="flaticon-hair-dryer display-3 mb-3 d-block text-primary"></span>
                <h2 className="h5">Room Service</h2>
              </div>
            </div>

            <div className="col-sm-6 col-md-4 col-lg-3">
              <div className="text-center p-4 item">
                <span className="flaticon-minibar display-3 mb-3 d-block text-primary"></span>
                <h2 className="h5">Bar &amp; Restaurant</h2>
              </div>
            </div>
            <div className="col-sm-6 col-md-4 col-lg-3">
              <div className="text-center p-4 item">
                <span className="flaticon-drink display-3 mb-3 d-block text-primary"></span>
                <h2 className="h5">Cocktails &amp; Fresh Juice</h2>
              </div>
            </div>
            <div className="col-sm-6 col-md-4 col-lg-3">
              <div className="text-center p-4 item">
                <span className="flaticon-cab display-3 mb-3 d-block text-primary"></span>
                <h2 className="h5">Online Booking</h2>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*
        PLACEHOLDER SECTION — exact port of the Montana template's
        video_area (a full-bleed background photo with a dark overlay, a
        centered eyebrow/heading, and a play button). Copy and background
        photo are the template's own stock content — replace with a real
        Roosty's Homes photo/video, or delete this whole section, when ready.
        The play button reuses this site's own .popup-youtube wiring (see
        public/theme/js/main.js) instead of Montana's own unloaded video JS.
      */}
      <div
        className="video_area overlay text-center"
        style={{ backgroundImage: "url('/montana/video/video.jpg')" }}
      >
        <style href="video-area" precedence="theme">{`
          .video_area { padding:250px 0; background-size:cover; background-position:center center; position:relative; z-index:0; }
          .video_area::before { content:""; position:absolute; inset:0; background-color:#1f1f1f; opacity:.5; z-index:-1; }
          .video_area .video_area_inner span { font-size:14px; color:#fff; }
          .video_area .video_area_inner h3 { font-size:46px; color:#fff; line-height:56px; font-weight:400; margin-top:12px; margin-bottom:28px; }
          /* This theme's icomoon font subset doesn't include a play glyph
             (icon-play renders blank — the same gap shows on the existing
             .image-play/.icon-wrap overlays elsewhere on this page), so the
             triangle is drawn in pure CSS instead of depending on an icon
             font, matching Montana's fa-play visually with no extra asset. */
          .video_area .video_area_inner a.video_btn { width:60px; height:60px; background:#fff; display:inline-flex; align-items:center; justify-content:center; border-radius:50%; transition:background .3s ease, transform .3s ease; }
          .video_area .video_area_inner a.video_btn::before { content:""; width:0; height:0; margin-left:4px; border-top:9px solid transparent; border-bottom:9px solid transparent; border-left:15px solid #c99e54; transition:border-left-color .3s ease; }
          .video_area .video_area_inner a.video_btn:hover { background:#238a3a; transform:scale(1.1); }
          .video_area .video_area_inner a.video_btn:hover::before { border-left-color:#fff; }
          @media (max-width:767px) {
            .video_area { padding:100px 0; }
            .video_area .video_area_inner h3 { font-size:30px; }
          }
          @media (min-width:768px) and (max-width:991px) {
            .video_area { padding:100px 0; }
          }
        `}</style>
        <div className="video_area_inner">
          <span>Roosty&apos;s Homes</span>
          <h3>Relax and Enjoy your <br />
            Stay</h3>
          <a href="https://www.youtube.com/watch?v=vLnPwxZdW4Y" className="video_btn popup-youtube" aria-label="Play video"></a>
        </div>
      </div>

      {/*
        PLACEHOLDER SECTION — exact port of the Montana template's second
        about_area (about_thumb2 layout: two stacked food photos on the left,
        eyebrow/heading/copy on the right — the mirror image of the earlier
        About section). Sits directly after video_area with no extra margin
        between them, same as the template: this section's own
        padding-top:200px (Montana's own value) is what creates the gap.
        Copy and photos are the template's own stock content — replace with
        real Roosty's Homes food photos/copy, or delete this whole section,
        when ready. Learn More reuses this site's own text-uppercase/
        icon-arrow-right link styling rather than Montana's line-button, to
        match the earlier About section.
      */}
      <div className={`montana-food-scope ${raleway.variable}`}>
        <style href="montana-food" precedence="theme">{`
          /* Same purged-bootstrap gap as the first About section: this build's
             bootstrap.min.css ships no col-xl or col-lg-5/col-lg-7 classes,
             so re-declare just the four this section needs, scoped. */
          /* flex:0 0 100% (not just width:100%) is required on the mobile
             base: as flex items these columns could otherwise shrink down
             to their min-content size, which collapsed the whole column to
             ~10px and overflowed the row. */
          .montana-food-scope .col-lg-5,
          .montana-food-scope .col-lg-7,
          .montana-food-scope .col-xl-5,
          .montana-food-scope .col-xl-7 { position:relative; -ms-flex:0 0 100%; flex:0 0 100%; width:100%; max-width:100%; padding-right:15px; padding-left:15px; }
          @media (min-width:992px) {
            .montana-food-scope .col-lg-5 { -ms-flex:0 0 41.666667%; flex:0 0 41.666667%; max-width:41.666667%; }
            .montana-food-scope .col-lg-7 { -ms-flex:0 0 58.333333%; flex:0 0 58.333333%; max-width:58.333333%; }
          }
          @media (min-width:1200px) {
            .montana-food-scope .col-xl-5 { -ms-flex:0 0 41.666667%; flex:0 0 41.666667%; max-width:41.666667%; }
            .montana-food-scope .col-xl-7 { -ms-flex:0 0 58.333333%; flex:0 0 58.333333%; max-width:58.333333%; }
          }

          .montana-food-scope .about_area { padding-top:200px; padding-bottom:193px; }
          .montana-food-scope .mb-20px { margin-bottom:20px; }
          .montana-food-scope { font-family:var(--font-raleway),"Raleway",sans-serif; }
          .montana-food-scope .section_title span { display:block; color:#c99e54; font-size:14px; font-weight:400; margin-bottom:15px; }
          .montana-food-scope .section_title h3 { font-size:46px; font-weight:500; line-height:56px; color:#1f1f1f; margin:0; }
          .montana-food-scope .about_info p { font-size:16px; line-height:28px; color:#4d4d4d; margin-top:0; margin-bottom:30px; }
          /* Montana gives .img_1/.img_2 no flex sizing, so they sit at the
             images' natural widths (284px / 294px) and leave empty space
             before the text column. We state those widths as an explicit
             flex-basis rather than relying on auto, for two reasons:
             the basis must be definite so the image's width:100% has
             something real to resolve against (with an auto basis the
             wrapper is sized from the image and the image from the
             wrapper, which collapses to 0 once min-width:0 removes the
             intrinsic floor) — and a 0x0 lazy image never intersects the
             viewport, so it would never load at all. min-width:0 + shrink
             still lets both scale down together on narrow screens rather
             than overflowing; Montana never stacks these on mobile. */
          .montana-food-scope .about_thumb2 .img_1 { -ms-flex:0 1 284px; flex:0 1 284px; min-width:0; }
          .montana-food-scope .about_thumb2 .img_2 { -ms-flex:0 1 294px; flex:0 1 294px; min-width:0; }
          .montana-food-scope .about_thumb2 img { width:100%; height:auto; display:block; }
          .montana-food-scope .about_thumb2 .img_2 { margin-top:40px; margin-left:10px; }
          /* Montana's line-button: a permanent full-width underline bar
             (not just on :hover), rather than a plain text-decoration. */
          .montana-food-scope .about_info a.text-uppercase { position:relative; display:inline-block; padding-bottom:2px; text-decoration:none; }
          .montana-food-scope .about_info a.text-uppercase::before { content:""; position:absolute; left:0; bottom:0; width:100%; height:1px; background:#2aa845; }

          @media (max-width:767px) {
            .montana-food-scope .about_area { padding-top:40px; padding-bottom:40px; }
            .montana-food-scope .section_title h3 { font-size:30px; line-height:36px; }
            .montana-food-scope .section_title h3 br { display:none; }
          }
          @media (min-width:768px) and (max-width:991px) {
            .montana-food-scope .about_area { padding-top:80px; padding-bottom:120px; }
            .montana-food-scope .section_title h3 { font-size:36px; line-height:42px; }
          }
          @media (min-width:992px) and (max-width:1200px) {
            .montana-food-scope .about_area { padding-top:100px; padding-bottom:193px; }
          }
        `}</style>
        <div className="about_area">
          <div className="container">
            <div className="row">
              <div className="col-xl-7 col-lg-7">
                <div className="about_thumb2 d-flex">
                  {/*
                    width/height are the images' real pixel sizes. They are
                    required here, not just nice-to-have: these are lazy and
                    are sized from their intrinsic width (Montana gives the
                    wrappers no flex basis), so without them the images have
                    no size before loading, collapse to 0x0, and a 0x0 lazy
                    image never intersects the viewport — so it would never
                    load at all. They also prevent layout shift.
                  */}
                  <div className="img_1">
                    <img src="/montana/about2/1.jpg" alt="" className="img-fluid" width={284} height={400} loading="lazy" decoding="async" />
                  </div>
                  <div className="img_2">
                    <img src="/montana/about2/2.jpg" alt="" className="img-fluid" width={294} height={400} loading="lazy" decoding="async" />
                  </div>
                </div>
              </div>
              <div className="col-xl-5 col-lg-5">
                <div className="about_info">
                  <div className="section_title mb-20px">
                    <span>Delicious Food</span>
                    <h3>We Serve Fresh and <br />
                      Delicious Food</h3>
                  </div>
                  <p>
                    Suscipit libero pretium nullam potenti. Interdum, blandit phasellus consectetuer dolor ornare
                    dapibus enim ut tincidunt rhoncus tellus sollicitudin pede nam maecenas, dolor sem. Neque
                    sollicitudin enim. Dapibus lorem feugiat facilisi faucibus et. Rhoncus.
                  </p>
                  <p>
                    <Link href="/about" className="text-uppercase">
                      Learn More <span className="icon-arrow-right small"></span>
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="py-5 upcoming-events"
        style={{
          backgroundImage: "url('/roosty-photos/background.jpg')",
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
        }}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h2 className="text-white">Host Your Event With Us</h2>
              <Link href="/contact" className="text-white btn btn-outline-warning rounded-0 text-uppercase">
                Enquire Now
              </Link>
            </div>
            <div className="col-md-6">
              <span className="caption">Gardens available for hire</span>
              <h3 className="text-white">Weddings, Parties &amp; Functions</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="site-section">
        <div className="container">
          <div className="row">
            <div className="col-md-6 mx-auto text-center mb-5 section-heading">
              <h2 className="mb-5">Our Gallery</h2>
            </div>
          </div>
          <style href="gallery-tile" precedence="theme">{`
            /* Crop every tile to one ratio so the 4-across grid stays even
               whatever the photo's native orientation. The anchor (not the
               img) carries the box because .image-popup is what the lightbox
               binds to and what sits in the grid cell. */
            .gallery-tile { display:block; aspect-ratio:4 / 3; overflow:hidden; }
            .gallery-tile img { width:100%; height:100%; object-fit:cover; display:block; }
          `}</style>
          <div className="row no-gutters">
            {GALLERY.map((photo) => (
              <div className="col-md-6 col-lg-3" key={photo.src}>
                <a href={`/roosty-photos/${photo.src}`} className="image-popup img-opacity gallery-tile">
                  <img src={`/roosty-photos/${photo.src}`} alt={photo.alt} className="img-fluid" loading="lazy" decoding="async" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/*
        PLACEHOLDER SECTION — "Latest Updates" cards below use template filler
        text (Lorem Ipsum, sample dates/authors). Replace with real Roosty's
        Homes news/blog posts, or delete this whole section, when ready.
      */}
      <div className="site-section block-15">
        <div className="container">
          <div className="row">
            <div className="col-md-6 mx-auto text-center mb-5 section-heading">
              <h2>Latest Updates</h2>
            </div>
          </div>

          <OwlCarousel className="nonloop-block-15 owl-carousel" options={EVENTS_OPTIONS}>
            <div className="media-with-text p-md-5">
              <div className="img-border-sm mb-4">
                <a href="#" className="popup-vimeo image-play">
                  <img src="/theme/images/img_1.jpg" alt="" className="img-fluid" loading="lazy" decoding="async" />
                </a>
              </div>
              <h2 className="heading mb-0"><a href="#">Lorem Ipsum Dolor Sit Amet</a></h2>
              <span className="mb-3 d-block post-date">Dec 20th, 2018 &bull; By <a href="#">Admin</a></span>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio dolores culpa qui aliquam placeat nobis veritatis tempora natus rerum obcaecati.</p>
            </div>

            <div className="media-with-text p-md-4">
              <div className="img-border-sm mb-4">
                <a href="#" className="popup-vimeo image-play">
                  <img src="/theme/images/img_2.jpg" alt="" className="img-fluid" loading="lazy" decoding="async" />
                </a>
              </div>
              <h2 className="heading mb-0"><a href="#">Lorem Ipsum Dolor Sit Amet</a></h2>
              <span className="mb-3 d-block post-date">Dec 20th, 2018 &bull; By <a href="#">Admin</a></span>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio dolores culpa qui aliquam placeat nobis veritatis tempora natus rerum obcaecati.</p>
            </div>

            <div className="media-with-text p-md-4">
              <div className="img-border-sm mb-4">
                <a href="#" className="popup-vimeo image-play">
                  <img src="/theme/images/img_3.jpg" alt="" className="img-fluid" loading="lazy" decoding="async" />
                </a>
              </div>
              <h2 className="heading mb-0"><a href="#">Lorem Ipsum Dolor Sit Amet</a></h2>
              <span className="mb-3 d-block post-date">Dec 20th, 2018 &bull; By <a href="#">Admin</a></span>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio dolores culpa qui aliquam placeat nobis veritatis tempora natus rerum obcaecati.</p>
            </div>

            <div className="media-with-text p-md-4">
              <div className="img-border-sm mb-4">
                <a href="#" className="popup-vimeo image-play">
                  <img src="/theme/images/img_1.jpg" alt="" className="img-fluid" loading="lazy" decoding="async" />
                </a>
              </div>
              <h2 className="heading mb-0"><a href="#">Lorem Ipsum Dolor Sit Amet</a></h2>
              <span className="mb-3 d-block post-date">Dec 20th, 2018 &bull; By <a href="#">Admin</a></span>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio dolores culpa qui aliquam placeat nobis veritatis tempora natus rerum obcaecati.</p>
            </div>

            <div className="media-with-text p-md-4">
              <div className="img-border-sm mb-4">
                <a href="#" className="popup-vimeo image-play">
                  <img src="/theme/images/img_2.jpg" alt="" className="img-fluid" loading="lazy" decoding="async" />
                </a>
              </div>
              <h2 className="heading mb-0"><a href="#">Lorem Ipsum Dolor Sit Amet</a></h2>
              <span className="mb-3 d-block post-date">Dec 20th, 2018 &bull; By <a href="#">Admin</a></span>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio dolores culpa qui aliquam placeat nobis veritatis tempora natus rerum obcaecati.</p>
            </div>

            <div className="media-with-text p-md-4">
              <div className="img-border-sm mb-4">
                <a href="#" className="popup-vimeo image-play">
                  <img src="/theme/images/img_3.jpg" alt="" className="img-fluid" loading="lazy" decoding="async" />
                </a>
              </div>
              <h2 className="heading mb-0"><a href="#">Lorem Ipsum Dolor Sit Amet</a></h2>
              <span className="mb-3 d-block post-date">Dec 20th, 2018 &bull; By <a href="#">Admin</a></span>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio dolores culpa qui aliquam placeat nobis veritatis tempora natus rerum obcaecati.</p>
            </div>

            <div className="media-with-text p-md-4">
              <div className="img-border-sm mb-4">
                <a href="#" className="popup-vimeo image-play">
                  <img src="/theme/images/img_1.jpg" alt="" className="img-fluid" loading="lazy" decoding="async" />
                </a>
              </div>
              <h2 className="heading mb-0"><a href="#">Lorem Ipsum Dolor Sit Amet</a></h2>
              <span className="mb-3 d-block post-date">Dec 20th, 2018 &bull; By <a href="#">Admin</a></span>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio dolores culpa qui aliquam placeat nobis veritatis tempora natus rerum obcaecati.</p>
            </div>

            <div className="media-with-text p-md-4">
              <div className="img-border-sm mb-4">
                <a href="#" className="popup-vimeo image-play">
                  <img src="/theme/images/img_2.jpg" alt="" className="img-fluid" loading="lazy" decoding="async" />
                </a>
              </div>
              <h2 className="heading mb-0"><a href="#">Lorem Ipsum Dolor Sit Amet</a></h2>
              <span className="mb-3 d-block post-date">Dec 20th, 2018 &bull; By <a href="#">Admin</a></span>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio dolores culpa qui aliquam placeat nobis veritatis tempora natus rerum obcaecati.</p>
            </div>

            <div className="media-with-text p-md-4">
              <div className="img-border-sm mb-4">
                <a href="#" className="popup-vimeo image-play">
                  <img src="/theme/images/img_3.jpg" alt="" className="img-fluid" loading="lazy" decoding="async" />
                </a>
              </div>
              <h2 className="heading mb-0"><a href="#">Lorem Ipsum Dolor Sit Amet</a></h2>
              <span className="mb-3 d-block post-date">Dec 20th, 2018 &bull; By <a href="#">Admin</a></span>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio dolores culpa qui aliquam placeat nobis veritatis tempora natus rerum obcaecati.</p>
            </div>
          </OwlCarousel>
        </div>
      </div>

      {/*
        PLACEHOLDER SECTION — testimonials below are template filler with
        invented names/quotes. Replace with real guest reviews, or delete this
        whole section, before going live.
      */}
      <div className="site-section block-14 bg-light">
        <div className="container">
          <div className="row">
            <div className="col-md-6 mx-auto text-center mb-5 section-heading">
              <h2>What People Say</h2>
            </div>
          </div>

          <OwlCarousel className="nonloop-block-14 owl-carousel" options={TESTIMONIALS_OPTIONS}>
            <div className="p-4">
              <div className="d-flex block-testimony">
                <div className="person mr-3">
                  <img src="/theme/images/person_1.jpg" alt="Image" className="img-fluid rounded" loading="lazy" decoding="async" />
                </div>
                <div>
                  <h2 className="h5">Katie Johnson</h2>
                  <blockquote>&ldquo;Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias accusantium qui optio, possimus necessitatibus voluptate aliquam velit nostrum tempora ipsam!&rdquo;</blockquote>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="d-flex block-testimony">
                <div className="person mr-3">
                  <img src="/theme/images/person_2.jpg" alt="Image" className="img-fluid rounded" loading="lazy" decoding="async" />
                </div>
                <div>
                  <h2 className="h5">Jane Mars</h2>
                  <blockquote>&ldquo;Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias accusantium qui optio, possimus necessitatibus voluptate aliquam velit nostrum tempora ipsam!&rdquo;</blockquote>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="d-flex block-testimony">
                <div className="person mr-3">
                  <img src="/theme/images/person_3.jpg" alt="Image" className="img-fluid rounded" loading="lazy" decoding="async" />
                </div>
                <div>
                  <h2 className="h5">Shane Holmes</h2>
                  <blockquote>&ldquo;Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias accusantium qui optio, possimus necessitatibus voluptate aliquam velit nostrum tempora ipsam!&rdquo;</blockquote>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="d-flex block-testimony">
                <div className="person mr-3">
                  <img src="/theme/images/person_4.jpg" alt="Image" className="img-fluid rounded" loading="lazy" decoding="async" />
                </div>
                <div>
                  <h2 className="h5">Mark Johnson</h2>
                  <blockquote>&ldquo;Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias accusantium qui optio, possimus necessitatibus voluptate aliquam velit nostrum tempora ipsam!&rdquo;</blockquote>
                </div>
              </div>
            </div>
          </OwlCarousel>
        </div>
      </div>
    </div>
  );
}
