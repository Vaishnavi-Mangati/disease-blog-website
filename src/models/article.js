import mongoose, {Schema, model} from "mongoose";

const ContentBlockSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['heading', 'paragraph', 'image', 'quote', 'list'],
        required: true,
    },
    level: Number,
    text: String,
    url: String,
    caotion: String,
    alt: String,
    style: {type: String, enum: ['ordered', 'unordered']},
    items: [String],  
}, {_id: false}
);

const ArticleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: {type: String, required: true, unique: true},
    tags: [String],
    author: String,
    cover_image_url: String,
    published: Boolean,
    created_at: { type: Date, default: Date.now },
    content_blocks: [ContentBlockSchema],
});

export default mongoose.models.Article || model("Article", ArticleSchema);