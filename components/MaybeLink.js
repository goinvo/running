import styles from "./GoogleDocFormatter.module.scss";

import { isWrappedInSquareBrackets } from "../utils/format";

const MaybeLink = ({ children, link }) => {
  // check to see if the children text is wrapped in square brackets
  // if so, we want to render a link
  const text = children.props.element;

  if (isWrappedInSquareBrackets(text) && link) {
    // strip first and last characters from text
    const strippedText = text.slice(1, text.length - 1);

    return (
      <a className={styles.button} href={link}>
        {strippedText}
      </a>
    );
  }

  if (link) {
    return <a href={link}>{children}</a>;
  }
  return <>{children}</>;
};

export default MaybeLink;
