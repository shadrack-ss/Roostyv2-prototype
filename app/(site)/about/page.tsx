import type { Metadata } from 'next';
import { AmenitiesGrid, EventsBand, GalleryGrid, PageHero, SectionHeading } from '@/components/site/blocks';
import { initialsOf, videoPopupClass } from '@/components/site/text';
import { getAmenities, getGallery, getSection, getTeam } from '@/lib/content/queries';

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getSection('about.hero')).title };
}

export default async function About() {
  const [hero, story, teamSection, amenitiesSection, gallerySection, eventsBand, team, amenities, gallery] =
    await Promise.all([
      getSection('about.hero'),
      getSection('about.story'),
      getSection('about.team'),
      getSection('about.amenities'),
      getSection('about.gallery'),
      getSection('shared.eventsBand'),
      getTeam(),
      getAmenities(),
      getGallery(),
    ]);

  return (
    <>
      <PageHero data={hero} />

      <div className="site-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 mb-5 mb-md-0">
              <div className="img-border">
                {story.videoUrl ? (
                  <a href={story.videoUrl} className={`${videoPopupClass(story.videoUrl)} image-play`}>
                    <span className="icon-wrap">
                      <span className="icon icon-play"></span>
                    </span>
                    <img src={story.image} alt="" className="img-fluid" fetchPriority="high" decoding="sync" />
                  </a>
                ) : (
                  story.image && <img src={story.image} alt="" className="img-fluid" fetchPriority="high" decoding="sync" />
                )}
              </div>
              {story.overlayImage && (
                <img src={story.overlayImage} alt="" className="img-fluid image-absolute" fetchPriority="high" decoding="sync" />
              )}
            </div>
            <div className="col-md-5 ml-auto">
              <div className="section-heading text-left">
                <h2 className="mb-5">{story.title}</h2>
              </div>
              {/* Sanitised on save (lib/sanitize.ts), so safe to render as HTML. */}
              <div className="about-story" dangerouslySetInnerHTML={{ __html: story.body }} />
              {story.videoUrl && story.videoLabel && (
                <p>
                  <a href={story.videoUrl} className={`${videoPopupClass(story.videoUrl)} text-uppercase`}>
                    {story.videoLabel} <span className="icon-arrow-right small"></span>
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {team.length > 0 && (
        <div className="site-section bg-light">
          <style href="team-initials" precedence="theme">{`
            .about-story p { margin-bottom:1.5rem; }
            /* Square placeholder for people without a photo, the same
               footprint as the photos so the grid stays even. */
            .team-initials { display:flex; align-items:center; justify-content:center; aspect-ratio:1 / 1; background:#13482c; color:#c99e54; font-size:56px; font-weight:700; letter-spacing:.04em; }
            .team-role { display:block; color:#c99e54; font-size:14px; margin:-.5rem 0 .75rem; }
          `}</style>
          <div className="container">
            <SectionHeading>{teamSection.heading}</SectionHeading>
            <div className="row">
              {team.map((member) => (
                <div className="col-md-6 col-lg-4 mb-5" key={member.id}>
                  <div className="hotel-room text-center">
                    <div className="d-block mb-4 thumbnail">
                      {member.photoUrl ? (
                        <img src={member.photoUrl} alt={member.name} className="img-fluid" loading="lazy" decoding="async" />
                      ) : (
                        <span className="team-initials" aria-hidden="true">{initialsOf(member.name)}</span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="heading mb-3">{member.name}</h3>
                      <span className="team-role">{member.role}</span>
                      {member.bio && <p className="mb-0">{member.bio}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <EventsBand data={eventsBand} />

      <AmenitiesGrid heading={amenitiesSection.heading} items={amenities} />

      <GalleryGrid heading={gallerySection.heading} images={gallery} className="border-top" />
    </>
  );
}
