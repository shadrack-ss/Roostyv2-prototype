import { TOKEN_HELP, type Field } from "./fields";

/**
 * Every fixed block of copy on the public site, keyed "<page>.<block>".
 *
 * Each entry declares its fields (what the admin form shows) and defaults
 * (what the site shows until an admin saves something). A saved PageSection
 * row only has to hold the values that differ; reads merge it over these
 * defaults, so adding a field here never needs a migration or a backfill.
 *
 * Text values may use {brand}, {phone} and {email}. In "title" style fields a
 * line break becomes a <br>; in "body" textareas a blank line starts a new
 * paragraph.
 */

export const PAGES = {
  home: { label: "Home", path: "/", collections: ["heroSlides", "rooms", "amenities", "gallery", "posts", "testimonials"] },
  rooms: { label: "Rooms", path: "/rooms", collections: ["rooms"] },
  services: { label: "Services", path: "/services", collections: ["services", "amenities"] },
  events: { label: "Events", path: "/events", collections: ["posts"] },
  about: { label: "About", path: "/about", collections: ["team", "amenities", "gallery"] },
  contact: { label: "Contact", path: "/contact", collections: [] },
  book: { label: "Book", path: "/book", collections: ["rooms"] },
  shared: { label: "Header & footer", path: null, collections: [] },
} as const;

export type PageKey = keyof typeof PAGES;

/** Every public path, for changes that show up site-wide. */
export const ALL_PUBLIC_PATHS = Object.values(PAGES)
  .map((p) => p.path)
  .filter((p): p is NonNullable<typeof p> => p !== null);

type SectionDef<D extends Record<string, string>> = {
  page: PageKey;
  label: string;
  description?: string;
  fields: Field[];
  defaults: D;
};

function section<const D extends Record<string, string>>(def: SectionDef<D>) {
  return def;
}

// The banner at the top of every inner page shares one shape.
function pageHero(page: PageKey, eyebrow: string, title: string) {
  return section({
    page,
    label: "Page banner",
    description: "The photo banner at the top of the page.",
    fields: [
      { name: "eyebrow", label: "Small text above the title", type: "text", half: true },
      { name: "title", label: "Title", type: "text", required: true, half: true },
      { name: "image", label: "Background photo", type: "image" },
    ],
    defaults: { eyebrow, title, image: "/roosty-photos/DJI_0002.jpg.jpg" },
  });
}

const headingOnly = (page: PageKey, label: string, heading: string, description?: string) =>
  section({
    page,
    label,
    description,
    fields: [{ name: "heading", label: "Heading", type: "text", required: true }],
    defaults: { heading },
  });

export const SECTIONS = {
  // --- Home ---------------------------------------------------------------
  "home.hero": section({
    page: "home",
    label: "Hero",
    description: "The full-screen opening section. Its photos are managed under Collections > Hero slides.",
    fields: [
      {
        name: "headline",
        label: "Headline",
        type: "text",
        required: true,
        help: "An \"&\" in the headline is drawn in the gold accent style.",
      },
      { name: "highlights", label: "Highlights", type: "textarea", rows: 4, help: "One per line, shown in a row under the headline." },
      { name: "primaryLabel", label: "Main button text", type: "text", half: true },
      { name: "primaryHref", label: "Main button link", type: "text", half: true },
      { name: "secondaryLabel", label: "Second button text", type: "text", half: true },
      { name: "secondaryHref", label: "Second button link", type: "text", half: true },
    ],
    defaults: {
      headline: "Experience Comfort & Relaxation",
      highlights: "Cottages & Apartments\nBar & Restaurant\nParty Gardens\nSecure Parking",
      primaryLabel: "Book Your Stay",
      primaryHref: "/book",
      secondaryLabel: "Explore Rooms",
      secondaryHref: "/rooms",
    },
  }),
  "home.about": section({
    page: "home",
    label: "About",
    fields: [
      { name: "eyebrow", label: "Small text above the title", type: "text", half: true },
      { name: "title", label: "Title", type: "textarea", rows: 2, required: true, half: true, help: "A line break here is kept on wide screens." },
      { name: "body", label: "Text", type: "textarea", rows: 4, help: TOKEN_HELP },
      { name: "linkLabel", label: "Link text", type: "text", half: true },
      { name: "linkHref", label: "Link", type: "text", half: true },
      { name: "image", label: "Main photo", type: "image", half: true },
      { name: "overlayImage", label: "Overlapping photo", type: "image", half: true },
      { name: "videoUrl", label: "Video link", type: "url", help: "YouTube or Vimeo. Clicking the main photo plays it. Leave empty for no play button." },
    ],
    defaults: {
      eyebrow: "About Us",
      title: "Comfort, Great Food\n& Peaceful Stays",
      body: "Experience the ultimate getaway at {brand}. From cozy cottages and modern apartments to our vibrant bar, restaurant, lush gardens, and fun kids' play area - where comfort meets great food, refreshing drinks, and peaceful stays.",
      linkLabel: "Learn More",
      linkHref: "/about",
      image: "/theme/images/img_2.jpg",
      overlayImage: "/theme/images/img_1.jpg",
      videoUrl: "",
    },
  }),
  "home.rooms": section({
    page: "home",
    label: "Our Rooms",
    description: "Shows rooms marked \"Show on homepage\".",
    fields: [
      { name: "heading", label: "Heading", type: "text", required: true, half: true },
      { name: "buttonLabel", label: "Button text", type: "text", half: true },
    ],
    defaults: { heading: "Our Rooms", buttonLabel: "View All Rooms" },
  }),
  "home.amenities": headingOnly("home", "Amenities", "Our Amenities"),
  "home.video": section({
    page: "home",
    label: "Video banner",
    fields: [
      { name: "eyebrow", label: "Small text above the title", type: "text", half: true },
      { name: "title", label: "Title", type: "textarea", rows: 2, half: true },
      { name: "image", label: "Background photo", type: "image" },
      { name: "videoUrl", label: "Video link", type: "url", help: "YouTube or Vimeo. Leave empty to hide the play button." },
    ],
    defaults: {
      eyebrow: "{brand}",
      title: "Relax and Enjoy your\nStay",
      image: "/montana/video/video.jpg",
      videoUrl: "",
    },
  }),
  "home.food": section({
    page: "home",
    label: "Restaurant",
    fields: [
      { name: "eyebrow", label: "Small text above the title", type: "text", half: true },
      { name: "title", label: "Title", type: "textarea", rows: 2, half: true },
      { name: "body", label: "Text", type: "textarea", rows: 4 },
      { name: "linkLabel", label: "Link text", type: "text", half: true },
      { name: "linkHref", label: "Link", type: "text", half: true },
      { name: "image1", label: "First photo", type: "image", half: true },
      { name: "image2", label: "Second photo", type: "image", half: true },
    ],
    defaults: {
      eyebrow: "Delicious Food",
      title: "We Serve Fresh and\nDelicious Food",
      body: "Our kitchen cooks with fresh, seasonal produce from nearby farms. Start the day with a full breakfast, linger over local favourites and continental classics at lunch, or settle into the garden for dinner with a fresh juice or a cocktail from the bar. Guests and visitors are always welcome.",
      linkLabel: "See Our Services",
      linkHref: "/services#restaurant",
      image1: "/montana/about2/1.jpg",
      image2: "/montana/about2/2.jpg",
    },
  }),
  "home.gallery": headingOnly("home", "Gallery", "Our Gallery"),
  "home.updates": headingOnly("home", "Latest updates", "Latest Updates", "Shows the newest published posts."),
  "home.testimonials": headingOnly("home", "Testimonials", "What People Say"),

  // --- Header & footer (site-wide) ---------------------------------------
  "shared.header": section({
    page: "shared",
    label: "Header",
    description: "Brand name, logo initials and contact details come from Site settings.",
    fields: [
      { name: "bookLabel", label: "Top bar button text", type: "text", half: true },
      { name: "bookHref", label: "Top bar button link", type: "text", half: true },
    ],
    defaults: { bookLabel: "Book Now", bookHref: "/book" },
  }),
  "shared.eventsBand": section({
    page: "shared",
    label: "Events banner",
    description: "The photo strip inviting event enquiries, shown on the Home and About pages.",
    fields: [
      { name: "title", label: "Title", type: "text", half: true },
      { name: "caption", label: "Caption", type: "text", half: true },
      { name: "subtitle", label: "Subtitle", type: "text", half: true },
      { name: "buttonLabel", label: "Button text", type: "text", half: true },
      { name: "buttonHref", label: "Button link", type: "text", half: true },
      { name: "image", label: "Background photo", type: "image" },
    ],
    defaults: {
      title: "Host Your Event With Us",
      caption: "Gardens available for hire",
      subtitle: "Weddings, Parties & Functions",
      buttonLabel: "Enquire Now",
      buttonHref: "/contact",
      image: "/roosty-photos/background.jpg",
    },
  }),
  "shared.footer": section({
    page: "shared",
    label: "Footer",
    description: "The About text in the footer is set in Site settings.",
    fields: [
      { name: "aboutHeading", label: "About heading", type: "text", half: true },
      { name: "readMoreLabel", label: "Read more button", type: "text", half: true },
      { name: "menuHeading", label: "Menu heading", type: "text", half: true },
      { name: "contactHeading", label: "Contact heading", type: "text", half: true },
      { name: "socialHeading", label: "Social heading", type: "text", half: true },
    ],
    defaults: {
      aboutHeading: "About",
      readMoreLabel: "Read More",
      menuHeading: "Quick Menu",
      contactHeading: "Get In Touch",
      socialHeading: "Follow Us",
    },
  }),

  // --- Rooms ----------------------------------------------------------------
  "rooms.hero": pageHero("rooms", "Comfortable Stays", "Rooms & Cottages"),
  "rooms.filter": section({
    page: "rooms",
    label: "Room search",
    fields: [
      { name: "note", label: "Note under the search button", type: "textarea", rows: 2, help: TOKEN_HELP },
      { name: "emptyTitle", label: "No results title", type: "text" },
      { name: "emptyText", label: "No results text", type: "textarea", rows: 2 },
    ],
    defaults: {
      note: "Filters our rooms by price and party size. We confirm dates with you directly - call {phone} or send a booking request.",
      emptyTitle: "Nothing in that range",
      emptyText: "Try widening the price range or lowering the guest count.",
    },
  }),
  "rooms.cta": section({
    page: "rooms",
    label: "Call to action",
    fields: [
      { name: "title", label: "Title", type: "text", half: true },
      { name: "text", label: "Text", type: "text", half: true, help: TOKEN_HELP },
      { name: "buttonLabel", label: "Button text", type: "text", half: true },
      { name: "buttonHref", label: "Button link", type: "text", half: true },
      { name: "image", label: "Background photo", type: "image" },
    ],
    defaults: {
      title: "Contact us now!",
      text: "Call {phone} to book directly or for advice",
      buttonLabel: "Contact Now",
      buttonHref: "/contact",
      image: "/roberto/img/1.jpg",
    },
  }),

  // --- Services -------------------------------------------------------------
  "services.hero": pageHero("services", "What We Offer", "Our Services"),
  "services.intro": section({
    page: "services",
    label: "Introduction",
    description: "The services themselves are managed under Collections > Services.",
    fields: [{ name: "body", label: "Text", type: "textarea", rows: 4, help: TOKEN_HELP }],
    defaults: {
      body: "{brand} is more than a place to sleep. Alongside the cottages and apartments you will find a restaurant and bar, gardens built for celebrations, a play area for the children and parking behind a secure gate - all on one property.",
    },
  }),
  "services.amenities": headingOnly("services", "Amenities", "On The Property"),
  "services.cta": section({
    page: "services",
    label: "Closing banner",
    fields: [
      { name: "title", label: "Title", type: "text", half: true },
      { name: "caption", label: "Caption", type: "text", half: true },
      { name: "subtitle", label: "Subtitle", type: "text", half: true, help: TOKEN_HELP },
      { name: "buttonLabel", label: "Button text", type: "text", half: true },
      { name: "buttonHref", label: "Button link", type: "text", half: true },
      { name: "image", label: "Background photo", type: "image" },
    ],
    defaults: {
      title: "Ready When You Are",
      caption: "Rooms, tables and gardens",
      subtitle: "Call {phone}",
      buttonLabel: "Book Your Stay",
      buttonHref: "/book",
      image: "/roosty-photos/DJI_0021.jpg.jpg",
    },
  }),

  // --- Events ---------------------------------------------------------------
  "events.hero": pageHero("events", "News From The Gardens", "Events & Updates"),
  "events.list": section({
    page: "events",
    label: "Post list",
    description: "The posts themselves are managed under Collections > Posts.",
    fields: [{ name: "emptyText", label: "Text when there are no posts", type: "text" }],
    defaults: { emptyText: "No updates yet. Check back soon." },
  }),

  // --- About ----------------------------------------------------------------
  "about.hero": pageHero("about", "{brand}, Perfect Service", "About Us"),
  "about.story": section({
    page: "about",
    label: "Our story",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "body", label: "Text", type: "richtext", help: TOKEN_HELP },
      { name: "image", label: "Main photo", type: "image", half: true },
      { name: "overlayImage", label: "Overlapping photo", type: "image", half: true },
      { name: "videoUrl", label: "Video link", type: "url", half: true, help: "YouTube or Vimeo. Leave empty to hide the video link." },
      { name: "videoLabel", label: "Video link text", type: "text", half: true },
    ],
    defaults: {
      title: "About {brand}",
      body: "<p>{brand} offers a welcoming restaurant and bar serving delicious meals and refreshing drinks, paired with comfortable accommodation. Enjoy a relaxing stay with great hospitality, serene surroundings, quality service, and spaces perfect for dining, leisure, family time, and peaceful rest.</p><p>We look after our guests with secure premises, controlled access, attentive staff and well-maintained facilities, so you can switch off and enjoy your time with us.</p>",
      image: "/theme/images/img_2.jpg",
      overlayImage: "/theme/images/img_1.jpg",
      videoUrl: "",
      videoLabel: "Watch Video",
    },
  }),
  "about.team": headingOnly("about", "Team", "Our Team", "The people are managed under Collections > Team."),
  "about.amenities": headingOnly("about", "Amenities", "Our Amenities"),
  "about.gallery": headingOnly("about", "Gallery", "Our Gallery"),

  // --- Contact --------------------------------------------------------------
  "contact.hero": pageHero("contact", "Chat With Us", "Get In Touch"),
  "contact.form": section({
    page: "contact",
    label: "Contact form",
    description: "Messages sent from this form arrive in Inbox > Messages.",
    fields: [
      { name: "buttonLabel", label: "Send button text", type: "text", half: true },
      { name: "infoHeading", label: "Contact details heading", type: "text", half: true },
      { name: "successTitle", label: "Thank-you title", type: "text" },
      { name: "successText", label: "Thank-you text", type: "textarea", rows: 2 },
    ],
    defaults: {
      buttonLabel: "Send Message",
      infoHeading: "Contact Info",
      successTitle: "Message sent",
      successText: "Thanks for getting in touch. We usually reply within a day.",
    },
  }),

  // --- Book -----------------------------------------------------------------
  "book.hero": pageHero("book", "Reserve Your Stay", "Book Now"),
  "book.form": section({
    page: "book",
    label: "Booking form",
    description: "Requests sent from this form arrive in Inbox > Bookings.",
    fields: [
      { name: "buttonLabel", label: "Submit button text", type: "text" },
      { name: "rateNote", label: "Note under the price estimate", type: "textarea", rows: 2 },
      { name: "successTitle", label: "Thank-you title", type: "text" },
      { name: "successText", label: "Thank-you text", type: "textarea", rows: 2, help: TOKEN_HELP },
    ],
    defaults: {
      buttonLabel: "Request to Book",
      rateNote: "Room rate only, for the dates selected. We confirm the final amount with you when we take the booking.",
      successTitle: "Request Received",
      successText: "We have your request and will confirm your room by phone or email shortly. If it is urgent, call {phone}.",
    },
  }),
  "book.sidebar": section({
    page: "book",
    label: "Sidebar",
    fields: [
      { name: "title", label: "Title", type: "text" },
      { name: "text", label: "Text", type: "textarea", rows: 2 },
    ],
    defaults: {
      title: "Prefer to Talk?",
      text: "Call or WhatsApp us directly and we'll confirm your room on the spot.",
    },
  }),
} as const;

export type SectionKey = keyof typeof SECTIONS;

export type SectionData<K extends SectionKey> = {
  [F in keyof (typeof SECTIONS)[K]["defaults"]]: string;
};

export function isSectionKey(key: string): key is SectionKey {
  return key in SECTIONS;
}

export function isPageKey(key: string): key is PageKey {
  return key in PAGES;
}

export function sectionsForPage(page: PageKey): SectionKey[] {
  return (Object.keys(SECTIONS) as SectionKey[]).filter((k) => SECTIONS[k].page === page);
}

/** Paths whose output depends on a section, for revalidation after a save. */
export function sectionPaths(key: SectionKey): string[] {
  const page = PAGES[SECTIONS[key].page];
  return page.path ? [page.path] : ALL_PUBLIC_PATHS;
}
