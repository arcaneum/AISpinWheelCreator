import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertWheelSchema } from "@shared/schema";
import { ZodError } from "zod";

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

  return createServer(app);
}
