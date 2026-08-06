import Link from 'next/link';
import { Poppins } from 'next/font/google';
import RoomsBrowser from './rooms-browser';

// Roberto uses Poppins.
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

// Port of Roberto's room.html rooms area (breadcrumb, room list, reservation
// sidebar, CTA). All of Roberto's CSS is scoped under
// `.roberto-scope` so it cannot restyle the site's shared (Suites)
// header/footer that wrap this page.
//
// The room list and the reservation sidebar are both real now and live together
// in <RoomsBrowser /> (a client component) -- they have to share state, since
// pressing Check Available filters the list. Room data is in ./rooms-data.
//
// This page stays a server component: it owns the hero, the Roberto CSS, the
// CTA, none of which need interactivity.
export default function Rooms() {
  return (
    <>
      {/* Site (Suites) hero — kept as-is, outside the Roberto scope */}
      <div
        className="site-blocks-cover overlay page-hero"
        style={{ backgroundImage: 'url(/roosty-photos/DJI_0002.jpg.jpg)' }}
        data-stellar-background-ratio="0.5"
      >
        {/* Same Ken Burns treatment as the homepage slider hero — see about/page.tsx for the full explanation. */}
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
              <span className="caption mb-3">Comfortable Stays</span>
              <h1 className="mb-4">Rooms &amp; Cottages</h1>
            </div>
          </div>
        </div>
      </div>

      <div className={`roberto-scope ${poppins.variable}`}>
      <style>{`
        @font-face { font-family:'RobertoFA'; src:url(/roberto/fonts/fontawesome-webfont.woff2) format('woff2'), url(/roberto/fonts/fontawesome-webfont.woff) format('woff'); font-weight:normal; font-style:normal; font-display:swap; }

        .roberto-scope { font-family:var(--font-poppins),"Poppins",sans-serif; font-weight:400; font-size:16px; color:#636a76; }
        .roberto-scope h1,.roberto-scope h2,.roberto-scope h3,.roberto-scope h4,.roberto-scope h5,.roberto-scope h6 { font-family:var(--font-poppins),"Poppins",sans-serif; color:#2a303b; line-height:1.3; font-weight:500; margin:0; }
        .roberto-scope p { line-height:1.7; color:#636a76; font-size:16px; font-weight:400; margin:0; }
        .roberto-scope a { color:#2a303b; text-decoration:none; transition-duration:500ms; }
        .roberto-scope img { max-width:100%; height:auto; }
        .roberto-scope .fa { display:inline-block; font:normal normal normal 14px/1 'RobertoFA'; font-size:inherit; text-rendering:auto; }
        .roberto-scope .fa-long-arrow-right:before { content:'\\f178'; }
        .roberto-scope .fa-angle-right:before { content:'\\f105'; }

        /* Suites' Bootstrap build purged the bare .col-6 class that Roberto's
           Date/Guests rows use, so re-define it here (scoped). Only .col-6 —
           NOT .col-12 — because a scoped .col-12 would out-specify .col-lg-8 /
           .col-lg-4 and collapse the rooms/sidebar row. The global
           .no-gutters > [class*=col-] rule still zeroes padding for the Date
           row so its two inputs sit flush, exactly like Roberto. */
        .roberto-scope .col-6 { position:relative; width:100%; padding-right:15px; padding-left:15px; -ms-flex:0 0 50%; flex:0 0 50%; max-width:50%; }
        /* Date row uses .no-gutters in Roberto so the two inputs sit flush; our
           scoped .col-6 padding would otherwise re-introduce a gap. */
        .roberto-scope .no-gutters > .col-6 { padding-right:0; padding-left:0; }

        .roberto-scope .mb-30 { margin-bottom:30px; }
        .roberto-scope .mb-50 { margin-bottom:50px; }
        .roberto-scope .mb-100 { margin-bottom:100px; }
        .roberto-scope .section-padding-100-0 { padding-top:100px; padding-bottom:0; }
        .roberto-scope .section-padding-80-0 { padding-top:80px; padding-bottom:0; }

        .roberto-scope .bg-img { background-position:center center!important; background-size:cover!important; background-repeat:no-repeat!important; }
        .roberto-scope .bg-overlay { position:relative; z-index:1; }
        .roberto-scope .bg-overlay::after { position:absolute; content:""; height:100%; width:100%; top:0; left:0; z-index:-1; background-color:rgba(14,39,55,.7); }

        /* Breadcrumb */
        .roberto-scope .breadcrumb-area { position:relative; z-index:1; height:300px; }
        .roberto-scope .h-100 { height:100%; }
        .roberto-scope .breadcrumb-area .page-title { color:#fff; font-size:48px; }
        .roberto-scope .breadcrumb-content { position:relative; z-index:1; }
        .roberto-scope .breadcrumb-content .breadcrumb { display:flex; flex-wrap:wrap; padding:0; margin-bottom:0; background-color:transparent; list-style:none; }
        .roberto-scope .breadcrumb-content .breadcrumb .breadcrumb-item { color:#fff; }
        .roberto-scope .breadcrumb-content .breadcrumb .breadcrumb-item a { color:#fff; }
        .roberto-scope .breadcrumb-content .breadcrumb .breadcrumb-item a:hover { color:#f23a2e; }
        .roberto-scope .breadcrumb-content .breadcrumb .breadcrumb-item + .breadcrumb-item { padding-left:.5rem; }
        .roberto-scope .breadcrumb-content .breadcrumb .breadcrumb-item + .breadcrumb-item::before { content:'\\f105'; font-family:'RobertoFA'; color:#fff; padding-right:.5rem; }

        /* Room list */
        .roberto-scope .single-room-area { position:relative; z-index:1; display:flex; align-items:center; }
        .roberto-scope .single-room-area .room-thumbnail { position:relative; z-index:1; flex:0 0 50%; max-width:50%; width:50%; }
        /* Roberto's demo shots were all one size; the real room photos are not
           (3:2 alongside 4:3), and at width:100%/height:auto that leaves each
           card a different height. Crop to a single ratio instead. */
        .roberto-scope .single-room-area .room-thumbnail img { border-radius:4px; width:100%; aspect-ratio:3 / 2; object-fit:cover; display:block; }
        .roberto-scope .single-room-area .room-content { position:relative; z-index:1; padding-left:35px; }
        .roberto-scope .single-room-area .room-content h2 { font-size:30px; display:block; margin-bottom:5px; }
        .roberto-scope .single-room-area .room-content h4 { color:#f23a2e; margin-bottom:20px; font-size:24px; }
        .roberto-scope .single-room-area .room-content h4 span { color:#afb4bf; font-size:14px; }
        .roberto-scope .single-room-area .room-content .room-feature { display:flex; flex-wrap:wrap; position:relative; z-index:1; margin-bottom:20px; }
        .roberto-scope .single-room-area .room-content .room-feature h6 { flex:0 0 50%; max-width:50%; width:50%; font-weight:400; color:#afb4bf; margin-bottom:10px; font-size:16px; }
        .roberto-scope .single-room-area .room-content .room-feature h6 span { color:#2a303b; display:block; }
        .roberto-scope .single-room-area .room-content .view-detail-btn { padding:0; font-size:16px; color:#f23a2e; font-weight:500; display:inline-block; }
        .roberto-scope .single-room-area .room-content .view-detail-btn:hover { color:#000; }
        @media (max-width:767px){
          .roberto-scope .single-room-area { flex-wrap:wrap; }
          .roberto-scope .single-room-area .room-thumbnail { flex:0 0 100%; max-width:100%; width:100%; margin-bottom:30px; }
          .roberto-scope .single-room-area .room-content { flex:0 0 100%; max-width:100%; width:100%; padding-left:0; }
          .roberto-scope .single-room-area .room-content h2 { font-size:24px; }
        }

        /* Buttons */
        .roberto-scope .roberto-btn { position:relative; z-index:1; min-width:150px; height:46px; line-height:46px; font-size:16px; font-weight:500; display:inline-block; padding:0 40px; text-align:center; text-transform:capitalize; background-color:#f23a2e; color:#fff; border:none; border-radius:2px; cursor:pointer; transition-duration:500ms; }
        .roberto-scope .roberto-btn:hover, .roberto-scope .roberto-btn:focus { box-shadow:0 2px 40px 8px rgba(15,15,15,.15); background-color:#fff; color:#f23a2e; }

        /* Reservation widget */
        .roberto-scope .hotel-reservation--area { position:relative; z-index:1; }
        .roberto-scope .hotel-reservation--area label, .roberto-scope .hotel-reservation--area .range-price { font-size:18px; display:block; margin-bottom:15px; color:#2a303b; }
        .roberto-scope .hotel-reservation--area .form-control { width:100%; height:50px; text-align:left!important; font-size:14px; padding:0 20px; border:1px solid #ebebeb; border-radius:0!important; background:#fff; color:#636a76; }
        .roberto-scope .hotel-reservation--area .form-control:focus { outline:none; border-bottom-color:#f23a2e; }
        .roberto-scope .hotel-reservation--area button { border-radius:30px!important; }

        /* The jquery-ui price-slider rules that used to sit here are gone: the
           slider is a real dual-range control now and carries its own CSS in
           rooms-browser.tsx. The .pagination rules went with them -- Roberto's
           demo pager was dropped when the list became four real rooms. */

        /* CTA */
        .roberto-scope .roberto-cta-area { position:relative; z-index:1; }
        .roberto-scope .roberto-cta-area .cta-content { padding:50px 50px 0; }
        .roberto-scope .roberto-cta-area .cta-text h2 { color:#fff; font-size:36px; margin-bottom:10px; }
        .roberto-scope .roberto-cta-area .cta-text h6 { margin-bottom:0; color:#fff; font-size:16px; font-weight:400; }
        .roberto-scope .text-right { text-align:right; }
      `}</style>

      {/* Rooms Area */}
      <div className="roberto-rooms-area section-padding-100-0">
        <div className="container">
          <RoomsBrowser />
        </div>
      </div>

      {/* Call To Action */}
      <section className="roberto-cta-area">
        <div className="container">
          <div
            className="cta-content bg-img bg-overlay"
            style={{ backgroundImage: 'url(/roberto/img/1.jpg)' }}
          >
            <div className="row align-items-center">
              <div className="col-12 col-md-7">
                <div className="cta-text mb-50">
                  <h2>Contact us now!</h2>
                  <h6>Contact +256 707 113630 to book directly or for advice</h6>
                </div>
              </div>
              <div className="col-12 col-md-5 text-right">
                <Link href="/contact" className="btn roberto-btn mb-50">Contact Now</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roberto's partner-logo strip used to sit here. It was five invented
          demo brands from the template, linked to "#" -- nothing to do with
          Roosty's Homes -- so it is gone rather than left as fake credentials. */}
      </div>
    </>
  );
}
