import Image from "next/image";
import { useEffect, useState } from "react";

import styles from "../GoogleDocFormatter.module.scss";
import { Lightbox } from "../Lightbox";
import { formatEmbedUrl } from "../../utils/format";

import cx from "classnames";

// Arbitrary Scaling for Images
const imageScaling = 1.5;

// Google Doc Paragraph Element Inline Object Element
const GDPEInlineObjectElement = ({ paragraphElement, rawData }) => {
  const [windowWidth, setWindowWidth] = useState(0);
  useEffect(() => {
    // on resize, get width of container with id mainContainer
    // and set width of image to that width
    const resizeWindow = () => {
      const mainContainer = document.getElementById("mainContainer");
      setWindowWidth(mainContainer.offsetWidth);
    };

    window.addEventListener("resize", resizeWindow);
    resizeWindow();

    return () => {
      window.removeEventListener("resize", resizeWindow);
    };
  }, []);

  const inlineObjects = rawData?.inlineObjects;
  const objectId = paragraphElement.inlineObjectElement.inlineObjectId;
  const embeddedObject =
    inlineObjects[objectId].inlineObjectProperties.embeddedObject;
  const link = paragraphElement.inlineObjectElement.textStyle.link;

  const imageElement = (
    <span className={cx({
      [styles.embeddedImage]: true,
      [styles.hasLink]: link
    })}>
      <Image
        alt={""}
        src={embeddedObject.imageProperties.contentUri}
        height={(embeddedObject.size.height.magnitude / 640) * windowWidth}
        width={(embeddedObject.size.width.magnitude / 640) * windowWidth}
      />
    </span>
  );

  if (link) {
    // check if link.url contains #lightbox
    // if it does, then return the imageElement wrapped in a lightbox
    if (link.url.includes("#lightbox")) {
      if (link.url.includes("preview")) {
        // this wants a live preview - show the content directly

        return <Lightbox url={link.url}>
          <div className={styles.previewIFrameContainer}
            style={{
              height: (embeddedObject.size.height.magnitude / 640) * windowWidth,
              width: (embeddedObject.size.width.magnitude / 640) * windowWidth
            }}
          >
            <iframe
              className={styles.previewIFrame}
              src={formatEmbedUrl(link.url)}
              width={'100%'}
              height={'100%'}
            />
          </div>
        </Lightbox >;
      }
      return <Lightbox url={link.url}>{imageElement}</Lightbox>;
    }
    return <a href={link.url}>{imageElement}</a>;
  }

  return imageElement;
};

export default GDPEInlineObjectElement;
