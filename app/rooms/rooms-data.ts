// The four real rooms, matching the previous roostyshomes.com build: same
// names, photos, prices and specs it published. Photos live in
// public/roosty-photos (the same files the old WordPress site served).
//
// price is a NUMBER in UGX, not a display string, because the filter on this
// page compares against it. size stays a string (it is only ever displayed);
// capacity is a number for the same reason price is.
export type Room = {
  slug: string;
  img: string;
  name: string;
  price: number;
  size: string;
  capacity: number;
};

export const ROOMS: Room[] = [
  { slug: 'one-bedroom', img: 'AT8A2643.jpg.jpg', name: 'One Bedroom Occupancy', price: 200000, size: '190 sqm', capacity: 2 },
  { slug: 'deluxe-cottage', img: 'AT8A2449.jpg.jpg', name: 'Deluxe Cottage', price: 200000, size: '600 sqm', capacity: 2 },
  { slug: 'two-bedroom', img: 'AT8A2448.jpg.jpg', name: 'Two Bedroom Occupancy', price: 250000, size: '150 sqm', capacity: 6 },
  { slug: 'family-suite', img: 'g-2.jpg', name: 'Family Suite', price: 360000, size: '400 sqm', capacity: 4 },
];

// Slider bounds. The top is 400,000 rather than the exact 360,000 of the
// priciest room so the upper handle has somewhere to sit above it -- a slider
// pinned hard against the most expensive room reads as broken.
export const PRICE_MIN = 0;
export const PRICE_MAX = 400000;
export const PRICE_STEP = 10000;

// Deliberately NOT toLocaleString: this renders on the server and again on the
// client, and locale-dependent grouping can differ between the two, which shows
// up as a hydration mismatch. Manual grouping is identical everywhere.
export function formatUGX(amount: number): string {
  return 'UGX ' + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
