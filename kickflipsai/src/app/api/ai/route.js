import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  console.log("✅ /api/ai route hit");

  try {
    const body = await req.json();
    console.log("🧠 Request body:", body);

    const { query } = body;
    if (!query) {
      console.log("❌ Missing query");
      return new Response(
        JSON.stringify({ text: "Missing query" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error("❌ GEMINI_API_KEY missing in .env.local");
      return new Response(
        JSON.stringify({ text: "Missing Gemini API key" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log("🔑 Using Gemini API key:", process.env.GEMINI_API_KEY ? "✅ Loaded" : "❌ Missing");

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    console.log("🚀 Sending query to Gemini:", query);
    const result = await model.generateContent(
      `Provide sneaker resale insights for: ${query}. I want a very brief summary formatted neatly seperated by new and used. 
      I want each category to have information such as, average hold time, resale price, and a good price to buy and still make a decent roi`
    );

    console.log("✅ Gemini result received");
    const text = result.response.text();

    return new Response(
      JSON.stringify({ text }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("🔥 AI route error:", err);
    return new Response(
      JSON.stringify({ text: "Error fetching AI response.", error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
