export const isWrappedInSquareBrackets = (text) => {
  return text[0] === "[" && text[text.length - 1] === "]";
};

export const standardizePageId = (title) => {
  return title
    .replace(/[0-9].([a-z].)? /, "")
    .split(" ")
    .join("-")
    .replace(/[^0-9a-zA-Z-]/g, "")
    .trim()
    .toLowerCase();
};

export const formatEmbedUrl = (url) => {
  // google slides needs to be /embed instead of /pub, so replace it if we see it
  url = url.replace("/pub", "/embed");

  // figma needs to be under the figma.com/embed route
  if (url.includes("figma.com")) {
    url = `https://www.figma.com/embed?embed_host=share&url=${url}`;
  }

  return url;
}