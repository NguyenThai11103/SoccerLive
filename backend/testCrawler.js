/**
 * Test script for match crawler
 * Run: node testCrawler.js
 */

import { testCrawler } from "./src/utils/matchCrawler.js";

console.log("🚀 Starting Match Crawler Test...\n");

testCrawler()
  .then((matches) => {
    console.log("\n✅ Crawler test completed successfully!");
    console.log(`\n📊 Summary: Found ${matches.length} matches`);
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Crawler test failed:", error.message);
    process.exit(1);
  });
