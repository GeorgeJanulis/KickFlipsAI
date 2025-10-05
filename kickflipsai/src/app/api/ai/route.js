import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  console.log("✅ /api/ai route hit");

  try {
    const body = await req.json();
    console.log("🧠 Request body:", body);

    const { query, data: recentSalesData } = body;
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
        `You are a sneaker trading assistant. 
         I will provide you with data about recent sales for a specific sneaker. 
         Only use this data to give a very concise summary (2-3 sentences) about: 
         - average hold time
         - whether this shoe is a good investment for a reseller?
         - how much should I buy this shoe for to make a decent ROI based on these sales?
         - which sizes are worth more or less or do better than others
         Do not add historical info or colorways. 
         Make sure to distinguish between new and used
         Here is the data: ${JSON.stringify(recentSalesData)}
         Respond in plain text.`
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
