import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageHero } from '@/components/site/blocks';
import { getRoomBySlug, getSection, getSettings } from '@/lib/content/queries';
import { telHref } from '@/lib/content/settings';
import { formatUGX } from '@/lib/money';

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const room = await getRoomBySlug((await params).slug);
  if (!room) return {};
  return { title: room.name, description: room.description || undefined };
}

// One room's own page: banner, details with a booking box, then every photo.
// Rooms are edited in Admin > Collections > Rooms; the shared labels here are
// in Admin > Pages > Rooms > Room pages.
export default async function RoomPage({ params }: Params) {
  const { slug } = await params;
  const [room, copy, settings] = await Promise.all([getRoomBySlug(slug), getSection('rooms.detail'), getSettings()]);
  if (!room) notFound();

  // The cover leads the gallery so the lightbox can step through everything.
  const photos = [room.imageUrl, ...room.photos.filter((p) => p !== room.imageUrl)].filter(Boolean);
  const features = room.features
    .split(/\r?\n/)
    .map((f) => f.trim())
    .filter(Boolean);

  return (
    <>
      <PageHero data={{ eyebrow: `${formatUGX(room.price)} per night`, title: room.name, image: room.imageUrl }} />

      <style href="room-page" precedence="theme">{`
        .room-page .room-back { display:inline-block; margin-bottom:1.5rem; font-size:14px; color:#13482c; }
        .room-page .room-back:hover { color:#c99e54; text-decoration:none; }
        .room-page .room-lead { font-size:1.15rem; line-height:1.7; font-weight:500; color:#2a303b; margin-bottom:1.5rem; }
        .room-page .room-details p { line-height:1.8; margin-bottom:1.25rem; }
        .room-page .room-details ul, .room-page .room-details ol { padding-left:1.25rem; margin-bottom:1.25rem; }
        .room-page h2.room-subhead { font-family:var(--font-raleway),"Raleway",sans-serif; font-weight:500; font-size:1.75rem; color:#1f1f1f; margin:2.25rem 0 1.1rem; }

        /* Features as a two-column checklist with gold ticks. */
        .room-page .room-features { list-style:none; padding:0; margin:0; display:grid; grid-template-columns:1fr; gap:.65rem 2rem; }
        @media (min-width:576px) { .room-page .room-features { grid-template-columns:1fr 1fr; } }
        .room-page .room-features li { position:relative; padding-left:1.75rem; color:#4d4d4d; }
        .room-page .room-features li::before {
          content:""; position:absolute; left:2px; top:.35em; width:.5rem; height:.9rem;
          border:solid #c99e54; border-width:0 2px 2px 0; transform:rotate(45deg);
        }

        /* Booking box: stays in view beside the details on wide screens. */
        .room-page .room-book { background:#fff; border:1px solid #e6ebe7; border-top:4px solid #13482c; border-radius:6px; padding:1.75rem; box-shadow:0 12px 30px -18px rgba(10,34,22,.35); }
        @media (min-width:992px) { .room-page .room-book { position:sticky; top:1.5rem; } }
        .room-page .room-book-price { font-size:1.75rem; font-weight:700; color:#13482c; line-height:1.2; }
        .room-page .room-book-price span { display:block; font-size:.95rem; font-weight:400; color:#636a76; margin-top:.15rem; }
        .room-page .room-book dl { margin:1.25rem 0; }
        .room-page .room-book dl div { display:flex; justify-content:space-between; padding:.55rem 0; border-bottom:1px solid #eef1f4; }
        .room-page .room-book dt { font-weight:400; color:#636a76; }
        .room-page .room-book dd { margin:0; color:#1f1f1f; font-weight:600; }
        /* Brand green rather than the theme's .btn-primary, which is red. */
        .room-page .room-book-btn { display:block; width:100%; text-align:center; padding:.8rem 1rem; border-radius:30px; background:#13482c; color:#fff; font-weight:600; letter-spacing:.02em; transition:background-color .3s ease, color .3s ease; }
        .room-page .room-book-btn:hover, .room-page .room-book-btn:focus { background:#c99e54; color:#13482c; text-decoration:none; }
        .room-page .room-book-call { margin:1.25rem 0 0; font-size:14px; text-align:center; color:#636a76; }
        .room-page .room-book-call a { display:block; font-size:1.05rem; font-weight:600; color:#13482c; }

        /* Gallery: one wide photo, then two across - like the photo grid on
           the old site. Every photo opens in the theme's lightbox. */
        .room-page .room-gallery { display:grid; grid-template-columns:1fr; gap:14px; }
        @media (min-width:768px) { .room-page .room-gallery { grid-template-columns:1fr 1fr; } }
        .room-page .room-gallery a { display:block; overflow:hidden; border-radius:10px; aspect-ratio:4 / 3; background:#eef4ef; }
        @media (min-width:768px) { .room-page .room-gallery a:first-child { grid-column:1 / -1; aspect-ratio:21 / 9; } }
        .room-page .room-gallery img { width:100%; height:100%; object-fit:cover; display:block; transition:transform .6s ease; }
        .room-page .room-gallery a:hover img { transform:scale(1.03); }
      `}</style>

      <div className="room-page">
        <div className="site-section">
          <div className="container">
            <div className="row">
              <div className="col-md-12 col-lg-8 mb-5">
                <Link href="/rooms" className="room-back">&larr; {copy.backLabel}</Link>
                {room.description && <p className="room-lead">{room.description}</p>}
                {/* Sanitised on save (lib/sanitize.ts), so safe to render as HTML. */}
                {room.details && <div className="room-details" dangerouslySetInnerHTML={{ __html: room.details }} />}
                {features.length > 0 && (
                  <>
                    <h2 className="room-subhead">{copy.featuresHeading}</h2>
                    <ul className="room-features">
                      {features.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

              <div className="col-md-12 col-lg-4">
                <aside className="room-book">
                  <div className="room-book-price">
                    {formatUGX(room.price)}
                    <span>per night</span>
                  </div>
                  <dl>
                    <div>
                      <dt>Guests</dt>
                      <dd>Up to {room.capacity}</dd>
                    </div>
                    {room.size && (
                      <div>
                        <dt>Size</dt>
                        <dd>{room.size}</dd>
                      </div>
                    )}
                  </dl>
                  <Link href={`/book?room=${room.slug}`} className="room-book-btn">
                    {copy.bookLabel}
                  </Link>
                  {settings.phonePrimary && (
                    <p className="room-book-call">
                      {copy.callText}
                      <a href={telHref(settings.phonePrimary)}>{settings.phonePrimary}</a>
                    </p>
                  )}
                </aside>
              </div>
            </div>

            {photos.length > 0 && (
              <div className="room-gallery mt-5">
                {photos.map((src, i) => (
                  <a key={`${src}-${i}`} href={src} className="image-popup">
                    <img src={src} alt={`${room.name}, photo ${i + 1}`} loading={i === 0 ? 'eager' : 'lazy'} decoding="async" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
