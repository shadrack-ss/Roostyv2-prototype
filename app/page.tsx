import Link from 'next/link';
import { Raleway } from 'next/font/google';
import OwlCarousel from './owl-carousel';

// Montana's own font (trying it out on the two Montana-derived sections
// below, in place of the rest of the site's Playfair Display/Work Sans, to
// see how it looks before committing).
const raleway = Raleway({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-raleway',
  display: 'swap',
});

// Owl Carousel configs, copied verbatim from the theme's main.js so the
// carousels behave identically to the original template.
const HERO_OPTIONS = {
  center: false,
  items: 1,
  loop: true,
  stagePadding: 0,
  margin: 0,
  autoplay: true,
  pauseOnHover: false,
  animateOut: 'fadeOut',
  animateIn: 'fadeIn',
  nav: true,
  navText: ['<span class="icon-arrow_back">', '<span class="icon-arrow_forward">'],
};

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

export default function Home() {
  return (
    <div className={`raleway-page ${raleway.variable}`}>
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
        owl-carousel's own CSS sets display:none on .owl-carousel until its JS
        adds the .owl-loaded class, so this hero collapses to zero height and
        the section below jumps up until the carousel initializes — unlike the
        other pages' hero, which is a plain .site-blocks-cover with no such
        gate. This shows the first slide (at its normal full size) immediately
        and hides the other two until owl-carousel takes over, so there's no
        gap for it to fill in later.
      */}
      <style>{`
        .home-slider.owl-carousel:not(.owl-loaded) { display: block; }
        .home-slider.owl-carousel:not(.owl-loaded) > .site-blocks-cover ~ .site-blocks-cover { display: none; }

        /*
          Slow "Ken Burns" zoom on each slide as it becomes active.

          The photo is scaled on a ::after layer rather than on the slide
          itself, so only the image moves and the heading stays perfectly
          still and sharp. background-image:inherit picks up whichever photo
          that slide set inline, so there is no second copy to maintain (and
          it is the same URL, so no extra download).

          Layering is set explicitly because none of these create a stacking
          context on their own: ::after (photo) sits at 0, the theme's
          existing ::before dark tint at 1, and the caption at 2.
          overflow:hidden keeps the scaled photo from spilling out of the
          slide and re-introducing horizontal scroll.
        */
        .home-slider .site-blocks-cover { position: relative; overflow: hidden; }
        .home-slider .site-blocks-cover::after {
          content: "";
          position: absolute;
          top: 0; right: 0; bottom: 0; left: 0;
          z-index: 0;
          background-image: inherit;
          background-size: cover;
          background-position: center center;
          background-repeat: no-repeat;
          transform: scale(1);
          will-change: transform;
        }
        /*
          Brand-green wash over the hero photos. The theme paints a flat
          rgba(0,0,0,.4) here; this swaps that for the same dark green as
          the top contact bar (#13482c). Because that green is itself dark,
          it tints and darkens in one pass, so the white headings keep the
          contrast the black overlay was providing. Scoped to .home-slider
          so the other pages' headers keep the neutral dark overlay.
        */
        .home-slider .site-blocks-cover.overlay::before {
          z-index: 1;
          background: rgba(19, 72, 44, 0.55);
        }
        .home-slider .site-blocks-cover > .container { position: relative; z-index: 2; }

        /* Owl marks the visible slide .active, so the animation restarts on
           every change. The :not(.owl-loaded) rule covers the very first
           slide, which is painted before Owl has wrapped it in an .owl-item. */
        .home-slider .owl-item.active .site-blocks-cover::after,
        .home-slider.owl-carousel:not(.owl-loaded) > .site-blocks-cover:first-child::after {
          animation: heroKenBurns 6s ease-out both;
        }

        @keyframes heroKenBurns {
          from { transform: scale(1); }
          to   { transform: scale(1.12); }
        }

        @media (prefers-reduced-motion: reduce) {
          .home-slider .owl-item.active .site-blocks-cover::after,
          .home-slider.owl-carousel:not(.owl-loaded) > .site-blocks-cover:first-child::after {
            animation: none;
          }
        }
      `}</style>
      <OwlCarousel className="slide-one-item home-slider owl-carousel" options={HERO_OPTIONS}>
        <div
          className="site-blocks-cover overlay"
          style={{ backgroundImage: 'url(/roosty-photos/hero/property-overview.jpg)' }}
          data-stellar-background-ratio="0.5"
        >
          <div className="container">
            <div className="row align-items-center justify-content-center">
              <div className="col-md-7 text-center" data-aos="fade">
                <h1 className="mb-2">Discover Comfort</h1>
                <h2 className="caption">Welcome to Roosty&apos;s Homes</h2>
              </div>
            </div>
          </div>
        </div>

        <div
          className="site-blocks-cover overlay"
          style={{ backgroundImage: 'url(/roosty-photos/hero/restaurant-interior.jpg)' }}
          data-stellar-background-ratio="0.5"
        >
          <div className="container">
            <div className="row align-items-center justify-content-center">
              <div className="col-md-7 text-center" data-aos="fade">
                <h1 className="mb-2">Great Food &amp; Drinks</h1>
                <h2 className="caption">Bar &bull; Restaurant &bull; Gardens</h2>
              </div>
            </div>
          </div>
        </div>

        <div
          className="site-blocks-cover overlay"
          style={{ backgroundImage: 'url(/roosty-photos/hero/cottages.jpg)' }}
          data-stellar-background-ratio="0.5"
        >
          <div className="container">
            <div className="row align-items-center justify-content-center">
              <div className="col-md-7 text-center" data-aos="fade">
                <h1 className="mb-2">Peaceful Stays</h1>
                <h2 className="caption">Cottages &amp; Apartments</h2>
              </div>
            </div>
          </div>
        </div>
      </OwlCarousel>

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
          }
          @media (min-width:768px) and (max-width:991px) {
            .about-intro .about-title { font-size:36px; line-height:42px; }
          }
        `}</style>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 mb-5 mb-md-0">
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
            <div className="col-md-5 ml-auto">
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
                  <img src="/theme/images/img_3.jpg" alt="One Bedroom Occupancy" className="img-fluid" loading="lazy" decoding="async" />
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
                  <img src="/theme/images/img_1.jpg" alt="Deluxe Cottage" className="img-fluid" loading="lazy" decoding="async" />
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
                  <img src="/theme/images/img_2.jpg" alt="Two Bedroom Occupancy" className="img-fluid" loading="lazy" decoding="async" />
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
                  <img src="/theme/images/img_4.jpg" alt="Family Suite" className="img-fluid" loading="lazy" decoding="async" />
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
        style={{ backgroundImage: "url('/theme/images/hero_1.jpg')", backgroundAttachment: 'fixed' }}
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
          <div className="row no-gutters">
            <div className="col-md-6 col-lg-3">
              <a href="/theme/images/img_1.jpg" className="image-popup img-opacity">
                <img src="/theme/images/img_1.jpg" alt="Image" className="img-fluid" loading="lazy" decoding="async" />
              </a>
            </div>
            <div className="col-md-6 col-lg-3">
              <a href="/theme/images/img_2.jpg" className="image-popup img-opacity">
                <img src="/theme/images/img_2.jpg" alt="Image" className="img-fluid" loading="lazy" decoding="async" />
              </a>
            </div>
            <div className="col-md-6 col-lg-3">
              <a href="/theme/images/img_3.jpg" className="image-popup img-opacity">
                <img src="/theme/images/img_3.jpg" alt="Image" className="img-fluid" loading="lazy" decoding="async" />
              </a>
            </div>
            <div className="col-md-6 col-lg-3">
              <a href="/theme/images/img_4.jpg" className="image-popup img-opacity">
                <img src="/theme/images/img_4.jpg" alt="Image" className="img-fluid" loading="lazy" decoding="async" />
              </a>
            </div>

            <div className="col-md-6 col-lg-3">
              <a href="/theme/images/img_4.jpg" className="image-popup img-opacity">
                <img src="/theme/images/img_4.jpg" alt="Image" className="img-fluid" loading="lazy" decoding="async" />
              </a>
            </div>
            <div className="col-md-6 col-lg-3">
              <a href="/theme/images/img_5.jpg" className="image-popup img-opacity">
                <img src="/theme/images/img_5.jpg" alt="Image" className="img-fluid" loading="lazy" decoding="async" />
              </a>
            </div>
            <div className="col-md-6 col-lg-3">
              <a href="/theme/images/img_6.jpg" className="image-popup img-opacity">
                <img src="/theme/images/img_6.jpg" alt="Image" className="img-fluid" loading="lazy" decoding="async" />
              </a>
            </div>
            <div className="col-md-6 col-lg-3">
              <a href="/theme/images/img_7.jpg" className="image-popup img-opacity">
                <img src="/theme/images/img_7.jpg" alt="Image" className="img-fluid" loading="lazy" decoding="async" />
              </a>
            </div>
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
