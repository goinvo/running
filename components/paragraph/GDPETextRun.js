// Google Doc Paragraph Element Text Run

import cx from "classnames";
import React from "react";

import MaybeLink from "../MaybeLink";

import styles from "../GoogleDocFormatter.module.scss";

const LineBreakManager = ({ element }) => {
  // given a text string, replace all the /n with <br /> and return a jsx element
  if (element === undefined) {
    return <></>;
  }

  const textArray = element.split("\v");
  return textArray.map((text, key) => {
    if (text === "\n") {
      return <br key={key} />;
    }
    if (key !== textArray.length - 1)
      return (
        <span key={key}>
          {text}
          <br />
        </span>
      );
    // see if text matches 3 dashes or more
    // if so, render a horizontal rule
    if (text.match(/_{3,}/)) {
      return <span key={key} className={styles.horizontalLine} />;
    }
    return <span key={key}>{text}</span>;
  });
};

const TextRunParser = ({ data }) => {
  if (!data) return null;

  // apply text styles that can be found in data.textStyle

  // const { red, green, blue } =
  //   data?.textStyle?.foregroundColor?.color?.rgbColor || {};
  // const textStyle = {};

  return (
    <span
      className={cx({
        [styles.bold]: data.textStyle.bold,
        [styles.underline]: data.textStyle.underline,
        [styles.italic]: data.textStyle.italic,
      })}
      // style={textStyle}
    >
      <MaybeLink link={data?.textStyle?.link?.url}>
        <LineBreakManager element={data.content} />
      </MaybeLink>
    </span>
  );
};

const GDPETextRun = ({ paragraphElement }) => {
  return <TextRunParser data={paragraphElement.textRun} />;
};

export default GDPETextRun;
