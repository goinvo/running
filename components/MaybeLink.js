import styles from "./GoogleDocFormatter.module.scss";

import { isWrappedInSquareBrackets } from "../utils/format";

const MaybeLink = ({ children, link }) => {
  // check to see if the children text is wrapped in square brackets
  // if so, we want to render a link
  const text = children.props.element;

  // if link contains #self, then show in current tab. otherwise, 
  // open in new tab if it's not a running.goinvo link
  const target = link?.includes("#self") ? "_self" :
    link?.includes("running.goinvo") ? "_self" : "_blank";

  if (isWrappedInSquareBrackets(text) && link) {
    // strip first and last characters from text
    const strippedText = text.slice(1, text.length - 1);

    return (
      <a className={styles.button} href={link} target={target}>
        {strippedText}
      </a>
    );
  }

  if (link) {
    return <a href={link} target={target}>{children}</a>;
  }

  return <>{children}</>;
};

export default MaybeLink;
