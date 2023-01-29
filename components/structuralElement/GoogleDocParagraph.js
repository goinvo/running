import GDPEInlineObjectElement from "../paragraph/GDPEInlineObjectElement";
import GDPETextRun from "../paragraph/GDPETextRun";

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
