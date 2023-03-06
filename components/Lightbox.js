import { useState } from "react";

import styles from "./Lightbox.module.scss";
import cx from "classnames";

export const Lightbox = ({ children, url }) => {
  const [isOpen, setIsOpen] = useState(false);

  // google slides needs to be /embed instead of /pub, so replace it if we see it
  url = url.replace("/pub", "/embed");

  // figma needs to be under the figma.com/embed route
  if (url.includes("figma.com")) {
    url = `https://www.figma.com/embed?embed_host=share&url=${url}`;
  }

  return (
    <div>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={cx(styles.background, { [styles.visible]: isOpen })}
      >
        <div className={styles.closeButton} onClick={() => setIsOpen(!isOpen)}>
          close
        </div>
        <iframe src={url} />
      </div>
      <div onClick={() => setIsOpen(!isOpen)}>{children}</div>
    </div>
  );
};
