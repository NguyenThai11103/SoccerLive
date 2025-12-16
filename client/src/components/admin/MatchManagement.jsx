import { useState, useEffect } from "react";
import { getMatches } from "../../services/matchService";
import {
  deleteMatch,
  updateMatchStatus,
  createMatch,
  updateMatch,
} from "../../services/adminService";
import {
  formatMatchTime,
  getStatusColor,
  getStatusText,
} from "../../services/matchService";
import MatchForm from "./MatchForm";

function MatchManagement() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadMatches();
  }, [filter]);

  const loadMatches = async () => {
    try {
      setLoading(true);
      const params = filter !== "all" ? { status: filter } : {};
      const data = await getMatches(params);
      setMatches(data.matches || []);
    } catch (error) {
      console.error("Failed to load matches:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingMatch(null);
    setShowModal(true);
  };

  const handleEdit = (match) => {
    setEditingMatch(match);
    setShowModal(true);
  };

  const handleDelete = async (matchId) => {
    if (!confirm("Bạn có chắc muốn xóa trận đấu này?")) {
      return;
    }

    try {
      await deleteMatch(matchId);
      setMatches((prev) => prev.filter((m) => m.id !== matchId));
      alert("Đã xóa trận đấu thành công!");
    } catch (error) {
      alert("Lỗi khi xóa trận đấu: " + error.message);
    }
  };

  const handleStatusChange = async (matchId, newStatus) => {
    try {
      await updateMatchStatus(matchId, newStatus);
      setMatches((prev) =>
        prev.map((m) => (m.id === matchId ? { ...m, status: newStatus } : m))
      );
      alert("Đã cập nhật trạng thái!");
    } catch (error) {
      alert("Lỗi khi cập nhật trạng thái: " + error.message);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingMatch) {
        // Update existing match
        const updated = await updateMatch(editingMatch.id, formData);
        setMatches((prev) =>
          prev.map((m) => (m.id === editingMatch.id ? updated.match : m))
        );
        alert("Đã cập nhật trận đấu!");
      } else {
        // Create new match
        const created = await createMatch(formData);
        setMatches((prev) => [created.match, ...prev]);
        alert("Đã tạo trận đấu mới!");
      }
      setShowModal(false);
      setEditingMatch(null);
    } catch (error) {
      alert("Lỗi: " + error.message);
    }
  };

  const filteredMatches = matches.filter((match) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      match.homeTeam.toLowerCase().includes(searchLower) ||
      match.awayTeam.toLowerCase().includes(searchLower) ||
      match.league.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="card">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-dark-50">Quản lý trận đấu</h2>
        <button onClick={handleCreate} className="btn btn-primary">
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Thêm trận đấu
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Tìm kiếm đội bóng, giải đấu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input w-full"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === "all"
                ? "bg-primary-600 text-white"
                : "bg-dark-800 text-dark-300 hover:bg-dark-700"
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setFilter("LIVE")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === "LIVE"
                ? "bg-red-600 text-white"
                : "bg-dark-800 text-dark-300 hover:bg-dark-700"
            }`}
          >
            Live
          </button>
          <button
            onClick={() => setFilter("SCHEDULED")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === "SCHEDULED"
                ? "bg-blue-600 text-white"
                : "bg-dark-800 text-dark-300 hover:bg-dark-700"
            }`}
          >
            Sắp diễn ra
          </button>
        </div>
      </div>

      {/* Matches Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
          <p className="text-dark-400 mt-4">Đang tải...</p>
        </div>
      ) : filteredMatches.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-dark-400">Không có trận đấu nào</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-700">
                <th className="text-left py-3 px-4 text-dark-300 font-semibold">
                  Trận đấu
                </th>
                <th className="text-left py-3 px-4 text-dark-300 font-semibold">
                  Giải đấu
                </th>
                <th className="text-left py-3 px-4 text-dark-300 font-semibold">
                  Thời gian
                </th>
                <th className="text-left py-3 px-4 text-dark-300 font-semibold">
                  Trạng thái
                </th>
                <th className="text-left py-3 px-4 text-dark-300 font-semibold">
                  Người xem
                </th>
                <th className="text-right py-3 px-4 text-dark-300 font-semibold">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredMatches.map((match) => (
                <tr
                  key={match.id}
                  className="border-b border-dark-800 hover:bg-dark-800/50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="font-semibold text-dark-50">
                      {match.homeTeam} vs {match.awayTeam}
                    </div>
                    <div className="text-sm text-dark-400">
                      {match.homeScore} - {match.awayScore}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-dark-300">{match.league}</td>
                  <td className="py-4 px-4 text-dark-300">
                    {formatMatchTime(match.startTime)}
                  </td>
                  <td className="py-4 px-4">
                    <select
                      value={match.status}
                      onChange={(e) =>
                        handleStatusChange(match.id, e.target.value)
                      }
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        match.status
                      )} text-white border-0 cursor-pointer`}
                    >
                      <option value="SCHEDULED">Sắp diễn ra</option>
                      <option value="LIVE">Đang live</option>
                      <option value="FINISHED">Đã kết thúc</option>
                      <option value="CANCELLED">Đã hủy</option>
                    </select>
                  </td>
                  <td className="py-4 px-4 text-dark-300">
                    {match.viewerCount || 0}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(match)}
                        className="p-2 text-primary-500 hover:bg-primary-600/20 rounded-lg transition-colors"
                        title="Sửa"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(match.id)}
                        className="p-2 text-red-500 hover:bg-red-600/20 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-2xl font-bold text-dark-50 mb-6">
                {editingMatch ? "Sửa trận đấu" : "Thêm trận đấu mới"}
              </h3>
              <MatchForm
                match={editingMatch}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setShowModal(false);
                  setEditingMatch(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MatchManagement;
