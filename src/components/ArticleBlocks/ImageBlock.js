export default function ImageBlock({ url, alt, caption }) {
  return (
    <div className="my-4">
      <img src={url} alt={alt} className="w-full rounded-md" />
      {caption && <p className="text-sm text-center text-gray-500 mt-1">{caption}</p>}
    </div>
  );
}
