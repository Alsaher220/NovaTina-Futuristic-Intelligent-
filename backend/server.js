// backend/server.js
const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Make sure this key is set in Render settings
});

app.get("/", (req, res) => {
  res.send("✅ NovaTina backend is running!");
});

app.post("/api/chat", async (req, res) => {
  const { systemPrompt, messages } = req.body;

  try {
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Use GPT-3.5 for better compatibility
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
    });

    res.json(chatResponse);
  } catch (error) {
    console.error("❌ OpenAI Error:", error);
    res.status(500).json({ error: "AI failed to respond" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
