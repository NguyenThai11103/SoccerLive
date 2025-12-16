// Match Service - API calls for matches
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Get all matches
 * @param {Object} params - Query parameters
 * @param {string} params.status - Filter by status (SCHEDULED, LIVE, FINISHED)
 * @param {number} params.limit - Number of results
 * @param {number} params.offset - Pagination offset
 * @returns {Promise<Object>} Matches data
 */
export const getMatches = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_URL}/matches${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch matches");
    }

    return data.data;
  } catch (error) {
    console.error("Get matches error:", error);
    throw error;
  }
};

/**
 * Get live matches
 * @returns {Promise<Array>} Live matches
 */
export const getLiveMatches = async () => {
  try {
    const response = await fetch(`${API_URL}/matches/live`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch live matches");
    }

    return data.data.matches;
  } catch (error) {
    console.error("Get live matches error:", error);
    throw error;
  }
};

/**
 * Get match by ID
 * @param {string} id - Match ID
 * @returns {Promise<Object>} Match details
 */
export const getMatchById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/matches/${id}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch match");
    }

    return data.data.match;
  } catch (error) {
    console.error("Get match error:", error);
    throw error;
  }
};

/**
 * Format match time for display
 * @param {string} startTime - ISO date string
 * @returns {string} Formatted time
 */
export const formatMatchTime = (startTime) => {
  const date = new Date(startTime);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const matchDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  const time = date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (matchDate.getTime() === today.getTime()) {
    return `Hôm nay ${time}`;
  } else if (matchDate.getTime() === today.getTime() + 86400000) {
    return `Ngày mai ${time}`;
  } else {
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
};

/**
 * Get status badge color
 * @param {string} status - Match status
 * @returns {string} CSS class
 */
export const getStatusColor = (status) => {
  const colors = {
    SCHEDULED: "bg-blue-500",
    LIVE: "bg-red-500 animate-pulse",
    FINISHED: "bg-gray-500",
    CANCELLED: "bg-yellow-500",
  };
  return colors[status] || "bg-gray-500";
};

/**
 * Get status text in Vietnamese
 * @param {string} status - Match status
 * @returns {string} Vietnamese status
 */
export const getStatusText = (status) => {
  const texts = {
    SCHEDULED: "Sắp diễn ra",
    LIVE: "Đang live",
    FINISHED: "Đã kết thúc",
    CANCELLED: "Đã hủy",
  };
  return texts[status] || status;
};

export default {
  getMatches,
  getLiveMatches,
  getMatchById,
  formatMatchTime,
  getStatusColor,
  getStatusText,
};
