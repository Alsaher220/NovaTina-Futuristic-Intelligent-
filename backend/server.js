const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ OpenAI API Client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/chat", async (req, res) => {
  const { systemPrompt, messages } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
    });

    res.json({ choices: [{ message: { content: response.choices[0].message.content } }] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error talking to AI" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
