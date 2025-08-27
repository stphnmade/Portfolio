import fs from "fs/promises";
import path from "path";

export default async function handler(req, res) {
  try {
    const jsonPath =
      process.env.RESUME_JSON_PATH || path.join(process.cwd(), "resume.json");
    const raw = await fs.readFile(jsonPath, "utf8");
    const data = JSON.parse(raw);

    // Cache a bit (CDN/proxy friendly)
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    res.status(200).json(data);
  } catch (e) {
    console.error("Failed to read resume.json", e);
    res.status(500).json({ error: "Could not load resume.json" });
  }
}
