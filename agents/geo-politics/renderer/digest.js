import fs from "fs";
import path from "path";

export function writeDigest(date, items) {
  const outDir = path.join("logs", "geo-politics");
  fs.mkdirSync(outDir, { recursive: true });

  const jsonPath = path.join(outDir, `${date}.json`);
  const mdPath = path.join(outDir, `${date}.md`);

  fs.writeFileSync(jsonPath, JSON.stringify(items, null, 2));
  
  const md = items.map(i => `
### ${i.classification} (Risk: ${i.risk})
**Summary:** ${i.summary}

**Why it matters:**  
${i.why_it_matters}

**Source:** ${i.source}
  `).join("\n\n");

  fs.writeFileSync(mdPath, md);

  return { jsonPath, mdPath };
}
