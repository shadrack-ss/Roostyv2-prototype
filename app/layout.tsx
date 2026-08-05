import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "./site-nav";
import ThemeRuntime from "./theme-runtime";
import AnalyticsScripts from "./analytics-scripts";

export const metadata: Metadata = {
  title: "Roosty's Homes - Comfort, Great Food & Peaceful Stays in Mbarara",
  description:
    "Roosty's Homes offers cozy cottages, modern apartments, a vibrant bar and restaurant, beautiful gardens and a kids' play area in Ruharo Nkokonjeru, Mbarara City.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="robots" content="noindex, nofollow" />
        {/*
          Hero images are large and download after the hero box is already
          sized, which used to flash a white box until the image arrived. Give
          every hero a dark ocean-toned background so any gap before the image
          reads as an intentional dark hero, not a white splash, and preload the
          first hero image so it paints as early as possible.
        */}
        <style
          href="roosty-hero-bg"
          precedence="theme"
        >{`.site-blocks-cover{background-color:#2c4a57;}`}</style>
        <link rel="preload" as="image" href="/roosty-photos/hero/property-overview.jpg" />
        {/* eslint-disable @next/next/no-css-tags -- vendored theme stylesheets, loaded in original template order */}
        <link
          rel="stylesheet"
          precedence="theme"
          href="/theme/fonts/icomoon/style.css"
        />
        <link
          rel="stylesheet"
          precedence="theme"
          href="/theme/css/bootstrap.min.css"
        />
        <link
          rel="stylesheet"
          precedence="theme"
          href="/theme/css/magnific-popup.css"
        />
        <link
          rel="stylesheet"
          precedence="theme"
          href="/theme/css/jquery-ui.css"
        />
        <link
          rel="stylesheet"
          precedence="theme"
          href="/theme/css/owl.carousel.min.css"
        />
        <link
          rel="stylesheet"
          precedence="theme"
          href="/theme/css/owl.theme.default.min.css"
        />
        <link
          rel="stylesheet"
          precedence="theme"
          href="/theme/css/bootstrap-datepicker.css"
        />
        <link
          rel="stylesheet"
          precedence="theme"
          href="/theme/css/animate.css"
        />
        <link
          rel="stylesheet"
          precedence="theme"
          href="/theme/mediaelement/mediaelementplayer.min.css"
        />
        <link
          rel="stylesheet"
          precedence="theme"
          href="/theme/fonts/flaticon/font/flaticon.css"
        />
        <link rel="stylesheet" precedence="theme" href="/theme/css/aos.css" />
        <link rel="stylesheet" precedence="theme" href="/theme/css/fonts.css" />
        <link rel="stylesheet" precedence="theme" href="/theme/css/style.css" />
        {/* eslint-enable @next/next/no-css-tags */}
        {/*
          Header styling: a green/gold top contact bar plus a STATIC (non-sticky)
          green navbar with gold links — overriding the theme's fixed, transparent
          navbar and its scroll-triggered .scrolled state.
        */}
        <style href="roosty-header" precedence="theme">{`
              /* Header stacks over the hero; both scroll away (non-sticky). */
              .site-wrap { position:relative; }

              /* Top contact bar — black background, bold white text, green WhatsApp button */
              .top-bar { position:absolute; top:0; left:0; width:100%; z-index:40; background:#13482c; }
              .top-bar-inner { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px; padding:4px 0; }
              .top-bar-info { display:flex; flex-wrap:wrap; align-items:center; gap:6px 50px; }
              .top-bar-info a { color:#c99e54; font-size:14px; font-weight:700; display:inline-flex; align-items:center; }
              .top-bar-info a:hover { color:#ffffff; }
              .top-bar-info a { position:relative; }
              .top-bar-info a:not(:last-child)::after { content:''; position:absolute; right:-25px; top:50%; transform:translateY(-50%); width:1px; height:16px; background:rgba(255,255,255,0.28); }
              .top-bar-info a > span { margin-right:8px; font-size:15px; }
              .top-bar-wa { display:inline-flex; align-items:center; gap:8px; background:#2aa845; color:#ffffff; font-weight:700; font-size:13px; text-transform:uppercase; letter-spacing:.04em; padding:9px 22px; border-radius:4px; }
              .top-bar-wa:hover { background:#238a3a; color:#ffffff; }

              /* Navbar: transparent over the hero, absolute so it scrolls away (not sticky) */
              .site-navbar-wrap { position:absolute !important; top:40px; left:0; width:100%; z-index:40; background:transparent !important; padding:16px 0 !important; margin-bottom:0 !important; box-shadow:none !important; }
              /* Belt-and-braces: the bg-white/bg-light classes are gone from
                 the markup, but the theme's own stylesheet also paints these
                 elements, so keep them explicitly transparent. */
              .site-navbar-wrap .site-navbar { background-color:transparent; }

              /* Center the nav in the full width: logo floats left, nav centered. */
              .navbar-flex { position:relative; }
              .navbar-flex .site-logo { position:absolute; left:0; top:50%; transform:translateY(-50%); margin:0; }
              .navbar-flex .site-navigation { flex:1 1 auto; text-align:right; }
              @media (max-width: 991.98px) {
                .navbar-flex .site-logo { position:static; transform:none; }
                .navbar-flex .site-navigation { text-align:right; }
              }
              .site-navbar-wrap .site-navbar .site-logo a { color:#ffffff; }
              .site-navbar-wrap .site-menu-toggle span { color:#c99e54; }
              .site-navbar-wrap .site-navbar .site-navigation .site-menu > li > a { color:#ffffff; font-weight:600; }
              .site-navbar-wrap .site-navbar .site-navigation .site-menu > li > a:hover { color:#c99e54; }
              .site-navbar-wrap .site-navbar .site-navigation .site-menu > li.active > a { color:#ffffff !important; }

              .book-now-btn a { display:inline-block; background:#c99e54; color:#13482c; font-weight:600; padding:8px 22px; border-radius:30px; text-transform:uppercase; letter-spacing:.05em; font-size:12px; white-space:nowrap; transition:all .3s ease; }
              .book-now-btn a:hover { background:#ffffff; color:#13482c; }

              /* The theme's .image-absolute (the photo that overlaps the
                 About section's video thumbnail) is pinned right:-50px /
                 bottom:-50px inside its column. On desktop the column sits
                 in a centered 1140px container, so those 50px fall in the
                 page margin; on mobile the column runs to the screen edge,
                 so they push 50px past the viewport and cause horizontal
                 scrolling. Keep the decorative overlap on desktop, tuck it
                 in below 768px. Global (not page-scoped) because the About
                 page uses this class too. */
              @media (max-width: 767.98px) {
                .image-absolute { right:0; bottom:-30px; }
              }

              /* The block-14/block-15 carousel arrows are pinned 70px
                 outside the carousel (left:-70px / right:-70px). The
                 container is 1140px from 1200px up, so between roughly
                 1200-1290px there is less than 70px of page margin and the
                 arrows push past the viewport, causing horizontal scroll.
                 Tuck them inside until there is room for them outside. */
              @media (min-width: 992px) and (max-width: 1299.98px) {
                .block-14 .owl-nav .owl-prev, .block-15 .owl-nav .owl-prev { left:0; }
                .block-14 .owl-nav .owl-next, .block-15 .owl-nav .owl-next { right:0; }
              }

              /* The nav dropdown is only visibility:hidden (not display:none)
                 so it still takes up layout and counts toward page width.
                 This nav is right-aligned, so a dropdown anchored to its
                 item's left edge spills past the viewport. Anchor it to the
                 right so it opens leftward and stays inside the container. */
              .site-navbar .site-navigation .site-menu .has-children .dropdown { left:auto; right:0; }

              /* --- Responsive header --- */
              /* Nudge the contact info right only on wide screens where there's room. */
              @media (min-width: 1200px) { .top-bar-info { margin-left:90px; } }
              /* On tablet/mobile the desktop nav collapses to a hamburger, so hide
                 the top contact bar and drop the (transparent) navbar to the very
                 top — the fixed 44px offset only makes sense under the one-line
                 top bar shown on large screens. */
              @media (max-width: 991.98px) {
                .top-bar { display:none; }
                .site-navbar-wrap { top:0 !important; padding:12px 0 !important; }
              }
        `}</style>
      </head>
      <body>
        <div className="site-wrap">
          <div className="site-mobile-menu">
            <div className="site-mobile-menu-header">
              <div className="site-mobile-menu-close mt-3">
                <span className="icon-close2 js-menu-toggle"></span>
              </div>
            </div>
            <div className="site-mobile-menu-body"></div>
          </div>

          <div className="top-bar">
            <div className="container">
              <div className="top-bar-inner">
                <div className="top-bar-info">
                  <a
                    href="https://maps.google.com/?q=Ruharo+Nkokonjeru,+Mbarara+City"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="icon-map-marker"></span> Ruharo Nkokonjeru,
                    Mbarara City
                  </a>
                  <a href="mailto:info@roostyshomes.com">
                    <span className="icon-envelope"></span>{" "}
                    info@roostyshomes.com
                  </a>
                  <a href="tel:+256707113630">
                    <span className="icon-phone"></span> +256 707 113630
                  </a>
                </div>
                <div className="book-now-btn">
                  <Link href="/contact">Book Now</Link>
                </div>
              </div>
            </div>
          </div>

          {/*
            No bg-white / bg-light utility classes here: this header is meant
            to sit transparently over the hero. Those utilities set
            background-color with !important, so overriding them in CSS only
            works if our stylesheet happens to come after Bootstrap's -- on a
            cold load it can lose that race and flash/stick as a white bar
            (most visible on mobile, where the dark top contact bar above it
            is hidden). Dropping the classes removes the race entirely.
          */}
          <div className="site-navbar-wrap js-site-navbar">
            <div className="container">
              <div className="site-navbar">
                <div className="py-1">
                  <div className="d-flex align-items-center navbar-flex">
                    <h2 className="mb-0 site-logo">
                      <Link
                        href="/"
                        style={{ display: "inline-flex", alignItems: "center" }}
                      >
                        <img
                          src="/roosty-photos/web-logo-main.jpg.png"
                          alt="Roosty's Homes logo"
                          style={{
                            height: "56px",
                            width: "auto",
                            marginRight: "12px",
                          }}
                        />
                        <span>Roosty&apos;s Homes</span>
                      </Link>
                    </h2>
                    <nav className="site-navigation" role="navigation">
                      <div className="d-inline-block d-lg-none  ml-md-0 mr-auto py-3">
                        <a href="#" className="site-menu-toggle js-menu-toggle">
                          <span className="icon-menu h3"></span>
                        </a>
                      </div>
                      <SiteNav />
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {children}

          <footer className="site-footer">
            {/*
              Brand-green footer (same #13482c as the top contact bar)
              instead of the theme's default dark overlay-on-nothing, which
              just rendered as flat black-ish gray. Four even columns instead
              of the original 4/6(nested 3/3)/2 split — that layout crammed
              Social Icons into a narrow, oddly-aligned column with its own
              redundant col-md-12 wrappers. Link/text colors are brightened
              for contrast against the green (the theme's default
              rgba(255,255,255,0.3) links were designed for the darker
              default background and read as too faint here).
            */}
            <style href="site-footer-brand" precedence="theme">{`
              /* This build's bootstrap.min.css is a purged file that ships no
                 .col-md-3 at all, so all four footer columns below were
                 collapsing to full width and overlapping instead of sitting
                 in a row. Re-declare just that one missing class, scoped to
                 the footer, using Bootstrap 4's own value. */
              .site-footer .col-md-3 { position:relative; width:100%; padding-right:15px; padding-left:15px; }
              /* Fixed-percentage columns (flex:0 0 25%) can't be spread
                 apart with padding/margin — each one still starts exactly at
                 the 25/50/75% marks of the row regardless of its own
                 padding, which is why padding-right on these had no visible
                 effect. justify-content:space-between + auto-width columns
                 actually distributes the real gap. */
              @media (min-width:768px) {
                .site-footer .row { -ms-flex-pack:justify; justify-content:space-between; }
                .site-footer .col-md-3 { -ms-flex:0 0 auto; flex:0 0 auto; width:auto; max-width:none; }
                /* Without a width cap, the About column's paragraph would
                   stretch out to one long line instead of wrapping. */
                .site-footer .footer-col-about { max-width:320px; }
              }
              .site-footer { background-color:#13482c; }
              .site-footer:before { background:transparent; }
              .site-footer p, .site-footer li { color:rgba(255,255,255,.75); }
              .site-footer a { color:rgba(255,255,255,.75); }
              .site-footer a:hover { color:#c99e54; }
              .site-footer .footer-read-more { display:inline-block; background:#c99e54; color:#13482c; font-weight:600; padding:10px 26px; border-radius:30px; text-transform:uppercase; letter-spacing:.04em; font-size:12px; transition:all .3s ease; }
              .site-footer .footer-read-more:hover { background:#ffffff; color:#13482c; }
              .site-footer .footer-social { display:flex; gap:14px; margin:0; padding:0; }
              .site-footer .footer-social a { display:flex; align-items:center; justify-content:center; width:38px; height:38px; border:1px solid rgba(255,255,255,.3); border-radius:50%; padding:0; }
              .site-footer .footer-social a:hover { background:#c99e54; border-color:#c99e54; color:#13482c; }
            `}</style>
            <div className="container">
              <div className="row">
                <div className="col-md-3 footer-col-about mb-4 mb-md-0">
                  <h3 className="footer-heading mb-4 text-white">About</h3>
                  <p>
                    Roosty&apos;s Homes offers cozy cottages, a lively bar and
                    restaurant, beautiful gardens, and a fun, safe kids&apos;
                    playground - where comfort meets great food, refreshing
                    drinks, and peaceful stays.
                  </p>
                  <p>
                    <Link href="/about" className="footer-read-more">
                      Read More
                    </Link>
                  </p>
                </div>
                <div className="col-md-3 footer-col-menu mb-4 mb-md-0">
                  <h3 className="footer-heading mb-4 text-white">
                    Quick Menu
                  </h3>
                  <ul className="list-unstyled">
                    <li>
                      <Link href="/">Home</Link>
                    </li>
                    <li>
                      <Link href="/about">About Us</Link>
                    </li>
                    <li>
                      <Link href="/rooms">Rooms</Link>
                    </li>
                    <li>
                      <Link href="/events">Events</Link>
                    </li>
                    <li>
                      <Link href="/contact">Contact</Link>
                    </li>
                  </ul>
                </div>
                <div className="col-md-3 footer-col-touch mb-4 mb-md-0">
                  <h3 className="footer-heading mb-4 text-white">
                    Get In Touch
                  </h3>
                  <ul className="list-unstyled">
                    <li>Ruharo Nkokonjeru, Mbarara City</li>
                    <li>
                      <a href="tel:+256707113630">+256 707 113630</a>
                    </li>
                    <li>
                      <a href="tel:+256768640830">+256 768 640830</a>
                    </li>
                    <li>
                      <a href="mailto:info@roostyshomes.com">
                        info@roostyshomes.com
                      </a>
                    </li>
                  </ul>
                </div>

                <div className="col-md-3">
                  <h3 className="footer-heading mb-4 text-white">
                    Social Icons
                  </h3>
                  <div className="footer-social">
                    <a href="#" aria-label="Facebook">
                      <span className="icon-facebook"></span>
                    </a>
                    <a href="#" aria-label="Twitter">
                      <span className="icon-twitter"></span>
                    </a>
                    <a href="#" aria-label="Instagram">
                      <span className="icon-instagram"></span>
                    </a>
                    <a href="#" aria-label="Vimeo">
                      <span className="icon-vimeo"></span>
                    </a>
                  </div>
                </div>
              </div>
              <div className="row pt-5 mt-5 text-center">
                <div className="col-md-12">
                  <p>
                    Copyright &copy;{new Date().getFullYear()} Roosty&apos;s
                    Homes. All Rights Reserved
                  </p>
                </div>
              </div>
            </div>
          </footer>
        </div>

        <ThemeRuntime />
        <AnalyticsScripts />
      </body>
    </html>
  );
}
