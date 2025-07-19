export default function ListBlock({ items, style }) {
  const ListTag = style === 'ordered' ? 'ol' : 'ul';

  return (
    <ListTag className="list-disc list-inside my-3 space-y-1 ml-10">
      {items.map((item, i) => {
          const [boldPart, restPart] = item.split('|');
          return (
        <li key={i} className="my-5">
          <strong className="font-serif leading-7 text-black text-xl">{boldPart}</strong>
          {restPart && <span className="font-serif leading-7 text-gray-900 my-7 text-xl">{restPart}</span> }
        </li>

          ) })}
    </ListTag>
  );
}
