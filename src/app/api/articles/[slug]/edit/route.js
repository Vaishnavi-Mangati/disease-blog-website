import { connectToDB } from "@/lib/mongodb";

export async function POST(req, { params }) {
  const data = await req.json();
  const { slug } = params;
  try {
    const { client } = await connectToDB();
    const db = client.db();
    const result = await db.collection("articles").updateOne(
      { slug },
      { $set: data }
    );
    if (result.matchedCount === 0) {
      return new Response(JSON.stringify({ message: "Article not found" }), { status: 404 });
    }
    return new Response(JSON.stringify({ message: "Article updated" }), { status: 200 });
  } catch (error) {
    console.error("Error updating article:", error);
    return new Response(JSON.stringify({ message: "Error updating article", error: error.message }), { status: 400 });
  }
}
