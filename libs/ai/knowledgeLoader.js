import fs from "fs";
import path from "path";

const KNOWLEDGE_DIR = path.join(process.cwd(), "ideas/knowledge");

export function loadKnowledge() {
  const files = walk(KNOWLEDGE_DIR);
  const docs = files.map(loadFile);
  return chunkDocuments(docs);
}

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else if (file.endsWith(".md") || file.endsWith(".txt")) {
      results.push(fullPath);
    }
  });

  return results;
}

function loadFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  return {
    id: filePath,
    content,
  };
}

function chunkDocuments(docs, chunkSize = 800) {
  const chunks = [];

  docs.forEach((doc) => {
    const words = doc.content.split(/\s+/);
    let buffer = [];

    words.forEach((word) => {
      buffer.push(word);
      if (buffer.join(" ").length >= chunkSize) {
        chunks.push({
          source: doc.id,
          text: buffer.join(" "),
        });
        buffer = [];
      }
    });

    if (buffer.length > 0) {
      chunks.push({
        source: doc.id,
        text: buffer.join(" "),
      });
    }
  });

  return chunks;
}
