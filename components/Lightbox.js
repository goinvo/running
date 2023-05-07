import { useState } from "react";

import styles from "./Lightbox.module.scss";
import cx from "classnames";
import { formatEmbedUrl } from "../utils/format";

export const Lightbox = ({ children, url }) => {
  const [isOpen, setIsOpen] = useState(false);

  url = formatEmbedUrl(url);

  return (
    <>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={cx(styles.background, { [styles.visible]: isOpen })}
      >
        <div className={styles.closeButton} onClick={() => setIsOpen(!isOpen)}>
          close
        </div>
        <iframe src={url} />
      </div>
      <div style={{ height: '100%' }} onClick={() => setIsOpen(!isOpen)}>{children}</div>
    </>
  );
};
