export default function HeadingBlock({ level, text }) {
  const Tag = `h${level}`; // h1, h2, h3...
  return <Tag className={`text-${level === 1 ? '3xl' : '2xl'} font-bold my-4`}>{text}</Tag>;
}
