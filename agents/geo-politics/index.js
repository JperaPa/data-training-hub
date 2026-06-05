import { fetchXPosts } from "./sources/x-monitor.js";
import { classifyPost } from "./analysis/classify.js";
import { extractSignals } from "./analysis/extract-signals.js";
import { scoreRisk } from "./analysis/risk-score.js";
import { writeDigest } from "./render/digest.js";

export async function run(context) {
  const { date, logger } = context;

  logger.info("Running Geo-Politics Intelligence Agent");

  const accounts = [
    "USTreasury",
    "FinCEN",
    "FATFNews",
    "TheJusticeDept"
  ];

  let allSignals = [];

  for (const acc of accounts) {
    const posts = await fetchXPosts(acc);

    for (const post of posts) {
      const classification = await classifyPost(post.text);
      const signals = await extractSignals(post.text);
      const risk = scoreRisk(classification);

      allSignals.push({
        ...signals,
        classification,
        risk,
        source: post.source,
        scrapedAt: post.scrapedAt
      });
    }
  }

  const paths = writeDigest(date, allSignals);

  return {
    geoPath: paths.jsonPath
  };
}
