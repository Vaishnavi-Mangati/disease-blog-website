export default function ListBlock({ items, style }) {
  const ListTag = style === 'ordered' ? 'ol' : 'ul';

  return (
    <ListTag className="list-disc list-inside my-3 space-y-1">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ListTag>
  );
}
