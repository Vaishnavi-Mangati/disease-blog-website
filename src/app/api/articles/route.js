import { connectToDB } from "@/lib/mongodb";
import Article from "@/models/article";



export async function POST(req) {
    const data = await req.json();
    try {
        const { client } = await connectToDB();
        const db = client.db();
        await db.collection('articles').insertOne(data);

        // await connectToDB();
        // const newArticle = new Article(data);        
        // const saved = await newArticle.save();

        return new Response(JSON.stringify({ message: 'Article saved' }), { status: 201 });
    } catch (error) {
        console.error("Error saving article:", error);
        return new Response(JSON.stringify({ message: 'Error saving article', error: error.message }), { status: 400 });
    }
}



//testing git

// const client = await connectToDB();

//     const article = {
//         ...data,
//         created_at : new Date()
//     };

//     try{
//         const result = 
//     } catch(error) {

//     } finally {

//     }