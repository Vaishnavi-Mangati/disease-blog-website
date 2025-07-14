"use client";
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default function PublisherPage() {
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [author, setAuthor] = useState('');
    const [tags, setTags] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const [blocks, setBlocks] = useState([]);
    const [newType, setNewType] = useState('paragraph');

    const onDragEnd = (result) => {
        if (!result.destination) return;
        const reordered = Array.from(blocks);
        const [moved] = reordered.splice(result.source.index, 1);
        reordered.splice(result.destination.index, 0, moved);
        setBlocks(reordered);
    };

    const addBlock = () => {
        const id = `block-${Date.now()}`;
        let content = '';
        if (newType === 'list') content = '[]';
        setBlocks([...blocks, { id, type: newType, content }]);
    };

    const updateBlock = (id, value) => {
        setBlocks(blocks.map(b => b.id === id ? { ...b, content: value } : b));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            title,
            slug,
            author,
            tags: tags.split(',').map(t => t.trim()),
            cover_image_url: coverImage,
            published: true,
            content_blocks: blocks.map(b => {
                switch (b.type) {
                    case 'heading':
                        return { type: 'heading', level: 2, text: b.content };
                    case 'paragraph':
                        return { type: 'paragraph', text: b.content };
                    case 'quote':
                        return { type: 'quote', text: b.content };
                    case 'image':
                        // expecting JSON: { url, alt, caption }
                        return { type: 'image', ...JSON.parse(b.content) };
                    case 'list':
                        return { type: 'list', style: 'unordered', items: JSON.parse(b.content) };
                    default:
                        return null;
                }
            }).filter(Boolean)
        };

        const res = await fetch('/api/articles', {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
        });
        const data = await res.json();
        alert(data.message || JSON.stringify(data));
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4">Publish New Article</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block">Title</label>
                    <input value={title} onChange={e => setTitle(e.target.value)} className="w-full border rounded p-2" />
                </div>
                <div>
                    <label>Slug</label>
                    <input value={slug} onChange={e => setSlug(e.target.value)} className="w-full border rounded p-2" />
                </div>
                <div>
                    <label>Author</label>
                    <input value={author} onChange={e => setAuthor(e.target.value)} className="w-full border rounded p-2" />
                </div>
                <div>
                    <label>Tags (comma-separated)</label>
                    <input value={tags} onChange={e => setTags(e.target.value)} className="w-full border rounded p-2" />
                </div>
                <div>
                    <label>Cover Image URL</label>
                    <input value={coverImage} onChange={e => setCoverImage(e.target.value)} className="w-full border rounded p-2" />
                </div>

                {/* Block controls */}
                <div className="flex items-center space-x-2">
                    <select value={newType} onChange={e => setNewType(e.target.value)} className="border rounded p-2">
                        <option value="heading">Heading</option>
                        <option value="paragraph">Paragraph</option>
                        <option value="quote">Quote</option>
                        <option value="image">Image (JSON)</option>
                        <option value="list">List (JSON array)</option>
                    </select>
                    <button type="button" onClick={addBlock} className="bg-blue-600 text-white px-4 py-2 rounded">
                        Add Block
                    </button>
                </div>

                {/* Draggable blocks list */}
                 <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="blocks">
            {provided => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-4">
                {blocks.map((block, index) => (
                  <Draggable key={block.id} draggableId={block.id} index={index}>
                    {prov => (
                      <div
                        ref={prov.innerRef}
                        {...prov.draggableProps}
                        className="border rounded p-4 bg-gray-900"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <strong>{block.type.toUpperCase()}</strong>
                          <span {...prov.dragHandleProps} className="cursor-move">⇅</span>
                        </div>
                        <textarea
                          rows={block.type === 'paragraph' ? 4 : 2}
                          value={block.content}
                          onChange={e => updateBlock(block.id, e.target.value)}
                          className="w-full border rounded p-2"
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

                <button type="submit" className="bg-green-600 text-white px-6 py-3 rounded mt-4">
                    Publish
                </button>
            </form>
        </div>
    );
}
