/**
 * Site content sourced from AdMotion catalog & Company Profile PDFs.
 */

export const BRAND = {
  name: "AdMotion",
  tagline: "Advertising | Marketing | Branding",
  subtitle: "Media & Services",
} as const;

export const CONTACT = {
  address: "1/324, Vinamra Khand, Gomti Nagar, Lucknow 226010",
  phone: "9479727294",
  phoneDisplay: "+91 94797 27294",
  email: "admotion2024@gmail.com",
} as const;

export const COMPANY_OVERVIEW = `Ad Motion is a rapidly emerging, full-service marketing company specializing in advertising, photography, and film. Renowned for our innovative ideas and impactful results, we combine creativity, expertise, and experience to consistently deliver outstanding outcomes for our clients.

Our focus is on delivering top-quality, highly effective outdoor advertising that goes beyond creativity—it is strategically designed to produce measurable results.

While our competitors strive for client satisfaction, we excel at maintaining it, setting new benchmarks for quality and service in the process.`;

export const VISION = `Our primary vision is to continuously explore more effective ways to connect with our clients' target audiences. This involves consistently researching, analyzing, and experimenting with innovative solutions to deliver the best communication strategies.`;

export const MISSION = `Our mission is to support our clients' growth and strengthen their brands through expertly crafted marketing communications. We are passionate about combining the latest marketing techniques with strategic thinking and creative execution. Most importantly, we focus on building long-term client relationships by offering innovative solutions.`;

export const KEY_FACTORS = [
  {
    title: "Innovation",
    description:
      "We are innovative & creative in the way we respond to every brief and work to always offer the best communication and advertising solutions to our clients.",
  },
  {
    title: "Infrastructure",
    description:
      "We exist to make growing brands thrive and help thriving brands to become a way of life in the markets they operate through many promotional ways.",
  },
];

/** Replaces former “team” block: same site voice, outcome-focused. */
export const WHY_ADMOTION = {
  title: "Why brands choose AdMotion",
  intro:
    "Outdoor and mixed media only work when strategy, production, and placement move together. Here is how we deliver campaigns that are seen, remembered, and measured.",
  pillars: [
    {
      title: "Strategy before spend",
      description:
        "We align every brief with audience, geography, and timing—so your budget goes to placements that actually move the needle, not just the biggest wall.",
      accent: "cyan" as const,
    },
    {
      title: "Creative that travels",
      description:
        "From LED vans and wall wraps to retail and transit, one coherent story across formats. Your brand reads clearly at 60 km/h and up close.",
      accent: "magenta" as const,
    },
    {
      title: "Execution you can trust",
      description:
        "Print, install, and maintenance handled in-house and with vetted partners. Fewer handoffs mean fewer surprises on launch day.",
      accent: "yellow" as const,
    },
    {
      title: "Results you can discuss",
      description:
        "We design for recall, footfall, and reach you can talk about with stakeholders—not just “we were on a hoarding.”",
      accent: "cyan" as const,
    },
  ],
} as const;

export const PORTFOLIO_INTRO = `Ad Motion offers the desired multi-service solutions to its customers in all areas under one roof across India. Whether it is the advertising sector, we are known for our creative work in every field.`;

/** Services from Company Profile PDF (pages 6–7), grouped for Bento layout */
export const SERVICES_GROUPED = [
  {
    id: "ooh",
    title: "Outdoor Advertising (OOH)",
    description: "Billboards, hoardings & high-impact outdoor media. Your all-in-one solution for planning, purchasing, and executing OOH campaigns.",
    size: "large" as const,
    accent: "magenta" as const,
  },
  {
    id: "cinema",
    title: "Cinema / Multiplex Advertisement",
    description: "Big-screen impact before the show. Reach captive audiences at cinemas and multiplexes.",
    size: "medium" as const,
    accent: "cyan" as const,
  },
  {
    id: "radio",
    title: "Radio Advertising",
    description: "Sound that reaches your audience wherever they are.",
    size: "medium" as const,
    accent: "yellow" as const,
  },
  {
    id: "mall-media",
    title: "Mall Media",
    description: "High-footfall mall advertising and activations.",
    size: "medium" as const,
    accent: "cyan" as const,
  },
  {
    id: "newspaper",
    title: "Newspaper Advertisement",
    description: "Print campaigns with wide reach and credibility.",
    size: "medium" as const,
    accent: "magenta" as const,
  },
  {
    id: "mobile-van",
    title: "Mobile Van Advertisement",
    description: "Mobile visibility that moves with the city.",
    size: "medium" as const,
    accent: "yellow" as const,
  },
  {
    id: "tv",
    title: "Television Advertisement",
    description: "TV spots and broadcast campaigns for mass reach.",
    size: "medium" as const,
    accent: "cyan" as const,
  },
  {
    id: "led-van",
    title: "LED Van Advertisement",
    description: "Dynamic LED displays on wheels for maximum attention.",
    size: "medium" as const,
    accent: "magenta" as const,
  },
  {
    id: "btl-retail",
    title: "BTL – Retail Branding",
    description: "In-store branding, POS, and retail activation.",
    size: "large" as const,
    accent: "cyan" as const,
  },
  {
    id: "digital-wall-wrap",
    title: "Digital Wall Wrap",
    description: "Building-sized digital and print wall wraps.",
    size: "medium" as const,
    accent: "yellow" as const,
  },
  {
    id: "bus-branding",
    title: "Bus Branding",
    description: "Full bus wraps and transit advertising.",
    size: "medium" as const,
    accent: "magenta" as const,
  },
  {
    id: "acrylic-glowsign",
    title: "Acrylic Boards / Glow Sign Boards",
    description: "Illuminated signboards and acrylic displays.",
    size: "medium" as const,
    accent: "cyan" as const,
  },
  {
    id: "digital-wall-painting",
    title: "Digital Wall Painting / Shop Painting",
    description: "Custom murals and shop-front artwork.",
    size: "medium" as const,
    accent: "yellow" as const,
  },
  {
    id: "flex-vinyl",
    title: "Flex / Vinyl Printing Services",
    description: "Banners, flex, and vinyl printing for outdoor and indoor use.",
    size: "medium" as const,
    accent: "cyan" as const,
  },
  {
    id: "auto-branding",
    title: "Auto Branding",
    description: "Vehicle wraps and auto advertising.",
    size: "medium" as const,
    accent: "magenta" as const,
  },
  {
    id: "e-rickshaw",
    title: "E-Rickshaw Branding / Canopy",
    description: "E-rickshaw branding and canopy placement.",
    size: "medium" as const,
    accent: "yellow" as const,
  },
  {
    id: "placement-promotions",
    title: "Placement and Promotions",
    description: "On-ground placement and promotional campaigns.",
    size: "medium" as const,
    accent: "cyan" as const,
  },
  {
    id: "sunpack-noparking",
    title: "Sunpack Branding / No Parking Boards",
    description: "Sunpack and no-parking sign solutions.",
    size: "medium" as const,
    accent: "magenta" as const,
  },
  {
    id: "display-boards",
    title: "Display / Non Lit Boards",
    description: "Display and non-lit board advertising.",
    size: "medium" as const,
    accent: "yellow" as const,
  },
  {
    id: "pole-kiosk-standee",
    title: "Pole Kiosk / Standee / Direction Boards",
    description: "Kiosks, standees, and direction boards for high-visibility placement.",
    size: "large" as const,
    accent: "cyan" as const,
  },
];
