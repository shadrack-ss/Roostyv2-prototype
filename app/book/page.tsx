import BookingForm from './booking-form';

export default function Book() {
  return (
    <>
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
              <span className="caption mb-3">Reserve Your Stay</span>
              <h1 className="mb-4">Book Now</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="site-section site-section-sm">
        <div className="container">
          <div className="row">
            <div className="col-md-12 col-lg-8 mb-5">
              <BookingForm />
            </div>

            <div className="col-lg-4">
              <div className="p-4 mb-3 bg-white">
                <h3 className="h5 text-black mb-3">Prefer to Talk?</h3>
                <p className="mb-4">
                  Call or WhatsApp us directly and we&apos;ll confirm your room on the spot.
                </p>

                <p className="mb-0 font-weight-bold">Phone</p>
                <p className="mb-4">
                  <a href="tel:+256707113630">+256 707 113630</a><br />
                  <a href="tel:+256768640830">+256 768 640830</a>
                </p>

                <p className="mb-0 font-weight-bold">Email Address</p>
                <p className="mb-0">
                  <a href="mailto:info@roostyshomes.com">info@roostyshomes.com</a><br />
                  <a href="mailto:roostyshomes@gmail.com">roostyshomes@gmail.com</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
