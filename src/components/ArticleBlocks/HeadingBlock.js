export default function HeadingBlock({ level, text }) {
  // const Tag = `h${level}`; // h1, h2, h3...
  const Tag = `h1`;
  return <Tag className={` text-3xl font-bold my-4`}>{text}</Tag>;
}


// text-${level === 1 ? '8xl' : '8xl'} text-xl 