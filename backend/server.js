// backend/server.js
const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ 
    status: "✅ NovaTina backend is running!",
    timestamp: new Date().toISOString()
  });
});

// Chat endpoint
app.post("/api/chat", async (req, res) => {
  console.log("📩 Received chat request");
  
  const { systemPrompt, messages } = req.body;

  // Validation
  if (!systemPrompt || !messages) {
    console.error("❌ Missing systemPrompt or messages");
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (!process.env.OPENAI_API_KEY) {
    console.error("❌ OpenAI API key not configured");
    return res.status(500).json({ error: "API key not configured" });
  }

  try {
    console.log("🤖 Calling OpenAI API...");
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    console.log("✅ OpenAI responded successfully");
    res.json(response);
    
  } catch (error) {
    console.error("❌ OpenAI API Error:", error.message);
    
    if (error.status === 401) {
      res.status(401).json({ error: "Invalid API key" });
    } else if (error.status === 429) {
      res.status(429).json({ error: "Rate limit exceeded" });
    } else {
      res.status(500).json({ 
        error: "AI failed to respond",
        details: error.message 
      });
    }
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔑 API Key configured: ${process.env.OPENAI_API_KEY ? 'Yes' : 'No'}`);
});
