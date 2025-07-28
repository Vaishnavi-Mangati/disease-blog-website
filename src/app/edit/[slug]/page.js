"use client";

import { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { nanoid } from "nanoid";

const blockTypes = ["paragraph", "heading", "quote", "image", "list"];

function SortableItem({ id, block, updateBlock, removeBlock }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="border rounded p-4 bg-white shadow-sm my-2"
    >
      <div className="flex justify-between mb-2 text-black">
        <strong>{block.type.toUpperCase()}</strong>
        <button
          className="text-red-500 text-sm"
          onClick={() => removeBlock(id)}
        >
          ❌
        </button>
      </div>
      <textarea
        className="w-full border p-2 rounded text-black"
        rows={block.type === "paragraph" ? 4 : 2}
        value={block.content}
        onChange={(e) => updateBlock(id, e.target.value)}
        placeholder={`Enter content for ${block.type}`}
      />
    </div>
  );
}

export default function EditPage({ params }) {
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState(params.slug || "");
  const [author, setAuthor] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const [blockType, setBlockType] = useState("paragraph");
  const [blocks, setBlocks] = useState([]);
  const [faq, setFaq] = useState([{ question: "", answer: "" }]);

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    async function fetchArticle() {
      setLoading(true);
      const res = await fetch(`/api/articles/${params.slug}`);
      if (!res.ok) {
        alert("Failed to fetch article");
        setLoading(false);
        return;
      }
      const article = await res.json();
      setTitle(article.title || "");
      setSlug(article.slug || params.slug);
      setAuthor(article.author || "");
      setCoverImage(article.cover_image_url || "");
      setTags(article.tags || []);
      setTagInput((article.tags || []).join(", "));
      setFaq(article.faq && article.faq.length ? article.faq : [{ question: "", answer: "" }]);
      // Convert content_blocks to blocks format
      setBlocks(
        (article.content_blocks || []).map((b) => {
          if (b.type === "list") {
            return {
              id: nanoid(),
              type: "list",
              content: (b.items || []).join("\n")
            };
          } else if (b.type === "image") {
            return {
              id: nanoid(),
              type: "image",
              content: JSON.stringify({ url: b.url, caption: b.caption, alt: b.alt })
            };
          } else {
            return {
              id: nanoid(),
              type: b.type,
              content: b.text || ""
            };
          }
        })
      );
      setLoading(false);
    }
    fetchArticle();
  }, [params.slug]);

  const addBlock = () => {
    setBlocks((prev) => [
      ...prev,
      { id: nanoid(), type: blockType, content: "" }
    ]);
  };

  const handleChange = (index, field, value) => {
    const updatedFaq = [...faq];
    updatedFaq[index][field] = value;
    setFaq(updatedFaq);
  };

  const deleteFaq = (index) => {
    const updatedFaq = faq.filter((_, i) => i !== index);
    setFaq(updatedFaq);
  };

  const handleAddFaq = () => {
    setFaq([...faq, { question: "", answer: "" }]);
  };

  const updateBlock = (id, content) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, content } : b))
    );
  };

  const removeBlock = (id) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = blocks.findIndex((b) => b.id === active.id);
      const newIndex = blocks.findIndex((b) => b.id === over?.id);
      setBlocks((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const content_blocks = blocks.map((b) => {
      if (b.type === "list") {
        return {
          type: "list",
          style: "unordered",
          items: b.content.split("\n").map((item) => item.trim()).filter(Boolean)
        };
      } else if (b.type === "image") {
        try {
          const obj = JSON.parse(b.content);
          return {
            type: "image",
            url: obj.url,
            caption: obj.caption || "",
            alt: obj.alt || ""
          };
        } catch {
          alert("Invalid image JSON format.");
          return null;
        }
      } else {
        return {
          type: b.type,
          ...(b.type === "heading" ? { level: 1 } : {}),
          text: b.content
        };
      }
    }).filter(Boolean);

    const payload = {
      title,
      slug,
      tags,
      author,
      cover_image_url: coverImage,
      published: true,
      content_blocks,
      faq
    };

    const res = await fetch(`/api/articles/${slug}/edit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const json = await res.json();
    if (res.ok) {
      alert("Article updated!");
    } else {
      alert(`Error: ${json.message}`);
    }
  };

  if (loading) {
    return <div className="max-w-3xl mx-auto px-4 py-6">Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">✏️ Edit Article</h1>

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border p-2 rounded mb-2"
      />
      <input
        placeholder="Slug (url-path)"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        className="w-full border p-2 rounded mb-2"
        disabled
      />
      <input
        placeholder="Author"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        className="w-full border p-2 rounded mb-2"
      />
      <input
        placeholder="Cover Image URL"
        value={coverImage}
        onChange={(e) => setCoverImage(e.target.value)}
        className="w-full border p-2 rounded mb-2"
      />
      <input
        placeholder="Tags (comma-separated)"
        value={tagInput}
        onChange={(e) => {
          setTagInput(e.target.value);
          setTags(e.target.value.split(",").map((t) => t.trim()));
        }}
        className="w-full border p-2 rounded mb-4"
      />

      <div className="flex items-center gap-4 mb-4">
        <select
          value={blockType}
          onChange={(e) => setBlockType(e.target.value)}
          className="border p-2 rounded"
        >
          {blockTypes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={addBlock}
        >
          ➕ Add Block
        </button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} className="bg-black-100 tetx-black-900">
        <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
          {blocks.map((block) => (
            <SortableItem
              key={block.id}
              id={block.id}
              block={block}
              updateBlock={updateBlock}
              removeBlock={removeBlock}
            />
          ))}
        </SortableContext>
      </DndContext>

      <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4 p-6">
        <h2 className="text-2xl font-bold mb-4">Edit FAQs</h2>

        {faq.map((item, index) => (
          <div key={index} className="space-y-2 border p-4 rounded-md bg-gray-50">
            <div className='flex flex-row'>
              <input
                type="text"
                placeholder="Question"
                value={item.question}
                onChange={(e) => handleChange(index, "question", e.target.value)}
                className="w-full border p-2 rounded"
                required
              />
              <button
                className='ml-2'
                type="button"
                onClick={() => {
                  deleteFaq(index);
                }}
              >
                ❌
              </button>
            </div>

            <textarea
              placeholder="Answer"
              value={item.answer}
              onChange={(e) => handleChange(index, "answer", e.target.value)}
              className="w-full border p-2 rounded"
              rows={3}
              required
            />
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddFaq}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Another FAQ
        </button>

        <button
          type="submit"
          className="mt-6 bg-green-600 text-white px-6 py-2 rounded"
        >
          ✅ Update Article
        </button>
      </form>
    </div>
  );
}