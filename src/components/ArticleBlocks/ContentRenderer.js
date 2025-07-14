import HeadingBlock from './HeadingBlock';
import ParagraphBlock from './ParagraphBlock';
import QuoteBlock from './QuoteBlock';
import ImageBlock from './ImageBlock';
import ListBlock from './ListBlock';

export default function ContentRenderer({ contentBlocks }) {
  return contentBlocks.map((block, index) => {
    switch (block.type) {
      case 'heading':
        return <HeadingBlock key={index} level={block.level} text={block.text} />;
      case 'paragraph':
        return <ParagraphBlock key={index} text={block.text} />;
      case 'quote':
        return <QuoteBlock key={index} text={block.text} />;
      case 'image':
        return <ImageBlock key={index} {...block} />;
      case 'list':
        return <ListBlock key={index} items={block.items} style={block.style} />;
      default:
        return null;
    }
  });
}
