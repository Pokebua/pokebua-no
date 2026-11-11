import "server-only";

import sanitizeHtml from "sanitize-html";

export function sanitizeDescription(html) {
  if (typeof html !== "string") return "";

  return sanitizeHtml(html, {
    allowedTags: [
      "p",
      "br",
      "div",
      "span",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "strong",
      "b",
      "em",
      "i",
      "u",
      "s",
      "del",
      "ul",
      "ol",
      "li",
      "blockquote",
      "a",
      "hr",
      "sup",
      "sub",
      "table",
      "caption",
      "thead",
      "tbody",
      "tfoot",
      "tr",
      "th",
      "td",
    ],
    allowedAttributes: {
      a: ["href", "title"],
      ol: ["start"],
      th: ["scope", "colspan", "rowspan"],
      td: ["colspan", "rowspan"],
    },
    allowedSchemes: ["https", "http", "mailto", "tel"],
    allowProtocolRelative: false,
    transformTags: {
      // The product title is already the page's h1.
      h1: "h2",
    },
  });
}
