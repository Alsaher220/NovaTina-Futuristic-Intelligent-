// ✅ NovaTina Backend Server

const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// 🔐 Initialize OpenAI with secret key from .env
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ Basic health check route
app.get("/", (req, res) => {
  res.send("✅ NovaTina backend is running!");
});

// 🧠 AI chat route
app.post("/api/chat", async (req, res) => {
  const { systemPrompt, messages } = req.body;

  try {
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-4", // You can change to "gpt-3.5-turbo" if needed
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
    });

    // ✅ Send back AI message
    res.json(chatResponse);
  } catch (error) {
    console.error("❌ OpenAI API Error:", error);
    res.status(500).json({ error: "AI failed to respond. Try again later." });
  }
});

// 🚀 Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 NovaTina backend is live on port ${PORT}`);
});
