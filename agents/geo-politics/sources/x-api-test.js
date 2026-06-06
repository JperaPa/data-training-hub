import "dotenv/config";
import fetch from "node-fetch";

const BEARER = process.env.X_BEARER_TOKEN;

if (!BEARER) {
  console.error("❌ Missing X_BEARER_TOKEN in .env");
  process.exit(1);
}

async function testXAPI() {
  console.log("🔍 Testing X API…");

  const url = "https://api.x.com/2/users/by/username/USTreasury";

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${BEARER}`
    }
  });

  const data = await res.json();
  console.log("📡 Response:");
  console.log(data);
}

testXAPI();
