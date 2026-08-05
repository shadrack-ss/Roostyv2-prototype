import Link from 'next/link';
import { Poppins } from 'next/font/google';
import DatepickerInit from '../datepicker-init';

// Roberto uses Poppins.
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

// Exact port of Roberto's room.html rooms area (breadcrumb, room list,
// reservation sidebar, CTA, partners) with Roberto's own demo content. All of
// Roberto's CSS is scoped under `.roberto-scope` so it cannot restyle the site's
// shared (Suites) header/footer that wrap this page.
//
// NOTE: the reservation form and price slider are visual only (not wired to any
// booking backend) — hook them up when ready.
export default function Rooms() {
  return (
    <>
      {/* Site (Suites) hero — kept as-is, outside the Roberto scope */}
      <div
        className="site-blocks-cover overlay page-hero"
        style={{ backgroundImage: 'url(/theme/images/hero_1.jpg)' }}
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
        .roberto-scope .single-room-area .room-thumbnail img { border-radius:4px; width:100%; }
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

        /* Price slider (jquery-ui markup, static) */
        .roberto-scope .slider-range-price { position:relative; height:5px; background-color:#e8f1f8; border:1px solid #e8f1f8; }
        .roberto-scope .slider-range-price .ui-slider-range { position:absolute; height:5px; background:#13482c; border:1px solid #e8f1f8; }
        .roberto-scope .slider-range-price .ui-slider-handle { position:absolute; top:-7px; width:18px; height:18px; border-radius:50%; border:1px solid #13482c; background:#13482c; margin-left:-9px; outline:none; cursor:pointer; }

        /* Pagination */
        .roberto-scope .pagination { position:relative; z-index:1; display:flex; flex-wrap:wrap; padding-left:0; list-style:none; }
        .roberto-scope .pagination .page-link { padding:12px 15px; color:#2a303b; border:none; background-color:#e8f1f8; margin-right:5px; border-radius:3px; display:block; }
        .roberto-scope .pagination .page-link:hover, .roberto-scope .pagination .page-link:focus { background-color:#f23a2e; color:#fff; }

        /* CTA */
        .roberto-scope .roberto-cta-area { position:relative; z-index:1; }
        .roberto-scope .roberto-cta-area .cta-content { padding:50px 50px 0; }
        .roberto-scope .roberto-cta-area .cta-text h2 { color:#fff; font-size:36px; margin-bottom:10px; }
        .roberto-scope .roberto-cta-area .cta-text h6 { margin-bottom:0; color:#fff; font-size:16px; font-weight:400; }
        .roberto-scope .text-right { text-align:right; }

        /* Partners */
        .roberto-scope .partner-logo-content { position:relative; z-index:1; padding-top:40px; padding-bottom:40px; }
        .roberto-scope .partner-logo-content a { display:inline-block; }
        .roberto-scope .partner-logo-content a img { max-height:50px; width:auto; }
      `}</style>

      <DatepickerInit />

      {/* Rooms Area */}
      <div className="roberto-rooms-area section-padding-100-0">
        <div className="container">
          <div className="row">
            <div className="col-12 col-lg-8">
              {[
                { img: '43.jpg', name: 'Room View Sea' },
                { img: '44.jpg', name: 'Small Room' },
                { img: '45.jpg', name: 'Premium King Room' },
                { img: '46.jpg', name: 'Room Vip King' },
                { img: '47.jpg', name: 'Royal Room' },
              ].map((room) => (
                <div className="single-room-area mb-50" key={room.name}>
                  <div className="room-thumbnail">
                    <img src={`/roberto/img/${room.img}`} alt={room.name} loading="lazy" decoding="async" />
                  </div>
                  <div className="room-content">
                    <h2>{room.name}</h2>
                    <h4>400$ <span>/ Day</span></h4>
                    <div className="room-feature">
                      <h6>Size: <span>30 ft</span></h6>
                      <h6>Capacity: <span>Max persion 5</span></h6>
                      <h6>Bed: <span>King beds</span></h6>
                      <h6>Services: <span>Wifi, television ...</span></h6>
                    </div>
                    <a href="#" className="btn view-detail-btn">View Details <i className="fa fa-long-arrow-right" aria-hidden="true"></i></a>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              <nav className="roberto-pagination mb-100">
                <ul className="pagination">
                  <li className="page-item"><a className="page-link" href="#">1</a></li>
                  <li className="page-item"><a className="page-link" href="#">2</a></li>
                  <li className="page-item"><a className="page-link" href="#">3</a></li>
                  <li className="page-item"><a className="page-link" href="#">Next <i className="fa fa-angle-right"></i></a></li>
                </ul>
              </nav>
            </div>

            <div className="col-12 col-lg-4">
              {/* Hotel Reservation — visual only, not wired */}
              <div className="hotel-reservation--area mb-100">
                <form>
                  <div className="form-group mb-30">
                    <label htmlFor="checkInDate">Date</label>
                    <div className="input-daterange" id="datepicker">
                      <div className="row no-gutters">
                        <div className="col-6">
                          <input type="text" className="input-small form-control" id="checkInDate" name="checkInDate" placeholder="Check In" autoComplete="off" />
                        </div>
                        <div className="col-6">
                          <input type="text" className="input-small form-control" name="checkOutDate" placeholder="Check Out" autoComplete="off" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="form-group mb-30">
                    <label htmlFor="guests">Guests</label>
                    <div className="row">
                      <div className="col-6">
                        <select name="adults" id="guests" className="form-control" defaultValue="adults">
                          <option value="adults">Adults</option>
                          <option value="01">01</option><option value="02">02</option>
                          <option value="03">03</option><option value="04">04</option>
                          <option value="05">05</option><option value="06">06</option>
                        </select>
                      </div>
                      <div className="col-6">
                        <select name="children" id="children" className="form-control" defaultValue="children">
                          <option value="children">Children</option>
                          <option value="01">01</option><option value="02">02</option>
                          <option value="03">03</option><option value="04">04</option>
                          <option value="05">05</option><option value="06">06</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="form-group mb-50">
                    <div className="slider-range">
                      <div className="range-price">Max Price: $0 - $3000</div>
                      <div className="slider-range-price">
                        <div className="ui-slider-range" style={{ left: '0%', width: '100%' }}></div>
                        <span className="ui-slider-handle" style={{ left: '0%' }} tabIndex={0}></span>
                        <span className="ui-slider-handle" style={{ left: '100%' }} tabIndex={0}></span>
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <button type="button" className="btn roberto-btn w-100">Check Available</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
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

      {/* Partners */}
      <div className="partner-area">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="partner-logo-content d-flex align-items-center justify-content-between">
                {['p1.png', 'p2.png', 'p3.png', 'p4.png', 'p5.png'].map((p) => (
                  <a href="#" className="partner-logo" key={p}>
                    <img src={`/roberto/img/${p}`} alt="" loading="lazy" decoding="async" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
