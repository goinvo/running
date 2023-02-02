import React from "react";
import GoogleDocParagraph from "./GoogleDocParagraph";

import styles from "../GoogleDocFormatter.module.scss";

const GoogleDocTable = ({ table, rawData }) => {
  // TODO: implement google doc table
  // return <div>Google Doc Table Placeholder{JSON.stringify(table)}</div>;

  const cellWidths = [];
  for (let i = 0; i < table.tableStyle.tableColumnProperties.length; i++) {
    cellWidths.push(
      table.tableStyle.tableColumnProperties[i]?.width?.magnitude ?? 1
    );
  }
  const totalWidth = cellWidths.reduce((a, b) => a + b, 0);
  const cellWidthPercentages = cellWidths.map((width) => {
    return (width / totalWidth) * 100;
  });

  const tableData = table.tableRows.map((tableRow, row) => {
    return (
      <tr key={"row" + row}>
        {tableRow.tableCells.map((tableCell, cell) => {
          return (
            <td
              key={"cell" + cell}
              style={{ width: `${cellWidthPercentages[cell]}%` }}
            >
              {tableCell.content.map((elem, k) => {
                return (
                  <React.Fragment key={"p" + k}>
                    {React.createElement(
                      `span`,
                      { className: styles.paragraph },
                      <GoogleDocParagraph paragraphs={elem.paragraph} />
                    )}
                  </React.Fragment>
                );
              })}
            </td>
          );
        })}
      </tr>
    );
  });

  return (
    <table className={styles.parsedTable}>
      <tbody>{tableData}</tbody>
    </table>
  );
};

export default GoogleDocTable;
