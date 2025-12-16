// Admin Service - API calls for admin operations
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Get dashboard statistics
 */
export const getStats = async () => {
  try {
    const response = await fetch(`${API_URL}/admin/stats`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch stats");
    }

    return data.data;
  } catch (error) {
    console.error("Get stats error:", error);
    // Return mock data for now
    return {
      liveMatches: 3,
      totalViewers: 155000,
      totalUsers: 1200,
      totalMessages: 45000,
    };
  }
};

/**
 * Get all matches with filters
 */
export const getAllMatches = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(
      `${API_URL}/admin/matches${queryString ? `?${queryString}` : ""}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch matches");
    }

    return data.data;
  } catch (error) {
    console.error("Get all matches error:", error);
    throw error;
  }
};

/**
 * Create new match
 */
export const createMatch = async (matchData) => {
  try {
    const response = await fetch(`${API_URL}/admin/matches`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(matchData),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create match");
    }

    return data.data;
  } catch (error) {
    console.error("Create match error:", error);
    throw error;
  }
};

/**
 * Update match
 */
export const updateMatch = async (id, matchData) => {
  try {
    const response = await fetch(`${API_URL}/admin/matches/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(matchData),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update match");
    }

    return data.data;
  } catch (error) {
    console.error("Update match error:", error);
    throw error;
  }
};

/**
 * Delete match
 */
export const deleteMatch = async (id) => {
  try {
    const response = await fetch(`${API_URL}/admin/matches/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete match");
    }

    return data.data;
  } catch (error) {
    console.error("Delete match error:", error);
    throw error;
  }
};

/**
 * Update match status
 */
export const updateMatchStatus = async (id, status) => {
  try {
    const response = await fetch(`${API_URL}/admin/matches/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ status }),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update status");
    }

    return data.data;
  } catch (error) {
    console.error("Update status error:", error);
    throw error;
  }
};

/**
 * Get all users
 */
export const getAllUsers = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(
      `${API_URL}/admin/users${queryString ? `?${queryString}` : ""}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch users");
    }

    return data.data;
  } catch (error) {
    console.error("Get all users error:", error);
    throw error;
  }
};

/**
 * Update user role
 */
export const updateUserRole = async (id, role) => {
  try {
    const response = await fetch(`${API_URL}/admin/users/${id}/role`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ role }),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update role");
    }

    return data.data;
  } catch (error) {
    console.error("Update role error:", error);
    throw error;
  }
};

export default {
  getStats,
  getAllMatches,
  createMatch,
  updateMatch,
  deleteMatch,
  updateMatchStatus,
  getAllUsers,
  updateUserRole,
};
