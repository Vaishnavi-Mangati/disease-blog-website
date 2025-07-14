import { connectToDB } from "@/lib/mongodb";
import Article from "@/models/article";


export async function POST(req) {
    const data = await req.json();
    try {
        const { client } = await connectToDB();
        const db = client.db();
        await db.collection('articles').insertOne(data);

        return new Response(JSON.stringify({ message: 'Article saved'}), { status: 201 });
    } catch (error) {
        console.error("Error saving article:", error);
        return new Response(JSON.stringify({ message: 'Error saving article', error: error.message }), { status: 400 });
    }
}

export async function GET(req, { params }) {
    const { slug } = params;
    try {
        const { client } = await connectToDB();
        const db = client.db();
        const article = await db.collection('articles').findOne({ slug });

        if (!article) {
            return new Response(JSON.stringify({ message: 'Article not found' }), { status: 404 });
        }

        return new Response(JSON.stringify(article), { status: 200 });
    } catch (error) {
        console.error("Error fetching article:", error);
        return new Response(JSON.stringify({ message: 'Error fetching article', error: error.message }), { status: 500 });
    }
}


