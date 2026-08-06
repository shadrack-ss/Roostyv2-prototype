import Link from 'next/link';
import type { Metadata } from 'next';
import { Raleway } from 'next/font/google';

// Same face the homepage About Us and Delicious Food blocks use. The theme only
// declares font-family on `body` (Work Sans) and nothing targets these headings
// directly, so setting it on the copy wrapper is enough -- no !important needed
// here, unlike on the homepage where .raleway-page forces it on every heading.
const raleway = Raleway({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-raleway',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Our Services - Roosty's Homes, Mbarara",
  description:
    "Cottages and apartments, a restaurant and bar, gardens for weddings and functions, a kids' play area and secure parking at Roosty's Homes in Ruharo Nkokonjeru, Mbarara City.",
};

// The services the previous roostyshomes.com build actually advertised, kept to
// what that site documented: the four room types, the Restaurant and Bar, the
// gardens (outdoor functions, meetings, birthdays) and the kids' play area.
// Nothing here is invented -- where the old site gave no detail (menus, event
// pricing, capacities) this page says nothing rather than guessing.
//
// `flip` puts the photo on the right instead of the left. Done as a flag rather
// than by reordering the JSX because the mobile layout must always lead with
// the copy, which is what source order already gives; see the CSS below.
const SERVICES = [
  {
    id: 'stay',
    eyebrow: 'Stay',
    title: 'Cottages & Apartments',
    img: 'AT8A2449.jpg.jpg',
    alt: 'Bedroom in a deluxe cottage with a nightstand and reading lamp',
    body: [
      'Four self-contained room types across the property, from a one-bedroom unit up to a family suite that sleeps four. Each one is furnished, serviced and set in its own stretch of garden.',
      'Rates run from UGX 200,000 to UGX 360,000 per night depending on the room.',
    ],
    href: '/rooms',
    cta: 'See All Rooms',
    flip: false,
  },
  {
    id: 'restaurant',
    eyebrow: 'Eat',
    title: 'The Restaurant',
    img: 'restaurant.jpg',
    alt: 'Guests having a meal in the Roosty’s Homes restaurant',
    body: [
      'Our kitchen works from fresh, seasonal ingredients - local favourites alongside international classics, served from a slow weekend brunch through to dinner.',
      'Open to guests staying with us and to visitors dropping in.',
    ],
    flip: true,
  },
  {
    id: 'bar',
    eyebrow: 'Drink',
    title: 'The Bar',
    img: 'AT8A2527.jpg.jpg',
    alt: 'Guests being served at the indoor bar counter',
    body: [
      'Cocktails, beers, wines and fresh juice, poured somewhere you can actually hear each other. Quiet corners for a slow evening, open seating when the room fills up.',
    ],
    flip: false,
  },
  {
    id: 'events',
    eyebrow: 'Celebrate',
    title: 'Gardens & Functions',
    img: 'gardens-1.jpg',
    alt: 'Garden set for an outdoor ceremony with white chairs and hanging lanterns',
    body: [
      'Our gardens are available to hire for weddings, receptions and parties, with room to lay out an aisle, a dance floor and seating without anyone feeling crowded.',
      'The same space works for meetings and workshops, and for birthdays we will set the room up around whatever you have planned.',
    ],
    href: '/contact',
    cta: 'Enquire About Your Event',
    flip: true,
  },
  {
    id: 'family',
    eyebrow: 'Family',
    title: "Kids' Play Area",
    img: 'playground.webp',
    alt: 'Play area with a netted trampoline, climbing frame with slides and a seesaw',
    body: [
      'A fenced play area with a climbing frame and slides, a netted trampoline and a seesaw, set on soft sand and in full view of the gardens - close enough to keep an eye on from a table.',
    ],
    flip: false,
  },
];

// Same icon set the homepage amenities grid uses (the theme's flaticon font).
const AMENITIES = [
  { icon: 'flaticon-pool', label: 'Pool Table' },
  { icon: 'flaticon-desk', label: '24/7 Reservation' },
  { icon: 'flaticon-exit', label: 'Secure Premises' },
  { icon: 'flaticon-parking', label: 'Car Parking' },
  { icon: 'flaticon-hair-dryer', label: 'Room Service' },
  { icon: 'flaticon-minibar', label: 'Bar & Restaurant' },
  { icon: 'flaticon-drink', label: 'Cocktails & Fresh Juice' },
  { icon: 'flaticon-cab', label: 'Online Booking' },
];

export default function Services() {
  return (
    // Wrapper exists only to put --font-raleway in scope for the CSS below.
    <div className={raleway.variable}>
      <div
        className="site-blocks-cover overlay page-hero"
        style={{ backgroundImage: 'url(/roosty-photos/DJI_0002.jpg.jpg)' }}
        data-stellar-background-ratio="0.5"
      >
        {/* Same Ken Burns treatment as the other inner-page heroes — see about/page.tsx for the full explanation. */}
        <style href="page-hero-kenburns" precedence="theme">{`
          .page-hero { position:relative; overflow:hidden; }
          .page-hero.site-blocks-cover.overlay::before { z-index:1; }
          .page-hero::after {
            content:"";
            position:absolute;
            top:0; right:0; bottom:0; left:0;
            z-index:0;
            background-image:inherit;
            background-size:cover;
            background-position:center center;
            background-repeat:no-repeat;
            animation: heroKenBurnsOnce 18s linear both;
          }
          .page-hero > .container { position:relative; z-index:2; }
          @keyframes heroKenBurnsOnce { from { transform:scale(1); } to { transform:scale(1.16); } }
          @media (prefers-reduced-motion: reduce) {
            .page-hero::after { animation:none; }
          }
        `}</style>
        <div className="container">
          <div className="row align-items-center justify-content-center">
            <div className="col-md-7 text-center" data-aos="fade">
              <span className="caption mb-3">What We Offer</span>
              <h1 className="mb-4">Our Services</h1>
            </div>
          </div>
        </div>
      </div>

      <style href="services-page" precedence="theme">{`
        /*
          Type scale below is lifted verbatim from the homepage's About Us
          (.about-intro) and Delicious Food (.montana-food-scope .section_title)
          blocks so all three read as one system: a 14px/400 gold eyebrow with
          15px beneath it, a 46px/56px weight-500 near-black heading, and
          16px/28px body with 30px between paragraphs. The previous values here
          (uppercase tracked eyebrow, 34px heading, 18px gaps) were a different,
          tighter system and looked unrelated to the rest of the site.
        */
        .svc-intro, .svc-copy { font-family:var(--font-raleway),"Raleway",sans-serif; }
        .svc-intro { max-width:44rem; margin:0 auto; text-align:center; }
        .svc-intro p { font-size:16px; line-height:28px; color:#4d4d4d; margin:0; }

        .svc-row { margin-bottom:5rem; }
        .svc-row:last-of-type { margin-bottom:0; }
        /* These photos are a mix of landscape and portrait (gardens-1 is a
           tall shot), so crop them to one ratio -- otherwise each row sets a
           different height and the alternating rhythm falls apart. */
        .svc-media img { width:100%; aspect-ratio:4 / 3; object-fit:cover; display:block; border-radius:4px; }
        /* Sentence case, no tracking -- matching "About Us" and "Delicious
           Food" rather than the uppercase label this used to be. */
        .svc-copy .svc-eyebrow { display:block; font-family:var(--font-raleway),"Raleway",sans-serif; color:#c99e54; font-size:14px; font-weight:400; margin-bottom:15px; }
        .svc-copy h2 { font-family:var(--font-raleway),"Raleway",sans-serif; font-size:46px; line-height:56px; font-weight:500; color:#1f1f1f; margin:0 0 20px; }
        .svc-copy p { font-family:var(--font-raleway),"Raleway",sans-serif; font-size:16px; line-height:28px; color:#4d4d4d; margin:0 0 30px; }

        /* Desktop only: flip the photo to the right for alternate rows. On
           mobile the columns stack and the copy must always come first, which
           is exactly what source order gives -- so this is scoped to >=768px
           and the JSX is never reordered. */
        @media (min-width:768px) {
          .svc-row { display:flex; align-items:center; }
          .svc-row.svc-flip .svc-media { order:2; }
          .svc-row.svc-flip .svc-copy { order:1; }
          .svc-copy { padding-left:2.5rem; }
          .svc-row.svc-flip .svc-copy { padding-left:0; padding-right:2.5rem; }
        }
        /* Both heading step-downs are the same values, at the same
           breakpoints, that .about-intro and .montana-food-scope use. */
        @media (max-width:767.98px) {
          .svc-row { margin-bottom:3rem; }
          .svc-media { margin-bottom:1.75rem; }
          .svc-copy h2 { font-size:30px; line-height:36px; }
        }
        @media (min-width:768px) and (max-width:991.98px) {
          .svc-copy h2 { font-size:36px; line-height:42px; }
        }

        /* Closing CTA band. .upcoming-events has no stylesheet rule anywhere in
           the project -- it is only a hook -- so everything this band needs is
           declared here:

           1. background-size:cover. Without it the background falls back to its
              natural size and a 1920px-wide photo simply repeats across the
              band, which is the seam you can see on the untreated version.
           2. A scrim. The band draws no overlay of its own, so white text sits
              directly on the photo. The homepage uses background.jpg, which has
              the brand-green wash baked into the file; this aerial is a bright,
              high-key daylight shot with pale roofs and sand, and white type is
              genuinely unreadable over it untreated. Same ::before-at-z-index:-1
              approach the video_area block on the homepage already uses. */
        .svc-cta { position:relative; z-index:0; background-size:cover; background-position:center center; }
        .svc-cta::before { content:""; position:absolute; top:0; right:0; bottom:0; left:0; z-index:-1; background-color:rgba(10,34,22,.62); }
      `}</style>

      <div className="site-section">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="svc-intro mb-5">
                <p>
                  Roosty&apos;s Homes is more than a place to sleep. Alongside the cottages and
                  apartments you will find a restaurant and bar, gardens built for celebrations,
                  a play area for the children and parking behind a secure gate - all on one
                  property in Ruharo Nkokonjeru, Mbarara City.
                </p>
              </div>
            </div>
          </div>

          {SERVICES.map((svc) => (
            <div className={`row svc-row${svc.flip ? ' svc-flip' : ''}`} key={svc.id} id={svc.id}>
              <div className="col-md-6 svc-media">
                <img
                  src={`/roosty-photos/${svc.img}`}
                  alt={svc.alt}
                  className="img-fluid"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="col-md-6 svc-copy">
                <span className="svc-eyebrow">{svc.eyebrow}</span>
                <h2>{svc.title}</h2>
                {svc.body.map((para) => (
                  <p key={para.slice(0, 32)}>{para}</p>
                ))}
                {svc.href && (
                  <Link href={svc.href} className="btn btn-primary pill text-white px-4">
                    {svc.cta}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="site-section bg-light">
        <div className="container">
          <div className="row">
            <div className="col-md-6 mx-auto text-center mb-5 section-heading">
              <h2 className="mb-5">On The Property</h2>
            </div>
          </div>
          <div className="row">
            {AMENITIES.map((item) => (
              <div className="col-sm-6 col-md-4 col-lg-3" key={item.label}>
                <div className="text-center p-4 item">
                  <span className={`${item.icon} display-3 mb-3 d-block text-primary`}></span>
                  <h2 className="h5">{item.label}</h2>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className="py-5 upcoming-events svc-cta"
        style={{ backgroundImage: "url('/roosty-photos/DJI_0021.jpg.jpg')", backgroundAttachment: 'fixed' }}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h2 className="text-white">Ready When You Are</h2>
              <Link href="/book" className="text-white btn btn-outline-warning rounded-0 text-uppercase">
                Book Your Stay
              </Link>
            </div>
            <div className="col-md-6">
              <span className="caption">Rooms, tables and gardens</span>
              <h3 className="text-white">Call +256 707 113630</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
