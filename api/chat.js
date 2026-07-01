import OpenAI from "openai";
import fs from "node:fs";
import path from "node:path";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    if (req.body && typeof req.body === "object") {
      resolve(req.body);
      return;
    }

    let raw = "";
    req.on("data", chunk => {
      raw += chunk;
    });

    req.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (error) {
        reject(error);
      }
    });

    req.on("error", reject);
  });
}

function loadPortfolioContext() {
  const filePath = path.join(process.cwd(), "portfolio-context.json");
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({
      error: "OPENAI_API_KEY is missing in Vercel Environment Variables."
    });
  }

  try {
    const body = await readJsonBody(req);
    const message = String(body.message || "").trim();

    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    if (message.length > 1200) {
      return res.status(400).json({ error: "Message is too long." });
    }

    const portfolio = loadPortfolioContext();

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5.4-mini",
      reasoning: { effort: "low" },
      input: [
        {
          role: "developer",
          content: `You are Mohan Savendra Tikkireddy's live portfolio assistant.

Use ONLY the verified portfolio context below.
Never invent facts.
Never add employers, metrics, education, visa/work authorization details, certifications, or claims unless they appear in the context.
If a detail is missing, say: "I do not have that detail in Mohan's portfolio context."
Keep answers human, specific, and concise.
For recruiters, answer in business-impact language.
For engineers, answer with architecture, stack, and production details.

Verified portfolio context:
${JSON.stringify(portfolio, null, 2)}`
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    return res.status(200).json({
      answer: response.output_text || "I do not have that detail in Mohan's portfolio context."
    });
  } catch (error) {
    console.error("Portfolio assistant error:", error);
    return res.status(500).json({
      error: "Assistant failed to respond."
    });
  }
}
