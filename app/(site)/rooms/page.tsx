import type { Metadata } from 'next';
import Link from 'next/link';
import { Poppins } from 'next/font/google';
import { PageHero } from '@/components/site/blocks';
import { getRooms, getSection } from '@/lib/content/queries';
import RoomTiles from './room-tiles';
import RoomsBrowser from './rooms-browser';
import { toRoomCard } from './rooms-data';

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
// Two layouts, picked in Admin > Pages > Rooms > Layout:
//   tiles - <RoomTiles />, full-bleed photo tiles (the default)
//   list  - <RoomsBrowser />, Roberto's room list with the price/guests search
//           sidebar (a client component, since the search filters the list)
// Both link each room to its own page at /rooms/<slug>.
//
// This page stays a server component: it owns the hero, the Roberto CSS, the
// CTA, none of which need interactivity.
export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getSection('rooms.hero')).title };
}

export default async function Rooms() {
  const [hero, display, filter, cta, rooms] = await Promise.all([
    getSection('rooms.hero'),
    getSection('rooms.display'),
    getSection('rooms.filter'),
    getSection('rooms.cta'),
    getRooms(),
  ]);

  return (
    <>
      {/* Site hero - kept outside the Roberto scope */}
      <PageHero data={hero} />

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

        /* Intro line above either layout, and the gap the full-bleed tiles
           need before the CTA (the list layout brings its own spacing). */
        .roberto-scope .rooms-intro { max-width:44rem; margin:0 auto; padding:70px 15px 50px; text-align:center; }
        .roberto-scope .rooms-intro p { font-size:18px; line-height:1.7; }
        .roberto-scope .rooms-tiles-area { margin-bottom:100px; }
      `}</style>

      {display.intro && (
        <div className="rooms-intro">
          <p>{display.intro}</p>
        </div>
      )}

      {display.layout === 'list' ? (
        <div className={`roberto-rooms-area ${display.intro ? '' : 'section-padding-100-0'}`}>
          <div className="container">
            <RoomsBrowser
              rooms={rooms.map(toRoomCard)}
              note={filter.note}
              emptyTitle={filter.emptyTitle}
              emptyText={filter.emptyText}
            />
          </div>
        </div>
      ) : (
        <div className="rooms-tiles-area">
          <RoomTiles rooms={rooms.map(toRoomCard)} />
        </div>
      )}

      {/* Call To Action */}
      <section className="roberto-cta-area">
        <div className="container">
          <div
            className="cta-content bg-img bg-overlay"
            style={{ backgroundImage: cta.image ? `url(${JSON.stringify(cta.image)})` : undefined }}
          >
            <div className="row align-items-center">
              <div className="col-12 col-md-7">
                <div className="cta-text mb-50">
                  <h2>{cta.title}</h2>
                  {cta.text && <h6>{cta.text}</h6>}
                </div>
              </div>
              <div className="col-12 col-md-5 text-right">
                {cta.buttonLabel && (
                  <Link href={cta.buttonHref || '/contact'} className="btn roberto-btn mb-50">{cta.buttonLabel}</Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      </div>
    </>
  );
}
