import ContentRenderer from '@/components/ArticleBlocks/ContentRenderer';

export default async function ArticlePage({ params }) {
  const res = await fetch(`http://localhost:3000/api/articles/${params.slug}`, {
    cache: 'no-store'
  });

  const article = await res.json();

  return (
    <div className="max-w-3xl ml-[12%] p-6  flex-col text-left items-start">
      <h1 className="text-4xl font-bold mb-2">{article.title}</h1>
      <p className="text-sm text-gray-500 mb-6">By {article.author}</p>
      <ContentRenderer contentBlocks={article.content_blocks} />
    </div>
  );
}
