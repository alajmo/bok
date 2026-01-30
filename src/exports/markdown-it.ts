import MarkdownIt from "markdown-it";
import MarkdownItAnchor from "markdown-it-anchor";

// Pre-configured instance (same as bok uses internally)
export const MD = MarkdownIt({
  html: true,
  linkify: true,
}).use(MarkdownItAnchor, {
  permalink: MarkdownItAnchor.permalink.linkInsideHeader({
    symbol: "#",
    placement: "before",
    class: "header-anchor",
  }),
});

// Re-export constructor for custom configuration
export { MarkdownIt };
export default MarkdownIt;
