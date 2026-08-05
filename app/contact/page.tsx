export default function Contact() {
  return (
    <>
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
              <span className="caption mb-3">Chat With Us</span>
              <h1 className="mb-4">Get In Touch</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="site-section site-section-sm">
        <div className="container">
          <div className="row">
            <div className="col-md-12 col-lg-8 mb-5">
              <form action="#" className="p-5 bg-white">
                <div className="row form-group">
                  <div className="col-md-12 mb-3 mb-md-0">
                    <label className="font-weight-bold" htmlFor="fullname">Full Name</label>
                    <input type="text" id="fullname" className="form-control" placeholder="Full Name" />
                  </div>
                </div>
                <div className="row form-group">
                  <div className="col-md-12">
                    <label className="font-weight-bold" htmlFor="email">Email</label>
                    <input type="email" id="email" className="form-control" placeholder="Email Address" />
                  </div>
                </div>

                <div className="row form-group">
                  <div className="col-md-12 mb-3 mb-md-0">
                    <label className="font-weight-bold" htmlFor="phone">Phone</label>
                    <input type="text" id="phone" className="form-control" placeholder="Phone #" />
                  </div>
                </div>

                <div className="row form-group">
                  <div className="col-md-12">
                    <label className="font-weight-bold" htmlFor="message">Message</label>
                    <textarea name="message" id="message" cols={30} rows={5} className="form-control" placeholder="Say hello to us"></textarea>
                  </div>
                </div>

                <div className="row form-group">
                  <div className="col-md-12">
                    <input type="submit" value="Send Message" className="btn btn-primary pill px-4 py-2" />
                  </div>
                </div>
              </form>
            </div>

            <div className="col-lg-4">
              <div className="p-4 mb-3 bg-white">
                <h3 className="h5 text-black mb-3">Contact Info</h3>
                <p className="mb-0 font-weight-bold">Address</p>
                <p className="mb-4">Ruharo Nkokonjeru, Mbarara City, Uganda</p>

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
