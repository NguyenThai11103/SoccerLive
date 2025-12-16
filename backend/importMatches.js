/**
 * Import matches from crawler JSON to database
 * Run: node importMatches.js
 */

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import db from "./src/models/index.js";

const { Match } = db;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Parse match time to Date object
 */
function parseMatchTime(matchTime, crawledAt) {
  if (!matchTime) return new Date(crawledAt);

  try {
    // matchTime format: "HH:MM"
    // crawledAt format: "2025-12-16T15:19:34.133931"
    const crawledDate = new Date(crawledAt);
    const [hours, minutes] = matchTime.split(":").map(Number);

    crawledDate.setHours(hours, minutes, 0, 0);

    return crawledDate;
  } catch (error) {
    return new Date(crawledAt);
  }
}

/**
 * Map crawler status to database status
 */
function mapStatus(crawlerStatus) {
  if (!crawlerStatus) return "SCHEDULED";

  const statusMap = {
    "Đang diễn ra": "LIVE",
    "Sắp diễn ra": "SCHEDULED",
    "Đã kết thúc": "FINISHED",
    Live: "LIVE",
    live: "LIVE",
  };

  return statusMap[crawlerStatus] || "SCHEDULED";
}

/**
 * Import matches from JSON file
 */
async function importMatches() {
  try {
    console.log("🚀 Starting match import...\n");

    // Read JSON file
    // Read JSON file from crawler directory
    const jsonPath = path.join(__dirname, "../crawler/matches.json");
    const jsonData = await fs.readFile(jsonPath, "utf-8");
    const crawledMatches = JSON.parse(jsonData);

    console.log(`📊 Found ${crawledMatches.length} matches in JSON\n`);

    let imported = 0;
    let skipped = 0;
    let errors = 0;

    for (const crawledMatch of crawledMatches) {
      try {
        // Skip if no match_id
        if (!crawledMatch.match_id) {
          skipped++;
          continue;
        }

        // Use pre-parsed team names from crawler
        const homeTeam = crawledMatch.home_team?.trim();
        const awayTeam = crawledMatch.away_team?.trim();

        // Skip if teams are empty
        if (!homeTeam || !awayTeam) {
          skipped++;
          continue;
        }

        // Parse start time
        const startTime = parseMatchTime(
          crawledMatch.match_time,
          crawledMatch.crawled_at
        );

        // Map crawler status to database status
        const status = mapStatus(crawledMatch.status);

        // Check if match already exists (by streamUrl)
        const existing = await Match.findOne({
          where: { streamUrl: crawledMatch.url },
        });

        if (existing) {
          skipped++;
          continue;
        }

        // Create match
        await Match.create({
          homeTeam,
          awayTeam,
          homeScore: 0,
          awayScore: 0,
          status,
          startTime,
          streamKey: crawledMatch.match_id,
          streamUrl: crawledMatch.url,
          league: "International", // Default league
          viewerCount: 0,
        });

        imported++;
        console.log(
          `✅ Imported: ${homeTeam} vs ${awayTeam} (${crawledMatch.match_time}) - ${status}`
        );
      } catch (error) {
        errors++;
        console.error(
          `❌ Error importing match ${crawledMatch.match_id}:`,
          error.message
        );
      }
    }

    console.log(`\n📊 Import Summary:`);
    console.log(`   ✅ Imported: ${imported}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   ❌ Errors: ${errors}`);
    console.log(`\n✅ Import completed!`);
  } catch (error) {
    console.error("❌ Import failed:", error);
    throw error;
  }
}

// Run import
importMatches()
  .then(() => {
    console.log("\n🎉 All done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Fatal error:", error);
    process.exit(1);
  });
