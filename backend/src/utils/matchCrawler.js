/**
 * Crawler để lấy link trực tiếp bóng đá từ KeucolaTV
 * File: backend/src/utils/matchCrawler.js
 */

import axios from "axios";
import * as cheerio from "cheerio";

const BASE_URL = "https://keucolatv.live";
const MATCHES_URL = `${BASE_URL}/truc-tiep-bong-da`;

/**
 * Crawl danh sách trận đấu từ KeucolaTV
 * @returns {Promise<Array>} Danh sách trận đấu
 */
export const crawlMatches = async () => {
  try {
    console.log("🔍 Đang crawl matches từ KeucolaTV...");

    // Fetch HTML
    const response = await axios.get(MATCHES_URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7",
      },
      timeout: 10000,
    });

    const html = response.data;
    const $ = cheerio.load(html);
    const matches = [];

    // Tìm tất cả các match cards
    // Pattern: /truc-tiep-bong-da/{matchId}/{streamId}
    $('a[href^="/truc-tiep-bong-da/"]').each((index, element) => {
      const $el = $(element);
      const href = $el.attr("href");

      // Skip nếu là link chính (không có matchId)
      if (href === "/truc-tiep-bong-da" || href === "/truc-tiep-bong-da/") {
        return;
      }

      // Extract match info
      const fullUrl = `${BASE_URL}${href}`;
      const pathParts = href.split("/").filter((p) => p);

      if (pathParts.length >= 3) {
        const matchId = pathParts[1];
        const streamId = pathParts[2];

        // Lấy thông tin từ HTML
        const matchText = $el.text().trim();

        // Tìm parent container để lấy thêm info
        const $parent = $el.closest("div");
        const league = $parent
          .find('.league-name, [class*="league"]')
          .first()
          .text()
          .trim();
        const status = $parent
          .find('.status, [class*="status"]')
          .first()
          .text()
          .trim();

        // Lấy tên đội
        const teams = matchText.split("-").map((t) => t.trim());
        const homeTeam = teams[0] || "";
        const awayTeam = teams[1] || "";

        // Tìm thời gian
        const timeMatch = matchText.match(/(\d{1,2}:\d{2})/);
        const matchTime = timeMatch ? timeMatch[1] : "";

        matches.push({
          matchId,
          streamId,
          url: fullUrl,
          league: league || "Unknown League",
          homeTeam,
          awayTeam,
          matchTime,
          status: status || "Sắp diễn ra",
          source: "KeucolaTV",
          crawledAt: new Date(),
        });
      }
    });

    // Remove duplicates based on matchId
    const uniqueMatches = Array.from(
      new Map(matches.map((m) => [m.matchId, m])).values()
    );

    console.log(`✅ Crawled ${uniqueMatches.length} matches từ KeucolaTV`);
    return uniqueMatches;
  } catch (error) {
    console.error("❌ Lỗi khi crawl matches:", error.message);
    throw error;
  }
};

/**
 * Crawl chi tiết một trận đấu
 * @param {string} matchUrl - URL của trận đấu
 * @returns {Promise<Object>} Chi tiết trận đấu
 */
export const crawlMatchDetail = async (matchUrl) => {
  try {
    const response = await axios.get(matchUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      timeout: 10000,
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // Extract stream URLs (iframe src, video src, etc.)
    const streamUrls = [];

    $("iframe").each((i, el) => {
      const src = $(el).attr("src");
      if (src) {
        streamUrls.push(src);
      }
    });

    $("video source").each((i, el) => {
      const src = $(el).attr("src");
      if (src) {
        streamUrls.push(src);
      }
    });

    return {
      url: matchUrl,
      streamUrls,
      crawledAt: new Date(),
    };
  } catch (error) {
    console.error("❌ Lỗi khi crawl match detail:", error.message);
    throw error;
  }
};

/**
 * Test crawler
 */
export const testCrawler = async () => {
  try {
    console.log("🧪 Testing crawler...\n");

    const matches = await crawlMatches();

    console.log("\n📊 Kết quả crawl:");
    console.log(`Tổng số trận: ${matches.length}\n`);

    if (matches.length > 0) {
      console.log("📋 Danh sách 5 trận đầu tiên:");
      matches.slice(0, 5).forEach((match, index) => {
        console.log(`\n${index + 1}. ${match.homeTeam} vs ${match.awayTeam}`);
        console.log(`   Giải đấu: ${match.league}`);
        console.log(`   Thời gian: ${match.matchTime}`);
        console.log(`   Trạng thái: ${match.status}`);
        console.log(`   URL: ${match.url}`);
        console.log(`   Match ID: ${match.matchId}`);
      });
    }

    return matches;
  } catch (error) {
    console.error("❌ Test failed:", error);
    throw error;
  }
};

export default {
  crawlMatches,
  crawlMatchDetail,
  testCrawler,
};
