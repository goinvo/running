import Image from "next/image";

// Arbitrary Scaling for Images
const imageScaling = 1.5;

// Google Doc Paragraph Element Inline Object Element
const GDPEInlineObjectElement = ({ paragraphElement, rawData }) => {
  const inlineObjects = rawData?.inlineObjects;
  const objectId = paragraphElement.inlineObjectElement.inlineObjectId;
  const embeddedObject =
    inlineObjects[objectId].inlineObjectProperties.embeddedObject;
  const link = paragraphElement.inlineObjectElement.textStyle.link;

  console.log(JSON.stringify(rawData));

  const imageElement = (
    <Image
      alt={""}
      src={embeddedObject.imageProperties.contentUri}
      height={embeddedObject.size.height.magnitude * 1.5}
      width={embeddedObject.size.width.magnitude * 1.5}
    />
  );

  if (link) {
    return <a href={link.url}>{imageElement}</a>;
  }

  return imageElement;
};

export default GDPEInlineObjectElement;
