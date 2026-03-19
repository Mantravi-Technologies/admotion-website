/**
 * Work / portfolio projects for the carousel.
 * Images: place files in public/images/portfolio/ and list filenames per project.
 * Name files by campaign, e.g. tata-sampann-1.jpg, kangaroo-kids-1.png
 */

const PORTFOLIO_IMAGE_BASE = "/images/portfolio";

export const WORK_PROJECTS = [
  {
    id: "tata-sampann",
    client: "Tata Sampann",
    description:
      "OOH and retail branding across multiple markets. Unified visibility and creative that drove footfall and brand recall.",
    metrics: ["70%+ recall lift in key markets", "1,000+ retail touchpoints"],
    gradient: "from-amber-900/50 via-surface to-cyan-900/30",
    accent: "amber",
    images: [ "portfolio-13.png","portfolio-2.png", "portfolio-3.png"],
  },
  {
    id: "kangaroo-kids",
    client: "Kangaroo Kids",
    description:
      "LED van and mobile OOH for Kangaroo Kids International Preschool across Lucknow—Gomti Nagar, Aashiyana, Golf City & more. Purple-and-yellow creative, branch callouts, and admissions messaging on the move.",
    metrics: [
      "Multi-zone Lucknow van routes",
      "Preschool brand visibility after dark",
    ],
    gradient: "from-violet-900/50 via-surface to-amber-900/25",
    accent: "violet",
    images: [
      "kangaroo-kids-1.png",
      "kangaroo-kids-2.png",
      "kangaroo-kids-3.png",
      "kangaroo-kids-4.png",
      "kangaroo-kids-5.png",
      "kangaroo-kids-6.png",
    ],
  },
  {
    id: "brand-campaign",
    client: "Brand Campaign",
    description:
      "End-to-end wall wraps, van branding, and outdoor activation. From concept to installation across Lucknow and beyond.",
    metrics: ["50+ installations", "Wall wraps & LED van fleet"],
    gradient: "from-cyan-900/50 via-surface to-magenta-900/30",
    accent: "cyan",
    images: ["portfolio-7.png", "portfolio-8.png", "portfolio-9.png"],
  },
  {
    id: "retail-ooh",
    client: "Bus & Transit OOH",
    description:
      "Bus branding and transit advertising. Full vehicle wraps and OOH campaigns that reach audiences on the move—billboards, pole kiosks, and BTL activations.",
    metrics: ["Unified creative across formats", "Faster turnaround"],
    gradient: "from-emerald-900/40 via-surface to-cyan-900/20",
    accent: "emerald",
    images: ["portfolio-10.png", "portfolio-11.png"],
  },
  {
    id: "digital-outdoor",
    client: "Digital Outdoor",
    description:
      "Digital wall wraps and dynamic OOH. High-impact, measurable campaigns for brands that want maximum visibility.",
    metrics: ["Dynamic content ready", "Cinema & multiplex OOH"],
    gradient: "from-violet-900/40 via-surface to-magenta-900/20",
    accent: "violet",
    images: ["portfolio-12.png", "portfolio-13.png", "portfolio-14.png"],
  },
] as const;

/** Resolve image filenames to full paths. Supports .jpg, .jpeg, .png, .webp */
export function getProjectImageSrcs(imageNames: readonly string[]): string[] {
  return imageNames.map((name) => `${PORTFOLIO_IMAGE_BASE}/${name}`);
}
