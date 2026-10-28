import type { Metadata } from 'next';
import { PageHero } from '@/components/site/blocks';
import { getPosts, getSection } from '@/lib/content/queries';

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getSection('events.hero')).title };
}

const POST_DATE = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

// News and events from Collections > Posts, newest first.
export default async function Events() {
  const [hero, list, posts] = await Promise.all([getSection('events.hero'), getSection('events.list'), getPosts()]);

  return (
    <>
      <PageHero data={hero} />

      <div className="site-section">
        <div className="container">
          {posts.length === 0 ? (
            <p className="text-center text-muted">{list.emptyText}</p>
          ) : (
            <div className="row">
              {posts.map((post) => (
                <div className="col-md-6 col-lg-4 mb-5" key={post.id} id={`post-${post.id}`}>
                  <div className="media-with-text">
                    {post.imageUrl && (
                      <div className="img-border-sm mb-4">
                        <img src={post.imageUrl} alt="" className="img-fluid" loading="lazy" decoding="async" />
                      </div>
                    )}
                    <h2 className="heading mb-0">{post.title}</h2>
                    <span className="mb-3 d-block post-date">
                      {POST_DATE.format(post.date)}
                      {post.author && <> &bull; By {post.author}</>}
                    </span>
                    <p>{post.excerpt}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
