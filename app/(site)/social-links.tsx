import type { Settings } from "@/lib/content/settings";

// The theme's icon font has Facebook, Instagram and YouTube but nothing for
// X or TikTok, so those two are inline SVGs (Simple Icons, CC0) sized to
// match the font glyphs.
function SvgIcon({ path }: { path: string }) {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

const X_PATH =
  "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z";
const TIKTOK_PATH =
  "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z";

/** The footer's social column. Only networks with a link in Site settings appear. */
export default function SocialLinks({ settings, heading }: { settings: Settings; heading: string }) {
  const links = [
    { url: settings.facebookUrl, label: "Facebook", icon: <span className="icon-facebook"></span> },
    { url: settings.instagramUrl, label: "Instagram", icon: <span className="icon-instagram"></span> },
    { url: settings.xUrl, label: "X", icon: <SvgIcon path={X_PATH} /> },
    { url: settings.tiktokUrl, label: "TikTok", icon: <SvgIcon path={TIKTOK_PATH} /> },
    { url: settings.youtubeUrl, label: "YouTube", icon: <span className="icon-youtube-play"></span> },
    {
      url: settings.whatsapp ? `https://wa.me/${settings.whatsapp.replace(/\D/g, "")}` : "",
      label: "WhatsApp",
      icon: <span className="icon-whatsapp"></span>,
    },
  ].filter((link) => link.url);

  if (links.length === 0) return null;

  return (
    <div className="col-md-3">
      <h3 className="footer-heading mb-4 text-white">{heading}</h3>
      <div className="footer-social">
        {links.map((link) => (
          <a key={link.label} href={link.url} aria-label={link.label} target="_blank" rel="noopener noreferrer">
            {link.icon}
          </a>
        ))}
      </div>
    </div>
  );
}
