import type { Site } from "./config.ts";
import type { Page } from "./page.ts";

export { generateMetaTags, extractDescription, buildCanonicalUrl };

interface MetaTagsOptions {
  defaultDescription?: string;
  defaultImage?: string;
  maxDescriptionLength?: number;
  twitterCard?: "summary" | "summary_large_image";
}

/**
 * Generate meta tags HTML for a page.
 *
 * Priority for values:
 * 1. page.params (front-matter)
 * 2. Auto-generated from content
 * 3. site.params defaults
 */
function generateMetaTags(
  site: Site,
  page: Page,
  options: MetaTagsOptions = {}
): string {
  const {
    defaultDescription = "",
    defaultImage = null,
    maxDescriptionLength = 160,
    twitterCard = "summary_large_image",
  } = options;

  const title =
    page.params.title || extractFirstHeading(page.tokens) || site.params?.title || "";

  const description = truncateDescription(
    page.params.description ||
      extractDescription(page.tokens) ||
      site.params?.description ||
      defaultDescription,
    maxDescriptionLength
  );

  const canonicalUrl = page.params.canonical || buildCanonicalUrl(site, page);

  const imageUrl = resolveImageUrl(
    page.params.image || site.params?.ogImage || defaultImage,
    site
  );

  return buildMetaTagsHtml({
    title,
    description,
    canonicalUrl,
    imageUrl,
    siteName: site.params?.title,
    twitterCard,
  });
}

/**
 * Extract first paragraph text from markdown-it tokens.
 */
function extractDescription(tokens: any[]): string {
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token.type === "paragraph_open") {
      const inlineToken = tokens[i + 1];

      if (inlineToken?.type === "inline" && inlineToken.children) {
        const text = inlineToken.children
          .filter((t: any) => t.type === "text" || t.type === "code_inline")
          .map((t: any) => t.content)
          .join("");

        if (text.trim()) {
          return text.trim();
        }
      }
    }
  }

  return "";
}

/**
 * Extract first H1 heading text from tokens.
 */
function extractFirstHeading(tokens: any[]): string {
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token.type === "heading_open" && token.tag === "h1") {
      const inlineToken = tokens[i + 1];

      if (inlineToken?.type === "inline" && inlineToken.children) {
        return inlineToken.children
          .filter((t: any) => t.type === "text" || t.type === "code_inline")
          .map((t: any) => t.content)
          .join("");
      }
    }
  }

  return "";
}

/**
 * Build canonical URL from site.url and page.link.
 */
function buildCanonicalUrl(site: Site, page: Page): string {
  const siteUrl = site.url || site.params?.url;
  if (!siteUrl) {
    return "";
  }

  const baseUrl = siteUrl.replace(/\/$/, "");
  const pagePath = page.link.startsWith("/") ? page.link : `/${page.link}`;

  if (pagePath === "/" || pagePath === "/index") {
    return `${baseUrl}/`;
  }

  if (!site.uglyURLs) {
    return `${baseUrl}${pagePath}/`;
  }

  return `${baseUrl}${pagePath}`;
}

/**
 * Resolve image URL (handle relative paths).
 */
function resolveImageUrl(image: string | null, site: Site): string | null {
  if (!image) {
    return null;
  }

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  const siteUrl = site.url || site.params?.url;
  if (siteUrl) {
    const baseUrl = siteUrl.replace(/\/$/, "");
    const imagePath = image.startsWith("/") ? image : `/${image}`;
    return `${baseUrl}${imagePath}`;
  }

  return image;
}

/**
 * Truncate description to max length at word boundary.
 */
function truncateDescription(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) {
    return text;
  }

  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");

  if (lastSpace > maxLength * 0.7) {
    return truncated.substring(0, lastSpace) + "...";
  }

  return truncated + "...";
}

/**
 * Escape HTML special characters for attribute values.
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Build the meta tags HTML string.
 */
function buildMetaTagsHtml(params: {
  title: string;
  description: string;
  canonicalUrl: string;
  imageUrl: string | null;
  siteName?: string;
  twitterCard: string;
}): string {
  const { title, description, canonicalUrl, imageUrl, siteName, twitterCard } = params;

  const tags: string[] = [];

  if (description) {
    tags.push(`<meta name="description" content="${escapeHtml(description)}">`);
  }

  if (canonicalUrl) {
    tags.push(`<link rel="canonical" href="${escapeHtml(canonicalUrl)}">`);
  }

  if (title) {
    tags.push(`<meta property="og:title" content="${escapeHtml(title)}">`);
  }

  if (description) {
    tags.push(`<meta property="og:description" content="${escapeHtml(description)}">`);
  }

  if (canonicalUrl) {
    tags.push(`<meta property="og:url" content="${escapeHtml(canonicalUrl)}">`);
  }

  tags.push(`<meta property="og:type" content="article">`);

  if (siteName) {
    tags.push(`<meta property="og:site_name" content="${escapeHtml(siteName)}">`);
  }

  if (imageUrl) {
    tags.push(`<meta property="og:image" content="${escapeHtml(imageUrl)}">`);
  }

  tags.push(`<meta name="twitter:card" content="${twitterCard}">`);

  if (title) {
    tags.push(`<meta name="twitter:title" content="${escapeHtml(title)}">`);
  }

  if (description) {
    tags.push(`<meta name="twitter:description" content="${escapeHtml(description)}">`);
  }

  if (imageUrl) {
    tags.push(`<meta name="twitter:image" content="${escapeHtml(imageUrl)}">`);
  }

  return tags.join("\n        ");
}
