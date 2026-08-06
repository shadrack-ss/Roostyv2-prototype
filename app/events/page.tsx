// PLACEHOLDER PAGE — the post cards below are template filler (Lorem Ipsum,
// sample dates/authors). Replace with real Roosty's Homes news, events, or blog
// posts when available. Roosty's gardens are also available for weddings,
// parties and functions — this page could showcase those instead.
export default function Events() {
  return (
    <>
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
              <span className="caption mb-3">Roosty&apos;s Homes</span>
              <h1 className="mb-4">Events &amp; Updates</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="site-section">
        <div className="container">
          <div className="row">
            <div className="col-md-6 col-lg-4 mb-5">
              <div className="media-with-text">
                <div className="img-border-sm mb-4">
                  <a href="#" className="popup-vimeo image-play">
                    <img src="/theme/images/img_1.jpg" alt="" className="img-fluid" fetchPriority="high" decoding="sync" />
                  </a>
                </div>
                <h2 className="heading mb-0"><a href="#">Lorem Ipsum Dolor Sit Amet</a></h2>
                <span className="mb-3 d-block post-date">Dec 20th, 2018 &bull; By <a href="#">Admin</a></span>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio dolores culpa qui aliquam placeat nobis veritatis tempora natus rerum obcaecati.</p>
              </div>
            </div>
            <div className="col-md-6 col-lg-4 mb-5">
              <div className="media-with-text">
                <div className="img-border-sm mb-4">
                  <a href="#" className="popup-vimeo image-play">
                    <img src="/theme/images/img_2.jpg" alt="" className="img-fluid" fetchPriority="high" decoding="sync" />
                  </a>
                </div>
                <h2 className="heading mb-0"><a href="#">Lorem Ipsum Dolor Sit Amet</a></h2>
                <span className="mb-3 d-block post-date">Dec 20th, 2018 &bull; By <a href="#">Admin</a></span>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio dolores culpa qui aliquam placeat nobis veritatis tempora natus rerum obcaecati.</p>
              </div>
            </div>
            <div className="col-md-6 col-lg-4 mb-5">
              <div className="media-with-text">
                <div className="img-border-sm mb-4">
                  <a href="#" className="popup-vimeo image-play">
                    <img src="/theme/images/img_3.jpg" alt="" className="img-fluid" loading="lazy" decoding="async" />
                  </a>
                </div>
                <h2 className="heading mb-0"><a href="#">Lorem Ipsum Dolor Sit Amet</a></h2>
                <span className="mb-3 d-block post-date">Dec 20th, 2018 &bull; By <a href="#">Admin</a></span>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio dolores culpa qui aliquam placeat nobis veritatis tempora natus rerum obcaecati.</p>
              </div>
            </div>

            <div className="col-md-6 col-lg-4 mb-5">
              <div className="media-with-text">
                <div className="img-border-sm mb-4">
                  <a href="#" className="popup-vimeo image-play">
                    <img src="/theme/images/img_4.jpg" alt="" className="img-fluid" loading="lazy" decoding="async" />
                  </a>
                </div>
                <h2 className="heading mb-0"><a href="#">Lorem Ipsum Dolor Sit Amet</a></h2>
                <span className="mb-3 d-block post-date">Dec 20th, 2018 &bull; By <a href="#">Admin</a></span>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio dolores culpa qui aliquam placeat nobis veritatis tempora natus rerum obcaecati.</p>
              </div>
            </div>
            <div className="col-md-6 col-lg-4 mb-5">
              <div className="media-with-text">
                <div className="img-border-sm mb-4">
                  <a href="#" className="popup-vimeo image-play">
                    <img src="/theme/images/img_5.jpg" alt="" className="img-fluid" loading="lazy" decoding="async" />
                  </a>
                </div>
                <h2 className="heading mb-0"><a href="#">Lorem Ipsum Dolor Sit Amet</a></h2>
                <span className="mb-3 d-block post-date">Dec 20th, 2018 &bull; By <a href="#">Admin</a></span>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio dolores culpa qui aliquam placeat nobis veritatis tempora natus rerum obcaecati.</p>
              </div>
            </div>
            <div className="col-md-6 col-lg-4 mb-5">
              <div className="media-with-text">
                <div className="img-border-sm mb-4">
                  <a href="#" className="popup-vimeo image-play">
                    <img src="/theme/images/img_6.jpg" alt="" className="img-fluid" loading="lazy" decoding="async" />
                  </a>
                </div>
                <h2 className="heading mb-0"><a href="#">Lorem Ipsum Dolor Sit Amet</a></h2>
                <span className="mb-3 d-block post-date">Dec 20th, 2018 &bull; By <a href="#">Admin</a></span>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio dolores culpa qui aliquam placeat nobis veritatis tempora natus rerum obcaecati.</p>
              </div>
            </div>
          </div>

          <div className="row mt-5">
            <div className="col-md-12 text-center">
              <div className="site-block-27">
                <ul>
                  <li><a href="#">&lt;</a></li>
                  <li className="active"><span>1</span></li>
                  <li><a href="#">2</a></li>
                  <li><a href="#">3</a></li>
                  <li><a href="#">4</a></li>
                  <li><a href="#">5</a></li>
                  <li><a href="#">&gt;</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
