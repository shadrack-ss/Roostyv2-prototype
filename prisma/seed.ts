import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { DEFAULT_SETTINGS } from "../lib/content/settings";

/**
 * Demo content for the Haven Homes template.
 *
 * Safe to re-run: the admin and settings rows are only created when missing,
 * and each list is only filled when it is empty, so running this again never
 * duplicates items or overwrites edits made in the admin.
 *
 * Page copy (headings, paragraphs, buttons) is not seeded - it falls back to
 * the defaults in lib/content/sections.ts until someone edits it.
 */

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

const photo = (file: string) => `/roosty-photos/${file}`;

async function seedIfEmpty(label: string, count: () => Promise<number>, create: () => Promise<unknown>) {
  if ((await count()) > 0) {
    console.log(`  ${label}: already has items, skipped`);
    return;
  }
  await create();
  console.log(`  ${label}: seeded`);
}

// The homepage hero: each photo with the text that flies in over it.
const HERO_SLIDES = [
  {
    imageUrl: photo("real/exterior-01.jpg"),
    alt: "Guest houses set among landscaped gardens",
    heading: "Experience Comfort & Relaxation",
    text: "Cozy cottages and apartments set in quiet, green gardens.",
    buttonLabel: "Book Your Stay",
    buttonHref: "/book",
  },
  {
    imageUrl: photo("real/exterior-02.jpg"),
    alt: "Sports court with hills behind",
    heading: "Room to Play & Unwind",
    text: "A sports court, open lawns and hillside views, all within the gates.",
    buttonLabel: "See Our Services",
    buttonHref: "/services",
  },
  {
    imageUrl: photo("real/exterior-03.jpg"),
    alt: "Kids' play area with a trampoline, slides and a seesaw",
    heading: "Fun for the Little Ones",
    text: "A fenced play area with a trampoline, slides and swings, in full view of the garden tables.",
    buttonLabel: "Plan a Family Stay",
    buttonHref: "/rooms/family-suite",
  },
  {
    imageUrl: photo("real/family-exterior.jpg"),
    alt: "Cottage with a verandah and its own garden",
    heading: "Your Own Quiet Corner",
    text: "Private cottages with a verandah and a garden of their own.",
    buttonLabel: "Book a Cottage",
    buttonHref: "/book?room=deluxe-cottage",
  },
  {
    imageUrl: photo("real/livingroom-01.jpg"),
    alt: "Bright apartment living room",
    heading: "Space to Settle In",
    text: "Bright living rooms, full kitchens and comfortable bedrooms for short or long stays.",
    buttonLabel: "Check Availability",
    buttonHref: "/book",
  },
  {
    imageUrl: photo("real/livingroom-02.jpg"),
    alt: "Apartment dining and sitting area",
    heading: "Home Comforts & Great Rates",
    text: "Ask about weekly and monthly rates on our apartments.",
    buttonLabel: "Contact Us",
    buttonHref: "/contact",
  },
];

// Room page content for the demo rooms: gallery photos, features and the
// fuller description. Used when the rooms are first created, and to backfill
// rooms seeded before room pages existed (see main()).
const ROOM_PAGES: Record<string, { photos: string[]; features: string; details: string }> = {
  "one-bedroom": {
    photos: ["AT8A2645.jpg.jpg", "AT8A2653.jpg.jpg", "AT8A2655.jpg.jpg", "AT8A2639.jpg.jpg"].map(photo),
    features: [
      "Double bed with mosquito net",
      "Fully fitted kitchen",
      "Private bathroom with hot shower",
      "Free Wi-Fi",
      "Smart TV",
      "Daily housekeeping",
    ].join("\n"),
    details:
      "<p>A self-contained apartment for two, with a bright double bedroom, its own kitchen and a private bathroom. Cook for yourself or order from the restaurant and eat in.</p><p>Ideal for longer stays and business trips, with a quiet spot to work and secure parking outside.</p>",
  },
  "deluxe-cottage": {
    photos: ["AT8A2466.jpg.jpg", "AT8A2468.jpg-1.jpg", "AT8A2456.jpg.jpg", "AT8A2436.jpg-scaled.jpg"].map(photo),
    features: [
      "King-size bed",
      "Freestanding bathtub",
      "Private garden lawn",
      "Free Wi-Fi",
      "Tea and coffee station",
      "Room service from the restaurant",
    ].join("\n"),
    details:
      "<p>Our most private option: a standalone cottage set in its own stretch of garden, with a king-size bed and a deep freestanding bath.</p><p>A favourite for anniversaries and quiet weekends away. Breakfast can be brought to your door.</p>",
  },
  "two-bedroom": {
    photos: ["AT8A2471.jpg.jpg", "AT8A2472.jpg.jpg", "AT8A2547.jpg.jpg", "AT8A2557.jpg.jpg", "AT8A2488.jpg.jpg"].map(photo),
    features: [
      "Two bedrooms, double and twin",
      "Sleeps up to six",
      "Shared living area",
      "Hot shower",
      "Free Wi-Fi",
      "Secure parking",
    ].join("\n"),
    details:
      "<p>Two bedrooms around a shared living space, sleeping up to six. Good for friends travelling together or a family that wants a little more room.</p><p>One room has a double bed and the other two singles, and extra beds can be arranged on request.</p>",
  },
  "family-suite": {
    photos: ["AT8A2586.jpg.jpg", "AT8A2584.jpg.jpg", "AT8A2629.jpg.jpg", "AT8A2631.jpg.jpg", "AT8A2562.jpg.jpg", "AT8A2572.jpg.jpg"].map(photo),
    features: [
      "Master bedroom with four-poster bed",
      "Spacious sitting room",
      "Dining area",
      "Two bathrooms",
      "Smart TV",
      "Short walk to the kids' play area",
    ].join("\n"),
    details:
      "<p>Our largest suite, with a grand four-poster master bedroom, a spacious sitting room and a dining area for family meals.</p><p>The kids' play area and the gardens are a short walk away, so parents can relax at a table while the children play in full view.</p>",
  },
};

async function main() {
  const email = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD;
  if (email && password) {
    const existing = await prisma.admin.findUnique({ where: { email } });
    if (!existing) {
      await prisma.admin.create({
        data: { email, name: "Site Admin", passwordHash: await bcrypt.hash(password, 12) },
      });
      console.log(`  admin: created ${email}`);
    } else {
      console.log(`  admin: ${email} already exists, left unchanged`);
    }
  } else {
    console.warn("  admin: ADMIN_EMAIL / ADMIN_PASSWORD not set, no admin created");
  }

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton", ...DEFAULT_SETTINGS },
  });
  console.log("  settings: ensured");

  await seedIfEmpty("hero slides", () => prisma.heroSlide.count(), () =>
    prisma.heroSlide.createMany({ data: HERO_SLIDES.map((slide, i) => ({ ...slide, sortOrder: i })) }),
  );

  // Slides seeded before slides had their own text get it now. Only slides
  // still without a headline are touched, so edited slides are left alone.
  for (const slide of HERO_SLIDES) {
    const { count } = await prisma.heroSlide.updateMany({ where: { imageUrl: slide.imageUrl, heading: "" }, data: slide });
    if (count) console.log(`  hero slide ${slide.imageUrl}: added demo text`);
  }

  await seedIfEmpty("rooms", () => prisma.room.count(), () =>
    prisma.room.createMany({
      data: [
        {
          slug: "one-bedroom",
          name: "One Bedroom Occupancy",
          price: 200000,
          size: "190 sqm",
          capacity: 2,
          imageUrl: photo("AT8A2643.jpg.jpg"),
          description: "A self-contained apartment with a double bedroom, sitting room and kitchenette.",
        },
        {
          slug: "deluxe-cottage",
          name: "Deluxe Cottage",
          price: 200000,
          size: "600 sqm",
          capacity: 2,
          imageUrl: photo("AT8A2449.jpg.jpg"),
          description: "A private cottage in its own stretch of garden, made for a quiet couple's break.",
        },
        {
          slug: "two-bedroom",
          name: "Two Bedroom Occupancy",
          price: 250000,
          size: "150 sqm",
          capacity: 6,
          imageUrl: photo("AT8A2448.jpg.jpg"),
          description: "Two bedrooms and a shared living area, ideal for friends travelling together.",
        },
        {
          slug: "family-suite",
          name: "Family Suite",
          price: 360000,
          size: "400 sqm",
          capacity: 4,
          imageUrl: photo("g-2.jpg"),
          description: "Our largest suite, a short walk from the kids' play area.",
        },
      ].map((room, i) => ({ ...room, ...ROOM_PAGES[room.slug], sortOrder: i })),
    }),
  );

  // Rooms seeded before room pages existed have no gallery yet. Fill in the
  // demo page content for those only; a room someone has added photos to is
  // left exactly as it is.
  for (const [slug, page] of Object.entries(ROOM_PAGES)) {
    const { count } = await prisma.room.updateMany({ where: { slug, photos: { isEmpty: true } }, data: page });
    if (count) console.log(`  room ${slug}: added demo photos, features and details`);
  }

  await seedIfEmpty("services", () => prisma.service.count(), () =>
    prisma.service.createMany({
      data: [
        {
          eyebrow: "Stay",
          title: "Cottages & Apartments",
          imageUrl: photo("AT8A2449.jpg.jpg"),
          alt: "Bedroom in a deluxe cottage with a nightstand and reading lamp",
          body: "<p>Four self-contained room types across the property, from a one-bedroom unit up to a family suite that sleeps four. Each one is furnished, serviced and set in its own stretch of garden.</p><p>Rates run from UGX 200,000 to UGX 360,000 per night depending on the room.</p>",
          buttonLabel: "See All Rooms",
          buttonHref: "/rooms",
        },
        {
          eyebrow: "Eat",
          title: "The Restaurant",
          imageUrl: photo("restaurant.jpg"),
          alt: "Guests having a meal in the restaurant",
          body: "<p>Our kitchen works from fresh, seasonal ingredients - local favourites alongside international classics, served from a slow weekend brunch through to dinner.</p><p>Open to guests staying with us and to visitors dropping in.</p>",
        },
        {
          eyebrow: "Drink",
          title: "The Bar",
          imageUrl: photo("AT8A2527.jpg.jpg"),
          alt: "Guests being served at the indoor bar counter",
          body: "<p>Cocktails, beers, wines and fresh juice, poured somewhere you can actually hear each other. Quiet corners for a slow evening, open seating when the room fills up.</p>",
        },
        {
          eyebrow: "Celebrate",
          title: "Gardens & Functions",
          imageUrl: photo("gardens-1.jpg"),
          alt: "Garden set for an outdoor ceremony with white chairs and hanging lanterns",
          body: "<p>Our gardens are available to hire for weddings, receptions and parties, with room to lay out an aisle, a dance floor and seating without anyone feeling crowded.</p><p>The same space works for meetings and workshops, and for birthdays we will set the room up around whatever you have planned.</p>",
          buttonLabel: "Enquire About Your Event",
          buttonHref: "/contact",
        },
        {
          eyebrow: "Family",
          title: "Kids' Play Area",
          imageUrl: photo("playground.webp"),
          alt: "Play area with a netted trampoline, climbing frame with slides and a seesaw",
          body: "<p>A fenced play area with a climbing frame and slides, a netted trampoline and a seesaw, set on soft sand and in full view of the gardens - close enough to keep an eye on from a table.</p>",
        },
      ].map((service, i) => ({ ...service, sortOrder: i })),
    }),
  );

  await seedIfEmpty("amenities", () => prisma.amenity.count(), () =>
    prisma.amenity.createMany({
      data: [
        { icon: "flaticon-pool", label: "Pool Table" },
        { icon: "flaticon-desk", label: "24/7 Reservation" },
        { icon: "flaticon-exit", label: "Secure Premises" },
        { icon: "flaticon-parking", label: "Car Parking" },
        { icon: "flaticon-hair-dryer", label: "Room Service" },
        { icon: "flaticon-minibar", label: "Bar & Restaurant" },
        { icon: "flaticon-drink", label: "Cocktails & Fresh Juice" },
        { icon: "flaticon-cab", label: "Online Booking" },
      ].map((amenity, i) => ({ ...amenity, sortOrder: i })),
    }),
  );

  await seedIfEmpty("gallery", () => prisma.galleryImage.count(), () =>
    prisma.galleryImage.createMany({
      data: [
        { imageUrl: photo("AT8A2629.jpg-scaled.jpg"), alt: "Apartment living room with a wall-mounted TV and dining area" },
        { imageUrl: photo("AT8A2634.jpg.jpg"), alt: "Open-plan sitting room, dining table and kitchen in an apartment" },
        { imageUrl: photo("AT8A2560.jpg.jpg"), alt: "Apartment living room in teal with an orange sofa and kitchen counter" },
        { imageUrl: photo("AT8A2586.jpg.jpg"), alt: "Bedroom with a carved hardwood bed and mosquito net" },
        { imageUrl: photo("AT8A2584.jpg.jpg"), alt: "Blue bedroom with a dark carved four-poster bed and canopy" },
        { imageUrl: photo("AT8A2653.jpg.jpg"), alt: "Bedroom with a full-height wardrobe and a canopy over the bed" },
        { imageUrl: photo("AT8A2547.jpg.jpg"), alt: "Twin room with two single beds and gold curtains" },
        { imageUrl: photo("AT8A2527.jpg.jpg"), alt: "Guests being served at the indoor bar counter" },
      ].map((image, i) => ({ ...image, sortOrder: i })),
    }),
  );

  await seedIfEmpty("testimonials", () => prisma.testimonial.count(), () =>
    prisma.testimonial.createMany({
      data: [
        {
          name: "Grace Namutebi",
          detail: "Stayed in the Deluxe Cottage",
          photoUrl: "/theme/images/person_1.jpg",
          quote: "We booked the Deluxe Cottage for our anniversary and did not want to leave. The garden was so quiet in the mornings, the room was spotless, and the staff remembered how we liked our coffee by the second day.",
        },
        {
          name: "Daniel Okello",
          detail: "Business trip, three nights",
          photoUrl: "/theme/images/person_2.jpg",
          quote: "The breakfast alone is worth the stay. Fresh juice, proper coffee and an omelette made to order before my meetings. Reliable Wi-Fi and a calm place to work in the evenings too.",
        },
        {
          name: "Sarah Atuhaire",
          detail: "Family weekend",
          photoUrl: "/theme/images/person_3.jpg",
          quote: "Our two boys spent the whole weekend in the play area while we sat at a table right next to it with a drink. The Family Suite had plenty of space for all four of us. We are already planning the next visit.",
        },
        {
          name: "Brian Mugisha",
          detail: "Garden wedding reception",
          photoUrl: "/theme/images/person_4.jpg",
          quote: "We held our wedding reception in the gardens for 150 guests and everything ran on time. The events team handled the setup, the food was excellent, and our guests are still talking about the evening.",
        },
      ].map((t, i) => ({ ...t, sortOrder: i })),
    }),
  );

  await seedIfEmpty("team", () => prisma.teamMember.count(), () =>
    prisma.teamMember.createMany({
      data: [
        { name: "Patricia Kyomuhendo", role: "General Manager", photoUrl: "/theme/images/person_1.jpg", bio: "Fifteen years in hospitality and the reason everything runs on time." },
        { name: "Joseph Tumwine", role: "Head Chef", photoUrl: "/theme/images/person_2.jpg", bio: "Cooks with whatever the local farms brought in that morning." },
        { name: "Esther Nakato", role: "Front Office Lead", photoUrl: "/theme/images/person_3.jpg", bio: "Your first hello at check-in and the person to ask about anything." },
        { name: "Ivan Ssemanda", role: "Events Coordinator", photoUrl: "/theme/images/person_4.jpg", bio: "Plans weddings, parties and meetings in the gardens from start to finish." },
        { name: "Ruth Ainembabazi", role: "Housekeeping Supervisor", photoUrl: "", bio: "Keeps every room fresh, quiet and ready for the next guest." },
        { name: "Martin Byaruhanga", role: "Bar Manager", photoUrl: "", bio: "Behind the fresh juices, the cocktail menu and the Friday music nights." },
      ].map((m, i) => ({ ...m, sortOrder: i })),
    }),
  );

  await seedIfEmpty("posts", () => prisma.post.count(), () =>
    prisma.post.createMany({
      data: [
        {
          title: "Sunday Family Brunch Is Back",
          date: new Date("2026-10-18T00:00:00Z"),
          imageUrl: "/theme/images/img_1.jpg",
          excerpt: "Every Sunday from 10am, a relaxed brunch in the garden with pancakes, fresh fruit, grilled local favourites and juices for the kids. Children under five eat free.",
        },
        {
          title: "Garden Wedding Season: Bookings Now Open",
          date: new Date("2026-10-04T00:00:00Z"),
          imageUrl: "/theme/images/img_2.jpg",
          excerpt: "Our gardens host up to 200 guests for ceremonies and receptions. Dates for next year are filling up, so get in touch to arrange a walk-through with our events team.",
        },
        {
          title: "A New Cocktail and Fresh Juice Menu",
          date: new Date("2026-09-20T00:00:00Z"),
          imageUrl: "/theme/images/img_3.jpg",
          excerpt: "The bar has a new menu built around local fruit: passion fruit mojitos, pineapple and ginger coolers, and a tamarind sour that has quickly become a favourite.",
        },
        {
          title: "The Kids' Play Area Gets an Upgrade",
          date: new Date("2026-09-02T00:00:00Z"),
          imageUrl: "/theme/images/img_4.jpg",
          excerpt: "A bigger trampoline, a second slide and more shaded seating for parents. The play area stays fenced and in full view of the garden tables.",
        },
        {
          title: "Live Music Fridays at the Bar",
          date: new Date("2026-08-15T00:00:00Z"),
          imageUrl: "/theme/images/img_5.jpg",
          excerpt: "Local acoustic artists play from 7pm every Friday. Entry is free for guests and visitors, and the kitchen stays open late.",
        },
        {
          title: "Weekend Getaway Rate",
          date: new Date("2026-07-30T00:00:00Z"),
          imageUrl: "/theme/images/img_6.jpg",
          excerpt: "Stay Friday and Saturday night and get breakfast for two included on both mornings. Available on all room types, subject to availability.",
        },
      ].map((p) => ({ ...p, author: "The Haven Homes Team" })),
    }),
  );
}

main()
  .then(() => console.log("Seed complete."))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
