import Link from 'next/link';

export default function About() {
  return (
    <>
      <div
        className="site-blocks-cover overlay page-hero"
        style={{ backgroundImage: 'url(/theme/images/hero_1.jpg)' }}
        data-stellar-background-ratio="0.5"
      >
        {/*
          Same Ken Burns treatment as the homepage slider hero: the photo
          slowly zooms on a ::after layer (so the heading stays perfectly
          sharp) at the same 18s/linear pace, layered explicitly (photo 0,
          dark tint 1, text 2) since pseudo-elements otherwise paint above
          real children regardless of source order.
        */}
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
              <span className="caption mb-3">Roosty&apos;s Homes, Perfect Service</span>
              <h1 className="mb-4">About Us</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="site-section">
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
              <div className="section-heading text-left">
                <h2 className="mb-5">About Roosty&apos;s Homes</h2>
              </div>
              <p className="mb-4">
                Roosty&apos;s Homes offers a welcoming restaurant and bar serving delicious meals
                and refreshing drinks, paired with comfortable accommodation. Enjoy a relaxing stay
                with great hospitality, serene surroundings, quality service, and spaces perfect for
                dining, leisure, family time, and peaceful rest.
              </p>
              <p className="mb-4">
                Roosty&apos;s Homes ensures guest safety with secure premises, controlled access,
                attentive staff, and well-maintained facilities, offering a peaceful, protected
                environment.
              </p>
              <p>
                <a href="https://vimeo.com/28959265" className="popup-vimeo text-uppercase">
                  Watch Video <span className="icon-arrow-right small"></span>
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/*
        PLACEHOLDER SECTION — no real staff data was provided. Names, photos and
        bios below are template filler; replace with the real Roosty's Homes team
        (or delete this whole section) when the details are available.
      */}
      <div className="site-section bg-light">
        <div className="container">
          <div className="row">
            <div className="col-md-6 mx-auto text-center mb-5 section-heading">
              <h2 className="mb-5">Our Team</h2>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 col-lg-4 mb-5">
              <div className="hotel-room text-center">
                <a href="#" className="d-block mb-4 thumbnail">
                  <img src="/theme/images/person_1.jpg" alt="Image" className="img-fluid" loading="lazy" decoding="async" />
                </a>
                <div className="p-4">
                  <h3 className="heading mb-3"><a href="#">Angella Lopez</a></h3>
                  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta labore recusandae soluta quis.</p>
                  <p><a href="#" className="text-primary">Read More <span className="icon-arrow-right small"></span></a></p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4 mb-5">
              <div className="hotel-room text-center">
                <a href="#" className="d-block mb-4 thumbnail">
                  <img src="/theme/images/person_2.jpg" alt="Image" className="img-fluid" loading="lazy" decoding="async" />
                </a>
                <div className="p-4">
                  <h3 className="heading mb-3"><a href="#">Marina Stalks</a></h3>
                  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta labore recusandae soluta quis.</p>
                  <p><a href="#" className="text-primary">Read More <span className="icon-arrow-right small"></span></a></p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4 mb-5">
              <div className="hotel-room text-center">
                <a href="#" className="d-block mb-4 thumbnail">
                  <img src="/theme/images/person_3.jpg" alt="Image" className="img-fluid" loading="lazy" decoding="async" />
                </a>
                <div className="p-4">
                  <h3 className="heading mb-3"><a href="#">Ethan Hoover</a></h3>
                  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta labore recusandae soluta quis.</p>
                  <p><a href="#" className="text-primary">Read More <span className="icon-arrow-right small"></span></a></p>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-4 mb-5">
              <div className="hotel-room text-center">
                <a href="#" className="d-block mb-4 thumbnail">
                  <img src="/theme/images/person_4.jpg" alt="Image" className="img-fluid" loading="lazy" decoding="async" />
                </a>
                <div className="p-4">
                  <h3 className="heading mb-3"><a href="#">Megan Pearson</a></h3>
                  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta labore recusandae soluta quis.</p>
                  <p><a href="#" className="text-primary">Read More <span className="icon-arrow-right small"></span></a></p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4 mb-5">
              <div className="hotel-room text-center">
                <a href="#" className="d-block mb-4 thumbnail">
                  <img src="/theme/images/person_1.jpg" alt="Image" className="img-fluid" loading="lazy" decoding="async" />
                </a>
                <div className="p-4">
                  <h3 className="heading mb-3"><a href="#">Cristine Smith</a></h3>
                  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta labore recusandae soluta quis.</p>
                  <p><a href="#" className="text-primary">Read More <span className="icon-arrow-right small"></span></a></p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4 mb-5">
              <div className="hotel-room text-center">
                <a href="#" className="d-block mb-4 thumbnail">
                  <img src="/theme/images/person_2.jpg" alt="Image" className="img-fluid" loading="lazy" decoding="async" />
                </a>
                <div className="p-4">
                  <h3 className="heading mb-3"><a href="#">Marina Stalks</a></h3>
                  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta labore recusandae soluta quis.</p>
                  <p><a href="#" className="text-primary">Read More <span className="icon-arrow-right small"></span></a></p>
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

      <div className="site-section border-top">
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
    </>
  );
}
