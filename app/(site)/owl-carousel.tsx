'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef } from 'react';
import { themeReady } from './theme-ready';

// Wraps a jQuery Owl Carousel so it plays nicely with React's lifecycle.
//
// Owl rewrites the DOM inside its container (wrapping slides in .owl-stage,
// cloning them for looping, etc.). React must never see those mutations, or it
// throws "removeChild" errors when it later unmounts the page. So on unmount we
// trigger Owl's own destroy first, which unwraps everything back to the exact
// markup React rendered — then React can remove the container cleanly. React
// only ever manages the outer <div> and the original slides passed as children;
// it never re-renders them after mount (the pages are static), so Owl is free to
// own the inner DOM in between.
export default function OwlCarousel({
  className,
  options,
  children,
}: {
  className: string;
  options: Record<string, unknown>;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    let $el: any;

    themeReady.then(() => {
      if (cancelled || !ref.current) return;
      const $ = (window as any).jQuery;
      if (!$ || !$.fn.owlCarousel) return;
      $el = $(ref.current);
      $el.owlCarousel(options);
    });

    return () => {
      cancelled = true;
      if ($el) {
        try {
          $el.trigger('destroy.owl.carousel');
        } catch {
          /* already gone */
        }
      }
    };
    // Options are static per call site; intentionally init once per mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={className} ref={ref}>
      {children}
    </div>
  );
}
