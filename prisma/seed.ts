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
    prisma.heroSlide.createMany({
      data: [
        { imageUrl: photo("real/exterior-01.jpg"), alt: "Cottages set among the gardens" },
        { imageUrl: photo("real/exterior-02.jpg"), alt: "The main house from the garden path" },
        { imageUrl: photo("real/exterior-03.jpg"), alt: "Guest cottages at dusk" },
        { imageUrl: photo("real/family-exterior.jpg"), alt: "Family cottage with its own lawn" },
        { imageUrl: photo("real/livingroom-01.jpg"), alt: "Bright apartment living room" },
        { imageUrl: photo("real/livingroom-02.jpg"), alt: "Apartment sitting area" },
      ].map((slide, i) => ({ ...slide, sortOrder: i })),
    }),
  );

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
      ].map((room, i) => ({ ...room, sortOrder: i })),
    }),
  );

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
