'use client';

import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { nanoid } from 'nanoid';

const blockTypes = ['paragraph', 'heading', 'quote', 'image', 'list'];

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
        rows={block.type === 'paragraph' ? 4 : 2}
        value={block.content}
        onChange={(e) => updateBlock(id, e.target.value)}
        placeholder={`Enter content for ${block.type}`}
      />
    </div>
  );
}

export default function PublisherPage() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [author, setAuthor] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);

  const [blockType, setBlockType] = useState('paragraph');
  const [blocks, setBlocks] = useState([]);

  const [faq, setFaq] = useState([{ question: '', answer: '' }]);

  const sensors = useSensors(useSensor(PointerSensor));

  const addBlock = () => {
    setBlocks((prev) => [
      ...prev,
      { id: nanoid(), type: blockType, content: '' }
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
  }

  const handleAddFaq = () => {
    setFaq([...faq, { question: '', answer: '' }]);
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

  const handleSubmit = async () => {
    const content_blocks = blocks.map((b) => {
      if (b.type === 'list') {
        return {
          type: 'list',
          style: 'unordered',
          items: b.content.split('\n').map((item) => item.trim()).filter(Boolean)
        };
      } else if (b.type === 'image') {
        try {
          const obj = JSON.parse(b.content);
          return {
            type: 'image',
            url: obj.url,
            caption: obj.caption || '',
            alt: obj.alt || ''
          };
        } catch {
          alert('Invalid image JSON format.');
          return null;
        }
      } else {
        return {
          type: b.type,
          ...(b.type === 'heading' ? { level: 1 } : {}),
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

    const res = await fetch('/api/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const json = await res.json();
    if (res.ok) {
      alert('Article created!');
    } else {
      alert(`Error: ${json.message}`);
    }
  };

  return (
    <div className="absolute inset-0 bg-gradient-to-b from-[#EBCCDF] to-white w-full h-auto ">
      <div className="relative w-screen h-[200px]  flex justify-center">

        <div className="relative z-10 flex justify-content-start items-center h-full max-w-2xl">
          <h1 className="text-4xl font-bold text-black ">📝 Create New Article</h1>
        </div>
      </div>

      <div className="absolute left-1/2 transform -translate-x-1/2 w-full max-w-2xl flex flex-col items-center">
        <div className='flex justify-center gap-6'>
          <fieldset className="min-w-[322px] border rounded mb-2 p-1">
            <legend className="px-2 text-gray-700">Title</legend>
            <input
              placeholder="Eg: Health Blog"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border-0"
            />
          </fieldset>

          <fieldset className="min-w-[322px] border rounded mb-2 p-1">
            <legend className="px-2 text-gray-700">Author</legend>
            <input
              placeholder="Eg: xyz"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full"
            />
          </fieldset>
        </div>
        <input
          placeholder="Slug (url-path)"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
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
            setTags(e.target.value.split(',').map((t) => t.trim()));
          }}
          className="w-full border p-2 rounded mb-4"
        />




        <div className="flex items-center gap-4 mb-4">
          <select
            value={blockType}
            onChange={(e) => setBlockType(e.target.value)}
            className="border p-2 rounded "
          >
            {blockTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <button
            className="bg-[#d26fab] text-white px-4 py-2 rounded hover:bg-[#cc559c]"
            onClick={addBlock}
          >
            ➕ Add Block
          </button>
        </div>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} className="bg-black-100 text-black-900">
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
          <h2 className="text-2xl font-bold mb-4">Add FAQs</h2>

          {faq.map((item, index) => (
            <div key={index} className="space-y-2 border p-4 rounded-md bg-gray-50 min-w-xl">
              <div className='flex flex-row'>
                <input
                  type="text"
                  placeholder="Question"
                  value={item.question}
                  onChange={(e) => handleChange(index, 'question', e.target.value)}
                  className="w-full border p-2 rounded"
                  required
                />
                <button
                  className='ml-2'
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
                onChange={(e) => handleChange(index, 'answer', e.target.value)}
                className="w-full border p-2 rounded"
                rows={3}
                required
              />
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddFaq}
            className="bg-[#d26fab] text-white px-4 py-2 rounded hover:bg-[#cc559c]"
          >
            Add Another FAQ
          </button>


        </form>

        <button
          onClick={handleSubmit}
          className="mt-6 bg-green-600 text-white px-6 py-2 rounded"
        >
          ✅ Submit Article
        </button>
      </div>
    </div>
  );
}