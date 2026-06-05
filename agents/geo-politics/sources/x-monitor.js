import fetch from "node-fetch";
import * as cheerio from "cheerio";

/**
 * Fetch latest posts from a public X profile page.
 * Example: https://x.com/USTreasury
 */
export async function fetchXPosts(username) {
  const url = `https://x.com/${username}`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const html = await res.text();
    const $ = cheerio.load(html);

    const posts = [];

    $("article").each((i, el) => {
      const text = $(el).text().trim();
      if (text.length > 0) {
        posts.push({
          text,
          scrapedAt: new Date().toISOString(),
          source: `https://x.com/${username}`
        });
      }
    });

    return posts.slice(0, 10); // top 10 posts
  } catch (err) {
    console.error("X Monitor Error:", err);
    return [];
  }
}