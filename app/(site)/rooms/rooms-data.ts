// Rooms come from the database (Collections > Rooms). This file only holds
// the shape the client-side browser and booking form need, and the price
// slider bounds derived from whatever rooms exist.

export { formatUGX } from '@/lib/money';

export type RoomCard = {
  id: string;
  slug: string;
  name: string;
  /** Nightly rate in whole UGX. */
  price: number;
  size: string;
  capacity: number;
  imageUrl: string;
  description: string;
};

export const PRICE_MIN = 0;
export const PRICE_STEP = 10000;

/**
 * The slider's top end: comfortably above the priciest room, rounded up to a
 * clean 50,000, so the upper handle has somewhere to sit above it - a slider
 * pinned hard against the most expensive room reads as broken.
 */
export function priceCeiling(rooms: RoomCard[]): number {
  const top = Math.max(0, ...rooms.map((r) => r.price));
  return Math.max(50000, Math.ceil((top * 1.1) / 50000) * 50000);
}

export function toRoomCard(room: RoomCard): RoomCard {
  const { id, slug, name, price, size, capacity, imageUrl, description } = room;
  return { id, slug, name, price, size, capacity, imageUrl, description };
}
