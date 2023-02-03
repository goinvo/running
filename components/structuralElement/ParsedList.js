import React from "react";
import GoogleDocParagraph from "./GoogleDocParagraph";

const ParsedList = ({ list, rawData }) => {
  const listData = rawData?.lists;

  // Render each paragraph element as a list item
  const listItems = list.map((item, key) => {
    return (
      <li key={key}>
        <GoogleDocParagraph paragraphs={item} />
      </li>
    );
  });

  // TODO: given a list of nesting levels, return an object that represents the nesting
  // e.g:
  /*
  Nesting levels: 0, 0, 1, 1, 2, 1, 0, 0
  Should be: 
  0
  0
    1
    1
      2
    1
  0
  */

  // For now, just get level 0 data.
  const listType =
    listData?.[list[0]?.bullet?.listId]?.listProperties?.nestingLevels[0]
      .glyphType === "DECIMAL"
      ? "ol"
      : "ul";

  return <div>{React.createElement(listType, {}, listItems)}</div>;
};

export default ParsedList;
