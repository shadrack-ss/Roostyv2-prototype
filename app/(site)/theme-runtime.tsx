'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { markThemeReady, themeReady } from './theme-ready';

// The theme's jQuery libraries. NOTE: the theme's own main.js is deliberately
// NOT loaded — its logic is reimplemented below, split into "run once" (layout
// behaviors bound to persistent elements) and "run per navigation" (widgets
// that attach to page content, which is swapped on every client-side route
// change). Loading main.js as-is would re-clone the nav and double-bind the
// menu/scroll handlers on every navigation. The owl carousels are handled
// separately by the <OwlCarousel> component so React controls their lifecycle.
const VENDOR_SCRIPTS = [
  '/theme/js/jquery-3.3.1.min.js',
  '/theme/js/jquery-migrate-3.0.1.min.js',
  '/theme/js/jquery-ui.js',
  '/theme/js/popper.min.js',
  '/theme/js/bootstrap.min.js',
  '/theme/js/owl.carousel.min.js',
  '/theme/js/jquery.stellar.min.js',
  '/theme/js/jquery.magnific-popup.min.js',
  '/theme/js/bootstrap-datepicker.min.js',
  '/theme/js/aos.js',
  '/theme/mediaelement/mediaelement-and-player.min.js',
];

export default function ThemeRuntime() {
  // Load the vendor bundle exactly once for the app's lifetime.
  useEffect(() => {
    if ((window as any).__themeLibsLoading) return;
    (window as any).__themeLibsLoading = true;

    const scripts = VENDOR_SCRIPTS.map((src) => {
      const s = document.createElement('script');
      s.src = src;
      s.async = false; // preserve execution order (jQuery before its plugins)
      return s;
    });
    scripts[scripts.length - 1].onload = () => {
      onceInit();
      markThemeReady();
    };
    scripts.forEach((s) => document.body.appendChild(s));
  }, []);

  // Re-run the page-content widgets on every client-side navigation, once the
  // libs are ready. Also covers the first page load.
  const pathname = usePathname();
  useEffect(() => {
    let cancelled = false;
    themeReady.then(() => {
      if (!cancelled) perNavInit();
    });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  return null;
}

// ---- Run once: layout-level behaviors (bound to persistent elements) --------
function onceInit() {
  const $ = (window as any).jQuery;
  const AOS = (window as any).AOS;

  AOS?.init({ duration: 800, easing: 'slide', once: false });

  // Mobile menu: clone the desktop nav into the off-canvas menu body.
  $('.js-clone-nav').each(function (this: any) {
    $(this).clone().attr('class', 'site-nav-wrap').appendTo('.site-mobile-menu-body');
  });

  setTimeout(function () {
    let counter = 0;
    $('.site-mobile-menu .has-children').each(function (this: any) {
      const $this = $(this);
      $this.prepend('<span class="arrow-collapse collapsed">');
      $this.find('.arrow-collapse').attr({
        'data-toggle': 'collapse',
        'data-target': '#collapseItem' + counter,
      });
      $this.find('> ul').attr({ class: 'collapse', id: 'collapseItem' + counter });
      counter++;
    });
  }, 1000);

  $('body').on('click', '.arrow-collapse', function (this: any, e: any) {
    const $this = $(this);
    if ($this.closest('li').find('.collapse').hasClass('show')) {
      $this.removeClass('active');
    } else {
      $this.addClass('active');
    }
    e.preventDefault();
  });

  $(window).resize(function () {
    if ($(window).width() > 768 && $('body').hasClass('offcanvas-menu')) {
      $('body').removeClass('offcanvas-menu');
    }
  });

  $('body').on('click', '.js-menu-toggle', function (this: any, e: any) {
    const $this = $(this);
    e.preventDefault();
    if ($('body').hasClass('offcanvas-menu')) {
      $('body').removeClass('offcanvas-menu');
      $this.removeClass('active');
    } else {
      $('body').addClass('offcanvas-menu');
      $this.addClass('active');
    }
  });

  $(document).mouseup(function (e: any) {
    const container = $('.site-mobile-menu');
    if (!container.is(e.target) && container.has(e.target).length === 0) {
      if ($('body').hasClass('offcanvas-menu')) {
        $('body').removeClass('offcanvas-menu');
      }
    }
  });

  // (The navbar is now static/non-sticky and permanently styled via CSS, so the
  // theme's scroll-triggered ".scrolled" toggle is intentionally not wired up.)

  // Parallax backgrounds (data-stellar-background-ratio).
  $(window).stellar({
    responsive: false,
    parallaxBackgrounds: true,
    parallaxElements: true,
    horizontalScrolling: false,
    hideDistantElements: false,
    scrollProperty: 'scroll',
  });
}

// ---- Run per navigation: widgets attached to (swapped) page content ---------
function perNavInit() {
  const $ = (window as any).jQuery;
  const AOS = (window as any).AOS;

  // Lightbox / video popups.
  $('.image-popup').magnificPopup({
    type: 'image',
    closeOnContentClick: true,
    closeBtnInside: false,
    fixedContentPos: true,
    mainClass: 'mfp-no-margins mfp-with-zoom',
    gallery: { enabled: true, navigateByImgClick: true, preload: [0, 1] },
    image: { verticalFit: true },
    zoom: { enabled: true, duration: 300 },
  });
  $('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
    disableOn: 700,
    type: 'iframe',
    mainClass: 'mfp-fade',
    removalDelay: 160,
    preloader: false,
    fixedContentPos: false,
  });

  // Re-scan animate-on-scroll elements and parallax positions for the new page.
  AOS?.refreshHard();
  try {
    $.stellar('refresh');
  } catch {
    /* stellar not initialized yet */
  }
}
