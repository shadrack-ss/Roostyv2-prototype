import Link from 'next/link';
import type { Metadata } from 'next';
import { AmenitiesGrid, PageHero } from '@/components/site/blocks';
import { Paragraphs } from '@/components/site/text';
import { getAmenities, getSection, getServices } from '@/lib/content/queries';

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getSection('services.hero')).title };
}

// A stable in-page anchor per service, so links like /services#the-restaurant
// keep working when services are reordered in the admin.
function anchorFor(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export default async function Services() {
  const [hero, intro, amenitiesSection, cta, services, amenities] = await Promise.all([
    getSection('services.hero'),
    getSection('services.intro'),
    getSection('services.amenities'),
    getSection('services.cta'),
    getServices(),
    getAmenities(),
  ]);

  return (
    <div>
      <PageHero data={hero} />

      <style href="services-page" precedence="theme">{`
        /*
          Type scale below is lifted verbatim from the homepage's About Us
          (.about-intro) and Delicious Food (.montana-food-scope .section_title)
          blocks so all three read as one system: a 14px/400 gold eyebrow with
          15px beneath it, a 46px/56px weight-500 near-black heading, and
          16px/28px body with 30px between paragraphs. The previous values here
          (uppercase tracked eyebrow, 34px heading, 18px gaps) were a different,
          tighter system and looked unrelated to the rest of the site.
        */
        .svc-intro, .svc-copy { font-family:var(--font-raleway),"Raleway",sans-serif; }
        .svc-intro { max-width:44rem; margin:0 auto; text-align:center; }
        .svc-intro p { font-size:16px; line-height:28px; color:#4d4d4d; margin:0; }

        .svc-row { margin-bottom:5rem; }
        .svc-row:last-of-type { margin-bottom:0; }
        /* These photos are a mix of landscape and portrait (gardens-1 is a
           tall shot), so crop them to one ratio -- otherwise each row sets a
           different height and the alternating rhythm falls apart. */
        .svc-media img { width:100%; aspect-ratio:4 / 3; object-fit:cover; display:block; border-radius:4px; }
        /* Sentence case, no tracking -- matching "About Us" and "Delicious
           Food" rather than the uppercase label this used to be. */
        .svc-copy .svc-eyebrow { display:block; font-family:var(--font-raleway),"Raleway",sans-serif; color:#c99e54; font-size:14px; font-weight:400; margin-bottom:15px; }
        .svc-copy h2 { font-family:var(--font-raleway),"Raleway",sans-serif; font-size:46px; line-height:56px; font-weight:500; color:#1f1f1f; margin:0 0 20px; }
        .svc-copy p { font-family:var(--font-raleway),"Raleway",sans-serif; font-size:16px; line-height:28px; color:#4d4d4d; margin:0 0 30px; }

        /* Desktop only: flip the photo to the right for alternate rows. On
           mobile the columns stack and the copy must always come first, which
           is exactly what source order gives -- so this is scoped to >=768px
           and the JSX is never reordered. */
        @media (min-width:768px) {
          .svc-row { display:flex; align-items:center; }
          .svc-row.svc-flip .svc-media { order:2; }
          .svc-row.svc-flip .svc-copy { order:1; }
          .svc-copy { padding-left:2.5rem; }
          .svc-row.svc-flip .svc-copy { padding-left:0; padding-right:2.5rem; }
        }
        /* Both heading step-downs are the same values, at the same
           breakpoints, that .about-intro and .montana-food-scope use. */
        @media (max-width:767.98px) {
          .svc-row { margin-bottom:3rem; }
          .svc-media { margin-bottom:1.75rem; }
          .svc-copy h2 { font-size:30px; line-height:36px; }
        }
        @media (min-width:768px) and (max-width:991.98px) {
          .svc-copy h2 { font-size:36px; line-height:42px; }
        }

        /* Closing CTA band. .upcoming-events has no stylesheet rule anywhere in
           the project -- it is only a hook -- so everything this band needs is
           declared here:

           1. background-size:cover. Without it the background falls back to its
              natural size and a 1920px-wide photo simply repeats across the
              band, which is the seam you can see on the untreated version.
           2. A scrim. The band draws no overlay of its own, so white text sits
              directly on the photo. The homepage uses background.jpg, which has
              the brand-green wash baked into the file; this aerial is a bright,
              high-key daylight shot with pale roofs and sand, and white type is
              genuinely unreadable over it untreated. Same ::before-at-z-index:-1
              approach the video_area block on the homepage already uses. */
        .svc-cta { position:relative; z-index:0; background-size:cover; background-position:center center; }
        .svc-cta::before { content:""; position:absolute; top:0; right:0; bottom:0; left:0; z-index:-1; background-color:rgba(10,34,22,.62); }
      `}</style>

      <div className="site-section">
        <div className="container">
          {intro.body && (
            <div className="row">
              <div className="col-md-12">
                <div className="svc-intro mb-5">
                  <Paragraphs text={intro.body} />
                </div>
              </div>
            </div>
          )}

          {services.map((svc, i) => (
            // Every other row puts the photo on the right (desktop only).
            <div className={`row svc-row${i % 2 === 1 ? ' svc-flip' : ''}`} key={svc.id} id={anchorFor(svc.title)}>
              <div className="col-md-6 svc-media">
                <img src={svc.imageUrl} alt={svc.alt} className="img-fluid" loading="lazy" decoding="async" />
              </div>
              <div className="col-md-6 svc-copy">
                {svc.eyebrow && <span className="svc-eyebrow">{svc.eyebrow}</span>}
                <h2>{svc.title}</h2>
                {/* Sanitised on save (lib/sanitize.ts), so safe to render as HTML. */}
                <div dangerouslySetInnerHTML={{ __html: svc.body }} />
                {svc.buttonLabel && svc.buttonHref && (
                  <Link href={svc.buttonHref} className="btn btn-primary pill text-white px-4">
                    {svc.buttonLabel}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <AmenitiesGrid heading={amenitiesSection.heading} items={amenities} className="bg-light" />

      <div
        className="py-5 upcoming-events svc-cta"
        style={{ backgroundImage: cta.image ? `url(${JSON.stringify(cta.image)})` : undefined, backgroundAttachment: 'fixed' }}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h2 className="text-white">{cta.title}</h2>
              {cta.buttonLabel && (
                <Link href={cta.buttonHref || '/book'} className="text-white btn btn-outline-warning rounded-0 text-uppercase">
                  {cta.buttonLabel}
                </Link>
              )}
            </div>
            <div className="col-md-6">
              {cta.caption && <span className="caption">{cta.caption}</span>}
              <h3 className="text-white">{cta.subtitle}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
