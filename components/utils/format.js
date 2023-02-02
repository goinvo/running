export const isWrappedInSquareBrackets = (text) => {
  return text[0] === "[" && text[text.length - 1] === "]";
};
