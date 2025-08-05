const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // ✅ Comes from Render Environment, not .env file
});

app.get("/", (req, res) => {
  res.send("✅ NovaTina backend is running!");
});

app.post("/api/chat", async (req, res) => {
  const { systemPrompt, messages } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Use gpt-4 if your OpenAI plan supports it
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
    });

    res.json(response);
  } catch (err) {
    console.error("❌ AI Error:", err);
    res.status(500).json({ error: "AI failed to respond" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
