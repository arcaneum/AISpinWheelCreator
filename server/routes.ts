import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertWheelSchema } from "@shared/schema";
import { ZodError } from "zod";
import fetch from "node-fetch";

// Initialize Groq client with API key from environment
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

async function generateOptionsWithAI(prompt: string): Promise<string[]> {
  try {
    if (!GROQ_API_KEY) {
      throw new Error("Groq API key not configured");
    }

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768",
        messages: [{
          role: "system",
          content: "You are a helpful assistant that generates wheel options based on user prompts. Generate a list of 6-8 relevant options. Each option should be short (1-3 words maximum) to fit nicely in a wheel segment. Keep each option concise and clear. Use abbreviated forms when possible (e.g., 'A#m' for 'A Sharp Minor', 'Dm' for 'D Minor'). Never generate options longer than 15 characters."
        }, {
          role: "user",
          content: `Generate wheel options for: ${prompt}. These need to be specific to the user's request, for example if they ask for '5 popular Indian dishes', generate actual Indian dish names (keeping them short like 'Dosa' instead of 'Masala Dosa'), or if they ask for 'music scales', use short notation like 'C#m' instead of 'C Sharp Minor'.`
        }],
        max_tokens: 150,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error("Failed to generate options from Groq API");
    }

    const data = await response.json() as { choices: Array<{ message: { content: string } }> };
    const content = data.choices[0].message.content;
    const options = content.split('\n')
      .map((line: string) => line.trim())
      .filter((line: string) => line.length > 0 && line.length < 15) // Filter out long options
      .map((line: string) => line.replace(/^\d+\.\s*/, '')); // Remove numbering

    return options;
  } catch (error) {
    console.error("Error generating options:", error);
    throw error;
  }
}

export async function registerRoutes(app: Express) {
  app.get("/api/wheels", async (_req, res) => {
    const wheels = await storage.getAllWheels();
    res.json(wheels);
  });

  app.get("/api/wheels/:id", async (req, res) => {
    const wheel = await storage.getWheel(Number(req.params.id));
    if (!wheel) {
      res.status(404).json({ message: "Wheel not found" });
      return;
    }
    res.json(wheel);
  });

  app.post("/api/wheels", async (req, res) => {
    try {
      const wheelData = insertWheelSchema.parse(req.body);
      const wheel = await storage.createWheel(wheelData);
      res.status(201).json(wheel);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid wheel data", errors: error.errors });
        return;
      }
      throw error;
    }
  });

  app.delete("/api/wheels/:id", async (req, res) => {
    await storage.deleteWheel(Number(req.params.id));
    res.status(204).send();
  });

  // New route for AI-generated options
  app.post("/api/generate-options", async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt) {
        res.status(400).json({ message: "Prompt is required" });
        return;
      }

      const options = await generateOptionsWithAI(prompt);
      res.json({ options });
    } catch (error) {
      console.error("Error generating options:", error);
      res.status(500).json({ 
        message: "Failed to generate options",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  return createServer(app);
}