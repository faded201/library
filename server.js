import express from 'express';
import cors from 'cors';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Import the API handler (we'll need to compile the TS first)
const generateHandler = async (req, res) => {
  try {
    // For now, return a simple response
    res.json({
      chapter: "The story begins with a mysterious awakening...",
      chapterTitle: "Chapter 1: The Awakening",
      wordCount: 150,
      estimatedReadTime: 1,
      protagonist: "Quinn Talen",
      series: "My Vampire System",
      characterMemory: {
        traits: {
          personality: "determined, resourceful, evolving",
          appearance: "pale skin, sharp features, red eyes",
          goals: "power, survival, dominance"
        },
        relationships: {},
        events: ["Awakened with vampire powers"],
        worldState: { timeOfDay: "Night", location: "Modern Earth" }
      },
      aiModelUsed: "fallback"
    });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// API Routes
app.post('/api/generate', generateHandler);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`API Server running on port ${PORT}`);
});