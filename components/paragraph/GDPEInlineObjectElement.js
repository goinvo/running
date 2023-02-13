import Image from "next/image";
import { useEffect, useState } from "react";

import styles from "../GoogleDocFormatter.module.scss";

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
    <span className={styles.embededImage}>
      <Image
        alt={""}
        src={embeddedObject.imageProperties.contentUri}
        height={(embeddedObject.size.height.magnitude / 640) * windowWidth}
        width={(embeddedObject.size.width.magnitude / 640) * windowWidth}
      />
    </span>
  );

  if (link) {
    return <a href={link.url}>{imageElement}</a>;
  }

  return imageElement;
};

export default GDPEInlineObjectElement;
