import { useParams } from "react-router-dom";

function MatchLive() {
  const { id } = useParams();

  // Mock match data
  const match = {
    id,
    homeTeam: "Manchester United",
    awayTeam: "Liverpool",
    homeScore: 2,
    awayScore: 1,
    status: "LIVE",
    minute: 67,
    league: "Premier League",
    viewers: 45230,
  };

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Match Header */}
      <div className="bg-dark-900 border-b border-dark-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="badge badge-live">🔴 LIVE</span>
              <span className="text-dark-400 text-sm">{match.league}</span>
            </div>
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
              {match.viewers.toLocaleString()} đang xem
            </div>
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
                {match.homeScore} - {match.awayScore}
              </div>
              <div className="text-dark-400 text-sm mt-2">{match.minute}'</div>
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
                  <p className="text-dark-300 font-semibold">Video Player</p>
                  <p className="text-dark-500 text-sm">
                    Stream sẽ hiển thị khi backend được kết nối
                  </p>
                </div>
              </div>
            </div>

            {/* Match Stats */}
            <div className="card">
              <h3 className="text-xl font-bold text-dark-50 mb-4">
                Thống kê trận đấu
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-dark-400 mb-2">
                    <span>Kiểm soát bóng</span>
                    <span>55% - 45%</span>
                  </div>
                  <div className="h-2 bg-dark-800 rounded-full overflow-hidden flex">
                    <div
                      className="bg-primary-600 h-full"
                      style={{ width: "55%" }}
                    ></div>
                    <div
                      className="bg-blue-600 h-full"
                      style={{ width: "45%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm text-dark-400 mb-2">
                    <span>Sút</span>
                    <span>12 - 8</span>
                  </div>
                  <div className="h-2 bg-dark-800 rounded-full overflow-hidden flex">
                    <div
                      className="bg-primary-600 h-full"
                      style={{ width: "60%" }}
                    ></div>
                    <div
                      className="bg-blue-600 h-full"
                      style={{ width: "40%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm text-dark-400 mb-2">
                    <span>Sút trúng đích</span>
                    <span>5 - 3</span>
                  </div>
                  <div className="h-2 bg-dark-800 rounded-full overflow-hidden flex">
                    <div
                      className="bg-primary-600 h-full"
                      style={{ width: "62.5%" }}
                    ></div>
                    <div
                      className="bg-blue-600 h-full"
                      style={{ width: "37.5%" }}
                    ></div>
                  </div>
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
