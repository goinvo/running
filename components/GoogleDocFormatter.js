import React from "react";

import GoogleDocParagraph from "./structuralElement/GoogleDocParagraph";
import GoogleDocSectionBreak from "./structuralElement/GoogleDocSectionBreak";
import GoogleDocTable from "./structuralElement/GoogleDocTable";
import GoogleDocTableOfContents from "./structuralElement/GoogleDocTableOfContents";
import ParsedList from "./structuralElement/ParsedList";

import styles from "./GoogleDocFormatter.module.scss";
import cx from "classnames";

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

          // this is the last item - if we return null, it won't render
          if (key !== bodyContent.length - 1) {
            return null;
          }
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
          {(activeList.length === 0 &&
            !(key === bodyContent.length - 1 && paragraph.bullet !== undefined)) && (
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

  const rebuiltStructuralElements = [];
  let enterColumn = [];
  let isInColumn = false;
  let headerContent = "";
  for (let i = 0; i < structuralElements?.length; i++) {
    if (!isInColumn) {
      rebuiltStructuralElements.push(structuralElements[i]?.props?.children);
    } else {
      enterColumn.push(structuralElements[i]?.props?.children);
    }
    if (structuralElements[i] !== null) {
      for (let j = 0; j < structuralElements[i]?.props?.children?.length; j++) {
        if (structuralElements[i]?.props?.children[j] !== null) {
          const textContent =
            structuralElements[i]?.props?.children?.[j]?.props?.paragraphs
              ?.elements?.[0]?.textRun?.content;

          if (
            parseInt(textContent?.match(/\[(cols\: )(\d+)\]/)?.[2], 10) >= 2
          ) {
            isInColumn = true;
            headerContent = textContent
              .toLowerCase()
              .replace(/\[(cols\: )(\d+)\]/g, "")
              .replace(/\n/g, "")
              .trim()
              .split(" ")
              .join("-");
          } else if (
            structuralElements[i]?.props?.children?.[
              j
            ]?.props?.paragraphs?.elements?.[0]?.textRun?.content?.match(
              /_{3,}/
            )
          ) {
            isInColumn = false;
            const lastAdded = enterColumn.pop();
            rebuiltStructuralElements.push(
              <div
                className={cx(styles.column, {
                  [styles[headerContent]]: true,
                })}
              >
                {enterColumn}
              </div>
            );
            rebuiltStructuralElements.push(lastAdded);
            enterColumn = [];
          }
        }
      }
    }
  }

  return (
    <span className={styles.googleParser}>{rebuiltStructuralElements}</span>
  );
};

export default GoogleDocFormatter;
