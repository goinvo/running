import React from "react";

import GoogleDocParagraph from "./structuralElement/GoogleDocParagraph";
import GoogleDocSectionBreak from "./structuralElement/GoogleDocSectionBreak";
import GoogleDocTable from "./structuralElement/GoogleDocTable";
import GoogleDocTableOfContents from "./structuralElement/GoogleDocTableOfContents";
import ParsedList from "./structuralElement/ParsedList";

import styles from "./GoogleDocFormatter.module.scss";

const GoogleDocFormatter = ({ rawData }) => {
  const bodyContent = rawData?.body?.content;
  // One of four types of structural element:
  // Paragraph, Table, Table of Contents, or SectionBreak

  // Due to the nature of the way this is structured, if any paragraph is part of a 'list', we're going to remove it and group it as one

  let activeList = [];
  let activeBulletStyle = null;

  const structuralElements = bodyContent?.map((item, key) => {
    const { paragraph, table, tableOfContents, sectionBreak } = item;
    let listElement = null;

    if (paragraph) {
      if (paragraph.bullet) {
        if (
          activeBulletStyle === paragraph.bullet.listId ||
          activeBulletStyle === null
        ) {
          activeList.push(paragraph);
          activeBulletStyle = paragraph.bullet.listId;
          return null;
        } else {
          // We've reached a new type of list
          const list = [...activeList];
          activeList = [paragraph];
          activeBulletStyle = paragraph.bullet.listId;
          listElement = (
            <ParsedList list={list} rawData={rawData} key={key + "list"} />
          );
        }
      }

      // not a list, but previously there was a list
      if (listElement === null && activeList.length > 0) {
        const list = [...activeList];
        activeList = [];
        listElement = (
          <ParsedList key={key + "list"} rawData={rawData} list={list} />
        );
      }

      return (
        <>
          {listElement ? listElement : null}
          {activeList.length === 0 && (
            <GoogleDocParagraph
              key={key}
              paragraphs={paragraph}
              rawData={rawData}
            />
          )}
        </>
      );
    }

    if (table) {
      return <GoogleDocTable key={key} table={table} rawData={rawData} />;
    } else if (tableOfContents) {
      return (
        <GoogleDocTableOfContents key={key} tableOfContents={tableOfContents} />
      );
    } else {
      return <GoogleDocSectionBreak key={key} sectionBreak={sectionBreak} />;
    }
  });

  // We do this check because if the last item in the list is a list, we need to render it
  if (activeList.length > 0) {
    const list = [...activeList];
    structuralElements.push(
      <ParsedList key={structuralElements.length} list={list} />
    );
  }

  return <span className={styles.googleParser}>{structuralElements}</span>;
};

export default GoogleDocFormatter;
