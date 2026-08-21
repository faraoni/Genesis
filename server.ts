import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let aiClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Health Check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "Embryo3D Educational API" });
  });

  // API Route: Gemini Embryology Assistant
  app.post("/api/embryo-ai/ask", async (req, res) => {
    try {
      const { question, stageContext, currentTopic } = req.body;

      if (!question || typeof question !== "string") {
        return res.status(400).json({ error: "A valid question string is required." });
      }

      const ai = getGenAI();
      if (!ai) {
        // Provide rich fallback medical embryology response if API key is not configured
        return res.json({
          answer: `[Embryology Reference Database]\nRegarding "${question}":\n\nDuring embryonic development (${stageContext?.name || "current stage"}), key developmental events are regulated by master morphogen gradients (SHH, Wnt, BMP, FGF, Retinoic Acid). For specific Carnegie stages and developmental mechanisms, review the detailed anatomical hotspots, fate map lineages, and clinical correlates in the atlas panels.`,
          isFallback: true,
        });
      }

      const systemPrompt = `You are Embryo3D Tutor, an expert professor of Human Embryology, Teratology, and Developmental Anatomy for medical and biomedical students.
You provide clear, accurate, pedagogically structured explanations with:
1. Developmental timeline and Carnegie stage correlation
2. Molecular signaling & morphogen mechanisms (e.g., Sonic Hedgehog, Wnt/β-catenin, BMP-4, FGF-8, Retinoic Acid, Homeobox HOX genes)
3. Germ layer origin (Ectoderm, Mesoderm, Endoderm, Neural Crest)
4. Anatomical transformations (folding, rotation, septation, recanalization)
5. High-yield clinical correlates (congenital anomalies, teratogen windows, ultrasound diagnostic signs)

Keep responses organized with concise headings and bullet points.
Context of currently viewed stage: ${JSON.stringify(stageContext || {})}
Current study topic: ${currentTopic || "General Embryology"}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: question,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
        },
      });

      res.json({
        answer: response.text || "No response generated.",
        isFallback: false,
      });
    } catch (err: any) {
      console.error("Gemini Embryo AI error:", err);
      res.status(500).json({
        error: "Failed to generate AI response",
        details: err?.message || "Internal server error",
      });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Embryo3D Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
