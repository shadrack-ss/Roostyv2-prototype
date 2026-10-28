import Link from 'next/link';
import { formatUGX, type RoomCard } from './rooms-data';

/**
 * The "Photo tiles" layout: full-bleed room photos, two across from tablet
 * width and one per row on phones, with the details on a dark green
 * gradient at the bottom. Each tile opens that room's own page.
 */
export default function RoomTiles({ rooms }: { rooms: RoomCard[] }) {
  return (
    <div className="room-tiles">
      <style href="room-tiles" precedence="theme">{`
        .room-tiles { display:grid; grid-template-columns:1fr; }
        @media (min-width:768px) { .room-tiles { grid-template-columns:1fr 1fr; } }

        /* Taller than wide on phones so the photo still reads as a room
           rather than a strip; a calmer 16:10 once two sit side by side. */
        .room-tile { position:relative; display:block; aspect-ratio:4 / 5; overflow:hidden; background:#0a2216; color:#fff; }
        @media (min-width:768px) { .room-tile { aspect-ratio:16 / 10; } }
        @media (min-width:1400px) { .room-tile { aspect-ratio:16 / 9; } }

        .room-tiles .room-tile img { position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover; transition:transform .8s ease; }
        .room-tiles .room-tile:hover img, .room-tiles .room-tile:focus-visible img { transform:scale(1.04); }

        /* Brand-green gradient: clear over the top two thirds of the photo,
           deep enough at the bottom for white text on any image. */
        .room-tile::after {
          content:""; position:absolute; top:0; right:0; bottom:0; left:0;
          background:linear-gradient(to top, rgba(10,34,22,.92) 0%, rgba(10,34,22,.55) 30%, rgba(10,34,22,0) 60%);
        }
        /* The Rooms page wraps everything in Roberto's scope, whose rules
           (".roberto-scope h2", ".roberto-scope img" with height:auto) would
           otherwise recolour the text and stop the photo filling the tile,
           hence ".room-tiles" in front of those selectors. */
        .room-tile-body { position:absolute; left:0; right:0; bottom:0; z-index:1; padding:1.5rem 1.25rem; }
        @media (min-width:768px) { .room-tile-body { padding:2rem 2.25rem; } }

        .room-tiles .room-tile h2 { margin:0 0 .35rem; font-family:var(--font-raleway),"Raleway",sans-serif; font-size:1.5rem; line-height:1.25; font-weight:600; color:#fff; }
        @media (min-width:992px) { .room-tiles .room-tile h2 { font-size:2rem; } }
        .room-tile-meta { display:block; font-size:.95rem; color:rgba(255,255,255,.85); margin-bottom:.75rem; }
        .room-tile-price { font-size:1.15rem; font-weight:700; color:#f0dfae; }
        @media (min-width:992px) { .room-tile-price { font-size:1.5rem; } }
        .room-tile-price span { font-size:.95rem; font-weight:400; color:rgba(255,255,255,.85); margin-left:.35rem; }
        .room-tiles .room-tile:hover, .room-tiles .room-tile:focus { color:#fff; text-decoration:none; }
      `}</style>

      {rooms.map((room, i) => (
        <Link key={room.id} href={`/rooms/${room.slug}`} className="room-tile">
          <img src={room.imageUrl} alt={room.name} loading={i < 2 ? 'eager' : 'lazy'} decoding="async" />
          <div className="room-tile-body">
            <h2>{room.name}</h2>
            <span className="room-tile-meta">
              {room.capacity} guest{room.capacity === 1 ? '' : 's'}
              {room.size && <> &middot; {room.size}</>}
            </span>
            <span className="room-tile-price">
              {formatUGX(room.price)}
              <span>per night</span>
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
