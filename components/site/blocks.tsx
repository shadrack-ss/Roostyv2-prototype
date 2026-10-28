import Link from "next/link";
import type { Amenity, GalleryImage } from "@/generated/prisma/client";
import type { SectionData } from "@/lib/content/sections";

/**
 * Public-site blocks used on more than one page. Each takes its copy from a
 * page section and its items from a collection, so the markup lives in one
 * place however many pages show it.
 */

/** The photo banner at the top of every inner page, with a slow one-off zoom. */
export function PageHero({ data }: { data: { eyebrow: string; title: string; image: string } }) {
  return (
    <div
      className="site-blocks-cover overlay page-hero"
      style={{ backgroundImage: data.image ? `url(${JSON.stringify(data.image)})` : undefined }}
      data-stellar-background-ratio="0.5"
    >
      {/*
        The photo zooms on a ::after layer so the heading stays perfectly
        sharp, layered explicitly (photo 0, dark tint 1, text 2) since
        pseudo-elements otherwise paint above real children regardless of
        source order.
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
            {data.eyebrow && <span className="caption mb-3">{data.eyebrow}</span>}
            <h1 className="mb-4">{data.title}</h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="row">
      <div className="col-md-6 mx-auto text-center mb-5 section-heading">
        <h2 className="mb-5">{children}</h2>
      </div>
    </div>
  );
}

export function AmenitiesGrid({ heading, items, className = "" }: { heading: string; items: Amenity[]; className?: string }) {
  if (items.length === 0) return null;
  return (
    <div className={`site-section ${className}`}>
      <div className="container">
        <SectionHeading>{heading}</SectionHeading>
        <div className="row">
          {items.map((item) => (
            <div className="col-sm-6 col-md-4 col-lg-3" key={item.id}>
              <div className="text-center p-4 item">
                <span className={`${item.icon} display-3 mb-3 d-block text-primary`}></span>
                <h2 className="h5">{item.label}</h2>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function GalleryGrid({ heading, images, className = "" }: { heading: string; images: GalleryImage[]; className?: string }) {
  if (images.length === 0) return null;
  return (
    <div className={`site-section ${className}`}>
      <div className="container">
        <SectionHeading>{heading}</SectionHeading>
        <style href="gallery-tile" precedence="theme">{`
          /* Crop every tile to one ratio so the 4-across grid stays even
             whatever the photo's native orientation. The anchor carries the
             box because .image-popup is what the lightbox binds to. */
          .gallery-tile { display:block; aspect-ratio:4 / 3; overflow:hidden; }
          .gallery-tile img { width:100%; height:100%; object-fit:cover; display:block; }
        `}</style>
        <div className="row no-gutters">
          {images.map((photo) => (
            <div className="col-md-6 col-lg-3" key={photo.id}>
              <a href={photo.imageUrl} className="image-popup img-opacity gallery-tile">
                <img src={photo.imageUrl} alt={photo.alt} className="img-fluid" loading="lazy" decoding="async" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** The "Host your event with us" strip on Home and About. */
export function EventsBand({ data }: { data: SectionData<"shared.eventsBand"> }) {
  return (
    <div
      className="py-5 upcoming-events"
      style={{
        backgroundImage: data.image ? `url(${JSON.stringify(data.image)})` : undefined,
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        backgroundPosition: "center center",
      }}
    >
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6">
            <h2 className="text-white">{data.title}</h2>
            {data.buttonLabel && (
              <Link href={data.buttonHref || "/contact"} className="text-white btn btn-outline-warning rounded-0 text-uppercase">
                {data.buttonLabel}
              </Link>
            )}
          </div>
          <div className="col-md-6">
            {data.caption && <span className="caption">{data.caption}</span>}
            <h3 className="text-white">{data.subtitle}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
