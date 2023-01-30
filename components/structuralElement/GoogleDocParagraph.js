import React from "react";

import GDPEInlineObjectElement from "../paragraph/GDPEInlineObjectElement";
import GDPETextRun from "../paragraph/GDPETextRun";

import styles from "../GoogleDocFormatter.module.scss";

const GoogleDocParagraph = ({ paragraphs, rawData }) => {
  // Render each paragraph element. Paragraph elements can contain:
  // ParagraphStyle (stylings), Bullet (is part of a list), and ParagraphElement (actual content)

  return (
    <div
      style={{
        textAlign: paragraphs.paragraphStyle?.alignment,
      }}
    >
      {paragraphs.elements.map((item, key) => {
        if (item.inlineObjectElement) {
          return (
            <GDPEInlineObjectElement
              key={key}
              paragraphElement={item}
              rawData={rawData}
            />
          );
        }

        const paragraphStyle = paragraphs.paragraphStyle?.namedStyleType;

        if (paragraphStyle?.includes("TITLE")) {
          return (
            <span key={key}>
              {React.createElement(
                `div`,
                { className: styles.title },
                <GDPETextRun paragraphElement={item} rawData={rawData} />
              )}
            </span>
          );
        }

        if (paragraphStyle?.includes("HEADING")) {
          const headingLevel = paragraphStyle.split("_")[1];
          return (
            <span key={key}>
              {React.createElement(
                `h${headingLevel}`,
                { className: styles[`heading${headingLevel}`] },
                <GDPETextRun paragraphElement={item} rawData={rawData} />
              )}
            </span>
          );
        }

        if (item.textRun) {
          return (
            <GDPETextRun key={key} paragraphElement={item} rawData={rawData} />
          );
        }
        return <span key={key}>{JSON.stringify(item)}</span>;
      })}
    </div>
  );
};

export default GoogleDocParagraph;
