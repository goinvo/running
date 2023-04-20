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
