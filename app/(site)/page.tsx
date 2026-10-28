import Link from 'next/link';
import { Lora, Jost } from 'next/font/google';
import { AmenitiesGrid, EventsBand, GalleryGrid, SectionHeading } from '@/components/site/blocks';
import { Lines, Paragraphs, initialsOf, videoPopupClass } from '@/components/site/text';
import {
  getAmenities,
  getGallery,
  getHeroSlides,
  getPosts,
  getRooms,
  getSection,
  getTestimonials,
} from '@/lib/content/queries';
import { formatUGX } from '@/lib/money';
import OwlCarousel from './owl-carousel';
import HeroSlider from './hero-slider';

// Raleway, the site's text face, and Plus Jakarta Sans (the hero headline and
// the header wordmark) are both loaded in app/(site)/layout.tsx and are in
// scope on every page.

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


// The hero is <HeroSlider /> (./hero-slider.tsx). Owl still drives the Latest
// Updates and testimonials carousels further down.

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

const POST_DATE = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

export default async function Home() {
  const [
    hero,
    about,
    roomsSection,
    amenitiesSection,
    video,
    food,
    eventsBand,
    gallerySection,
    updates,
    testimonialsSection,
    slides,
    rooms,
    amenities,
    gallery,
    posts,
    testimonials,
  ] = await Promise.all([
    getSection('home.hero'),
    getSection('home.about'),
    getSection('home.rooms'),
    getSection('home.amenities'),
    getSection('home.video'),
    getSection('home.food'),
    getSection('shared.eventsBand'),
    getSection('home.gallery'),
    getSection('home.updates'),
    getSection('home.testimonials'),
    getHeroSlides(),
    getRooms(),
    getAmenities(),
    getGallery(),
    getPosts(),
    getTestimonials(),
  ]);
  const featuredRooms = rooms.filter((room) => room.featured);
  const highlights = hero.highlights.split(/\r?\n/).map((h) => h.trim()).filter(Boolean);

  return (
    <div className={`${lora.variable} ${jost.variable}`}>
      {/*
        HERO - ported wholesale from an earlier Tailwind build. That
        design is Tailwind-based and this project is not, so every utility
        class has been rewritten as plain CSS below; the structure, colours,
        type scale, spacing and animation are otherwise identical.

        The slides, their per-slide text and the fly-in entrance are in
        <HeroSlider /> (./hero-slider.tsx); the layout and type styles for
        its .rh-hero-* elements stay here. The site's top contact bar and
        navbar (in app/(site)/layout.tsx) float over this section.

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
        /* The slide arrows sit 2rem from the bottom and are 52px tall, so
           their top edge is 84px up. 5.5rem (88px) keeps the text as low as
           it can go while still clearing them at every width. */
        @media (min-width: 768px) { .rh-hero-inner { padding-bottom: 5.5rem; } }
        /* h1: Plus Jakarta Sans 800, matching the header wordmark.

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
          font-size: 2.25rem;
          line-height: 1.25;
          /* The text-shadow stays even at this weight: the slideshow runs a
             bright living-room frame where the white would otherwise flatten
             into the wall behind it. */
          font-weight: 800;
          color: #ffffff;
          text-shadow: 0 2px 18px rgba(0, 0, 0, 0.5);
        }
        /* The slide's line under the headline, in the site's Raleway. */
        .rh-hero-text {
          max-width: 34rem;
          margin: -0.5rem 0 1.75rem;
          font-size: 1.125rem;
          font-weight: 400;
          line-height: 1.55;
          color: #ffffff;
          text-shadow: 0 1px 8px rgba(0, 0, 0, 0.55);
        }
        @media (min-width: 640px) { .rh-hero-text { font-size: 1.25rem; } }
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
        /* Smaller than the original 3.25rem / 4.25rem, so the headline
           covers less of the photo now a label and a line sit with it. */
        @media (min-width: 640px) { .rh-hero h1 { font-size: 2.75rem; } }
        @media (min-width: 1024px) { .rh-hero h1 { font-size: 3.5rem; } }
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
      <HeroSlider
        slides={slides.map((s) => ({
          imageUrl: s.imageUrl,
          alt: s.alt,
          heading: s.heading,
          text: s.text,
          buttonLabel: s.buttonLabel,
          buttonHref: s.buttonHref,
        }))}
        fallback={{
          headline: hero.headline,
          primaryLabel: hero.primaryLabel,
          primaryHref: hero.primaryHref,
          secondaryLabel: hero.secondaryLabel,
          secondaryHref: hero.secondaryHref,
        }}
        highlights={highlights}
      />

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
                {about.videoUrl ? (
                  <a href={about.videoUrl} className={`${videoPopupClass(about.videoUrl)} image-play`}>
                    <span className="icon-wrap">
                      <span className="icon icon-play"></span>
                    </span>
                    <img src={about.image} alt="" className="img-fluid" fetchPriority="high" decoding="sync" />
                  </a>
                ) : (
                  about.image && <img src={about.image} alt="" className="img-fluid" fetchPriority="high" decoding="sync" />
                )}
              </div>

              {about.overlayImage && (
                <img src={about.overlayImage} alt="" className="img-fluid image-absolute" fetchPriority="high" decoding="sync" />
              )}
            </div>
            <div className="col-md-5 ml-auto about-copy">
              {/*
                Montana's about_info text structure: small eyebrow label, a
                large two-line headline, then body copy. The eyebrow uses this
                site's gold rather than Montana's blue.
              */}
              <div className="about-intro">
                {about.eyebrow && <span className="about-eyebrow">{about.eyebrow}</span>}
                <h2 className="about-title">
                  <Lines text={about.title} />
                </h2>
                <Paragraphs text={about.body} />
                {about.linkLabel && (
                  <p>
                    <Link href={about.linkHref || '/about'} className="text-uppercase">
                      {about.linkLabel} <span className="icon-arrow-right small"></span>
                    </Link>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {featuredRooms.length > 0 && (
        <div className="site-section bg-light">
          <div className="container">
            <SectionHeading>{roomsSection.heading}</SectionHeading>
            <div className="row">
              {featuredRooms.map((room) => (
                <div className="col-md-6 col-lg-3 mb-5" key={room.id}>
                  <div className="hotel-room text-center">
                    <Link href={`/rooms/${room.slug}`} className="d-block mb-0 thumbnail">
                      <img src={room.imageUrl} alt={room.name} className="img-fluid" loading="lazy" decoding="async" />
                    </Link>
                    <div className="hotel-room-body">
                      <h3 className="heading mb-0"><Link href={`/rooms/${room.slug}`}>{room.name}</Link></h3>
                      <strong className="price">{formatUGX(room.price)} / per night</strong>
                      <span className="d-block text-muted small mt-2">
                        {room.capacity} Guests{room.size && <> &middot; {room.size}</>}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {roomsSection.buttonLabel && (
              <div className="row">
                <div className="col-md-12 text-center">
                  <Link href="/rooms" className="btn btn-primary pill text-white px-4">
                    {roomsSection.buttonLabel}
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <AmenitiesGrid heading={amenitiesSection.heading} items={amenities} />

      {/*
        Port of the Montana template's video_area: a full-bleed background
        photo with a dark overlay, a centered eyebrow/heading, and a play
        button that reuses the site's own magnific-popup wiring.
      */}
      <div
        className="video_area overlay text-center"
        style={{ backgroundImage: video.image ? `url(${JSON.stringify(video.image)})` : undefined }}
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
          {video.eyebrow && <span>{video.eyebrow}</span>}
          <h3>
            <Lines text={video.title} />
          </h3>
          {video.videoUrl && (
            <a href={video.videoUrl} className={`video_btn ${videoPopupClass(video.videoUrl)}`} aria-label="Play video"></a>
          )}
        </div>
      </div>

      {/*
        Port of the Montana template's second about_area (two stacked food
        photos on the left, eyebrow/heading/copy on the right - the mirror
        image of the earlier About section). Its own padding-top:200px is
        what creates the gap after the video banner.
      */}
      <div className="montana-food-scope">
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
                  {food.image1 && (
                    <div className="img_1">
                      <img src={food.image1} alt="" className="img-fluid" width={284} height={400} loading="lazy" decoding="async" />
                    </div>
                  )}
                  {food.image2 && (
                    <div className="img_2">
                      <img src={food.image2} alt="" className="img-fluid" width={294} height={400} loading="lazy" decoding="async" />
                    </div>
                  )}
                </div>
              </div>
              <div className="col-xl-5 col-lg-5">
                <div className="about_info">
                  <div className="section_title mb-20px">
                    {food.eyebrow && <span>{food.eyebrow}</span>}
                    <h3>
                      <Lines text={food.title} />
                    </h3>
                  </div>
                  <Paragraphs text={food.body} />
                  {food.linkLabel && (
                    <p>
                      <Link href={food.linkHref || '/services'} className="text-uppercase">
                        {food.linkLabel} <span className="icon-arrow-right small"></span>
                      </Link>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EventsBand data={eventsBand} />

      <GalleryGrid heading={gallerySection.heading} images={gallery} />

      {posts.length > 0 && (
        <div className="site-section block-15">
          <div className="container">
            <div className="row">
              <div className="col-md-6 mx-auto text-center mb-5 section-heading">
                <h2>{updates.heading}</h2>
              </div>
            </div>

            <OwlCarousel className="nonloop-block-15 owl-carousel" options={EVENTS_OPTIONS}>
              {posts.slice(0, 9).map((post) => (
                <div className="media-with-text p-md-5" key={post.id}>
                  {post.imageUrl && (
                    <div className="img-border-sm mb-4">
                      <Link href="/events">
                        <img src={post.imageUrl} alt="" className="img-fluid" loading="lazy" decoding="async" />
                      </Link>
                    </div>
                  )}
                  <h2 className="heading mb-0"><Link href="/events">{post.title}</Link></h2>
                  <span className="mb-3 d-block post-date">
                    {POST_DATE.format(post.date)}
                    {post.author && <> &bull; By {post.author}</>}
                  </span>
                  <p>{post.excerpt}</p>
                </div>
              ))}
            </OwlCarousel>
          </div>
        </div>
      )}

      {testimonials.length > 0 && (
        <div className="site-section block-14 bg-light">
          <style href="testimony-initials" precedence="theme">{`
            .testimony-initials { display:flex; align-items:center; justify-content:center; width:80px; height:80px; border-radius:.25rem; background:#13482c; color:#c99e54; font-weight:700; font-size:22px; }
            .block-testimony .testimony-detail { display:block; font-size:13px; color:#8a919c; margin:-4px 0 8px; }
          `}</style>
          <div className="container">
            <div className="row">
              <div className="col-md-6 mx-auto text-center mb-5 section-heading">
                <h2>{testimonialsSection.heading}</h2>
              </div>
            </div>

            <OwlCarousel className="nonloop-block-14 owl-carousel" options={TESTIMONIALS_OPTIONS}>
              {testimonials.map((t) => (
                <div className="p-4" key={t.id}>
                  <div className="d-flex block-testimony">
                    <div className="person mr-3">
                      {t.photoUrl ? (
                        <img src={t.photoUrl} alt={t.name} className="img-fluid rounded" loading="lazy" decoding="async" />
                      ) : (
                        <span className="testimony-initials" aria-hidden="true">{initialsOf(t.name)}</span>
                      )}
                    </div>
                    <div>
                      <h2 className="h5">{t.name}</h2>
                      {t.detail && <span className="testimony-detail">{t.detail}</span>}
                      <blockquote>&ldquo;{t.quote}&rdquo;</blockquote>
                    </div>
                  </div>
                </div>
              ))}
            </OwlCarousel>
          </div>
        </div>
      )}
    </div>
  );
}
