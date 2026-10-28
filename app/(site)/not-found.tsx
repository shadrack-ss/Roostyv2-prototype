import Link from 'next/link';

export default function NotFound() {
  return (
    <>
      {/* The header floats over a dark hero on every other page, so this
          banner keeps that backdrop for the white menu to sit on. */}
      <div className="site-blocks-cover overlay" style={{ backgroundImage: 'url("/roosty-photos/DJI_0002.jpg.jpg")' }}>
        <div className="container">
          <div className="row align-items-center justify-content-center">
            <div className="col-md-7 text-center">
              <span className="caption mb-3">404</span>
              <h1 className="mb-4">Page Not Found</h1>
            </div>
          </div>
        </div>
      </div>
      <div className="site-section text-center">
        <div className="container">
          <p className="mb-4">The page you were looking for may have moved, or the link may be mistyped.</p>
          <Link href="/" className="btn btn-primary pill text-white px-4">
            Back to the Homepage
          </Link>
        </div>
      </div>
    </>
  );
}
