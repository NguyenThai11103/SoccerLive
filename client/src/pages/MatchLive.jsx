import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getMatchById } from "../services/matchService";
import {
  formatMatchTime,
  getStatusColor,
  getStatusText,
} from "../services/matchService";

function MatchLive() {
  const { id } = useParams();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadMatch();
  }, [id]);

  const loadMatch = async () => {
    try {
      setLoading(true);
      setError("");
      const matchData = await getMatchById(id);
      setMatch(matchData);
    } catch (err) {
      console.error("Error loading match:", err);
      setError("Không thể tải thông tin trận đấu");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-dark-50 mb-2">
            Không tìm thấy trận đấu
          </h2>
          <p className="text-dark-400 mb-6">{error}</p>
          <Link to="/" className="btn btn-primary">
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Match Header */}
      <div className="bg-dark-900 border-b border-dark-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-dark-400 hover:text-dark-200">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </Link>
              <span
                className={`badge ${
                  match.status === "LIVE"
                    ? "badge-live"
                    : match.status === "SCHEDULED"
                    ? "badge-upcoming"
                    : "badge-finished"
                }`}
              >
                {match.status === "LIVE"
                  ? "🔴 LIVE"
                  : getStatusText(match.status)}
              </span>
              <span className="text-dark-400 text-sm">
                {match.league || "International"}
              </span>
            </div>
            {match.viewerCount > 0 && (
              <div className="flex items-center text-dark-400 text-sm">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fillRule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clipRule="evenodd"
                  />
                </svg>
                {match.viewerCount.toLocaleString()} đang xem
              </div>
            )}
          </div>

          {/* Score */}
          <div className="mt-4 flex items-center justify-center space-x-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-dark-50">
                {match.homeTeam}
              </div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-display font-bold text-primary-500">
                {match.homeScore || 0} - {match.awayScore || 0}
              </div>
              {match.status === "LIVE" && (
                <div className="text-dark-400 text-sm mt-2">LIVE</div>
              )}
              {match.status === "SCHEDULED" && (
                <div className="text-dark-400 text-sm mt-2">
                  {formatMatchTime(match.startTime)}
                </div>
              )}
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-dark-50">
                {match.awayTeam}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Player */}
          <div className="lg:col-span-2 space-y-6">
            {match.streamUrl ? (
              <div className="aspect-video bg-dark-900 rounded-xl border border-dark-800 overflow-hidden">
                <iframe
                  src={match.streamUrl}
                  className="w-full h-full"
                  allowFullScreen
                  allow="autoplay; encrypted-media; picture-in-picture"
                  title={`${match.homeTeam} vs ${match.awayTeam}`}
                />
              </div>
            ) : (
              <div className="aspect-video bg-dark-900 rounded-xl border border-dark-800 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-dark-800 rounded-full flex items-center justify-center mx-auto">
                    <svg
                      className="w-10 h-10 text-primary-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-dark-300 font-semibold">
                      Stream chưa sẵn sàng
                    </p>
                    <p className="text-dark-500 text-sm">
                      {match.status === "SCHEDULED"
                        ? "Trận đấu chưa bắt đầu"
                        : "Stream không khả dụng"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Match Stats */}
            <div className="card">
              <h3 className="text-xl font-bold text-dark-50 mb-4">
                Thông tin trận đấu
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-dark-400">Giải đấu</span>
                  <span className="text-dark-200">
                    {match.league || "International"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-400">Thời gian</span>
                  <span className="text-dark-200">
                    {formatMatchTime(match.startTime)}
                  </span>
                </div>
                {match.venue && (
                  <div className="flex justify-between">
                    <span className="text-dark-400">Sân vận động</span>
                    <span className="text-dark-200">{match.venue}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-dark-400">Trạng thái</span>
                  <span className="text-dark-200">
                    {getStatusText(match.status)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Sidebar */}
          <div className="lg:col-span-1">
            <div className="card h-[600px] flex flex-col">
              <h3 className="text-xl font-bold text-dark-50 mb-4">
                Chat trực tiếp
              </h3>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                <div className="flex space-x-2">
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-semibold">U1</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-dark-300">
                      User1
                    </div>
                    <div className="text-sm text-dark-400">
                      Trận đấu hay quá!
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-semibold">U2</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-dark-300">
                      User2
                    </div>
                    <div className="text-sm text-dark-400">Gooooal! 🎉</div>
                  </div>
                </div>
              </div>

              {/* Input */}
              <div className="border-t border-dark-800 pt-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Nhập tin nhắn..."
                    className="input flex-1"
                  />
                  <button className="btn btn-primary px-4">
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
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MatchLive;
