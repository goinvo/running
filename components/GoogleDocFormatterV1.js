import Link from "next/link";
import React from "react";

import cx from "classnames";
import styles from "./GoogleDocFormatter.module.scss";
import Image from "next/image";

// TODO: reimplement this as a proper parser
// This is currently a very crude interpretation of: https://developers.google.com/docs/api/concepts/structure

const LineBreakManager = ({ element }) => {
  // given a text string, replace all the /n with <br /> and return a jsx element
  if (element === undefined) {
    return <></>;
  }

  const textArray = element.split("\v");
  return textArray.map((text, key) => {
    if (key !== textArray.length - 1)
      return (
        <React.Fragment key={key}>
          {text}
          <br />
        </React.Fragment>
      );
    return <>{text}</>;
  });
};

const TextRunParser = ({ data }) => {
  if (!data) return null;
  const { red, green, blue } =
    data?.textStyle?.foregroundColor?.color?.rgbColor || {};
  const textStyle = {};
  return (
    <span
      className={cx({
        [styles.bold]: data.textStyle.bold,
        [styles.underline]: data.textStyle.underline,
        [styles.italic]: data.textStyle.italic,
      })}
      style={textStyle}
    >
      <LineBreakManager element={data.content} />
    </span>
  );
};

const ParagraphParser = ({ data, inlineObjects }) => {
  return data
    .map((item) => item.textRun || item?.inlineObjectElement)
    .map((item, key) => {
      if (item?.inlineObjectId) {
        const embeddedObject =
          inlineObjects[item.inlineObjectId].inlineObjectProperties
            .embeddedObject;
        return (
          <span className={styles.embeddedImage} key={key}>
            <Link href={embeddedObject.imageProperties.contentUri}>
              <Image
                className={styles.embeddedImageSrc}
                alt={""}
                src={embeddedObject.imageProperties.contentUri}
                height={embeddedObject.size.height.magnitude}
                width={embeddedObject.size.width.magnitude}
              />
            </Link>
          </span>
        );
      }

      if (item?.textStyle.link) {
        return (
          <a href={item.textStyle.link?.url} key={key}>
            <TextRunParser data={item} />
          </a>
        );
      }

      return (
        <span key={key}>
          <TextRunParser data={item} />
        </span>
      );
    });
};

let bulletSection = "NO_BULLET";
let bulletSections = [];
const GoogleDocFormatterV1 = ({ rawData }) => {
  const data = rawData?.body?.content;
  const inlineObjects = rawData?.inlineObjects;
  const cleanedData = data
    ?.filter((section) => section.paragraph || section.table)
    .map((section) => {
      return section.paragraph ? section.paragraph : section.table;
    });
  const elementList = [];

  for (let i = 0; i < cleanedData?.length; i++) {
    const paragraph = cleanedData[i];

    if (paragraph.tableRows) {
      const tableRows = paragraph.tableRows.map((tableRow, row) => {
        return (
          <tr key={"row" + row}>
            {tableRow.tableCells.map((tableCell, cell) => {
              return (
                <td key={"cell" + cell}>
                  {tableCell.content
                    .map((c) => c.paragraph.elements)
                    .map((elem, k) => (
                      <React.Fragment key={"p" + k}>
                        {React.createElement(
                          `span`,
                          { className: styles.paragraph },
                          <ParagraphParser data={elem} />
                        )}
                      </React.Fragment>
                    ))}
                </td>
              );
            })}
          </tr>
        );
      });
      elementList.push(
        <table className={styles.parsedTable}>
          <tbody>{tableRows}</tbody>
        </table>
      );
    } else {
      const paragraphStyle = paragraph?.paragraphStyle?.namedStyleType;
      if (paragraphStyle?.includes("TITLE")) {
        elementList.push(
          React.createElement(
            `div`,
            { className: styles.title },
            <ParagraphParser
              inlineObjects={inlineObjects}
              data={paragraph.elements}
            />
          )
        );
      } else if (paragraphStyle?.includes("HEADING")) {
        const headingLevel = paragraphStyle.split("_")[1];
        elementList.push(
          React.createElement(
            `h${headingLevel}`,
            null,
            <ParagraphParser
              inlineObjects={inlineObjects}
              data={paragraph.elements}
            />
          )
        );
      } else if (paragraph?.bullet) {
        if (bulletSection === "NO_BULLET") {
          bulletSections = [];
          bulletSection = "MID_BULLET";
        }
        bulletSections.push(
          React.createElement(
            `li`,
            null,
            <ParagraphParser
              inlineObjects={inlineObjects}
              data={paragraph.elements}
            />
          )
        );
      } else if (bulletSection === "MID_BULLET") {
        bulletSection = "NO_BULLET";
        elementList.push(React.createElement(`ul`, null, bulletSections));
        elementList.push(
          React.createElement(
            `span`,
            { className: styles.paragraph },
            <ParagraphParser
              inlineObjects={inlineObjects}
              data={paragraph.elements}
            />
          )
        );
      } else {
        elementList.push(
          React.createElement(
            `p`,
            { className: styles.paragraph },
            <ParagraphParser
              inlineObjects={inlineObjects}
              data={paragraph.elements}
            />
          )
        );
      }
    }
  }

  return <div className={styles.googleParser}>{elementList}</div>;
};

export default GoogleDocFormatterV1;
