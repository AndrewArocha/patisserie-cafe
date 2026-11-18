export const SITE_URL = "https://patisseriecafe.co";

interface PageMetadata {
  title: string;
  description: string;
  image?: string;
}

export const publicPages: Record<string, PageMetadata> = {
  "/": {
    title: "Patisserie Café | Kosher Café & Breakfast on NYC’s Upper West Side",
    description:
      "Visit Patisserie Café at 676 Amsterdam Avenue on NYC’s Upper West Side for kosher breakfast, French-American pastries, coffee, fresh salads, and catering.",
  },
  "/menu": {
    title: "Kosher Breakfast, Salads & Catering Menu | Patisserie Café NYC",
    description:
      "Explore Patisserie Café’s kosher menu: breakfast, pastries, salads, soups, sandwiches, and catering platters on Manhattan’s Upper West Side.",
    image: "/images/menu-hero-pastries.webp",
  },
  "/catering": {
    title: "Kosher Catering in NYC | Patisserie Café Upper West Side",
    description:
      "Plan a kosher breakfast meeting, lunch, or celebration with Patisserie Café. Explore catering menus, room rentals, and full-service options in New York City.",
    image: "/images/patisserie-lunch.webp",
  },
  "/catering/events": {
    title: "Private Events & Room Rentals NYC | Patisserie Café",
    description:
      "Request private or corporate room rental and full-service kosher catering for up to 60 guests at Patisserie Café on the Upper West Side. 24-hour notice required.",
  },
  "/about": {
    title: "Our Kosher French-American Café | Patisserie Café NYC",
    description:
      "Meet Patisserie Café, a French-American café at 676 Amsterdam Avenue on NYC’s Upper West Side. Discover our pastries and Tartikov kosher certification.",
  },
  "/contact": {
    title: "Visit Patisserie Café | 676 Amsterdam Avenue, New York",
    description:
      "Find Patisserie Café at 676 Amsterdam Avenue, New York, NY 10025. Get directions, call (646) 449-8730, or contact our kosher catering team.",
  },
  "/order": {
    title: "Order Online | Patisserie Café, Upper West Side NYC",
    description:
      "Order your kosher café favorites online from Patisserie Café on Amsterdam Avenue, New York City. Explore breakfast, pastries, and more.",
    image: "/images/breakfast-package.webp",
  },
};

export const privatePages: Record<string, PageMetadata> = {
  "/account": { title: "Your Account | Patisserie Café", description: "Manage your café account." },
  "/forgot-password": {
    title: "Account Help | Patisserie Café",
    description: "Request help signing in to your café account.",
  },
  "/reset-password": {
    title: "Reset Password | Patisserie Café",
    description: "Choose a new password for your café account.",
  },
};

const restaurant = {
  "@context": "https://schema.org",
  "@type": ["CafeOrCoffeeShop", "Bakery", "Restaurant"],
  "@id": `${SITE_URL}/#cafe`,
  name: "Patisserie Café",
  url: `${SITE_URL}/`,
  description: publicPages["/"].description,
  image: [`${SITE_URL}/images/patisserie-storefront.jpg`, `${SITE_URL}/images/menu-hero-pastries.webp`],
  logo: `${SITE_URL}/images/patisserie-logo.png`,
  telephone: "+16464498730",
  email: "contact@patisseriecafe.co",
  address: {
    "@type": "PostalAddress",
    streetAddress: "676 Amsterdam Avenue",
    addressLocality: "New York",
    addressRegion: "NY",
    postalCode: "10025",
    addressCountry: "US",
  },
  servesCuisine: ["Kosher", "French", "American"],
  menu: `${SITE_URL}/menu`,
  sameAs: ["https://www.instagram.com/pattiserie_nyc/"],
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+15512418349",
      email: "catering@patisseriecafe.co",
      contactType: "Catering inquiries",
    },
  ],
};

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (character) => {
    const escapes: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return escapes[character];
  });

export function normalizePath(pathname: string) {
  return pathname.replace(/\/+$/, "") || "/";
}

// The build and client navigation share the same metadata, so links and direct visits agree.
export function renderSeoHead(pathname: string) {
  const path = normalizePath(pathname);
  const publicPage = publicPages[path];
  const page = publicPage ??
    privatePages[path] ?? {
      title: "Page Not Found | Patisserie Café",
      description: "Find your way back to Patisserie Café’s menu, catering, and café information.",
    };
  const canonical = publicPage || privatePages[path] ? `${SITE_URL}${path === "/" ? "/" : path}` : null;
  const image = `${SITE_URL}${page.image ?? "/images/patisserie-storefront.jpg"}`;
  const meta = (name: string, content: string, property = false) =>
    `<meta data-seo ${property ? "property" : "name"}="${name}" content="${escapeHtml(content)}" />`;
  return [
    `<title data-seo>${escapeHtml(page.title)}</title>`,
    meta("description", page.description),
    meta("robots", publicPage ? "index,follow,max-image-preview:large" : "noindex,follow"),
    ...(canonical ? [`<link data-seo rel="canonical" href="${canonical}" />`] : []),
    meta("og:type", "website", true),
    meta("og:site_name", "Patisserie Café", true),
    meta("og:locale", "en_US", true),
    meta("og:title", page.title, true),
    meta("og:description", page.description, true),
    ...(canonical ? [meta("og:url", canonical, true)] : []),
    meta("og:image", image, true),
    meta("og:image:alt", "Patisserie Café on New York City’s Upper West Side", true),
    meta("twitter:card", "summary_large_image"),
    meta("twitter:title", page.title),
    meta("twitter:description", page.description),
    meta("twitter:image", image),
    ...(path === "/"
      ? [
          `<script data-seo type="application/ld+json">${JSON.stringify(restaurant).replace(/</g, "\\u003c")}</script>`,
        ]
      : []),
  ].join("\n    ");
}
