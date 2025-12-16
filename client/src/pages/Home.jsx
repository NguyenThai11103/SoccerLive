import MatchCard from "../components/MatchCard";

function Home() {
  // Mock data for demonstration
  const liveMatches = [
    {
      id: 1,
      homeTeam: "Manchester United",
      awayTeam: "Liverpool",
      homeScore: 2,
      awayScore: 1,
      status: "LIVE",
      startTime: new Date().toISOString(),
      league: "Premier League",
      viewers: 45230,
      homeTeamLogo: "🔴",
      awayTeamLogo: "🔴",
    },
    {
      id: 2,
      homeTeam: "Real Madrid",
      awayTeam: "Barcelona",
      homeScore: 1,
      awayScore: 1,
      status: "LIVE",
      startTime: new Date().toISOString(),
      league: "La Liga",
      viewers: 78450,
      homeTeamLogo: "⚪",
      awayTeamLogo: "🔵",
    },
    {
      id: 3,
      homeTeam: "Bayern Munich",
      awayTeam: "Dortmund",
      homeScore: 3,
      awayScore: 0,
      status: "LIVE",
      startTime: new Date().toISOString(),
      league: "Bundesliga",
      viewers: 32100,
      homeTeamLogo: "🔴",
      awayTeamLogo: "🟡",
    },
  ];

  const upcomingMatches = [
    {
      id: 4,
      homeTeam: "Chelsea",
      awayTeam: "Arsenal",
      status: "UPCOMING",
      startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      league: "Premier League",
      homeTeamLogo: "🔵",
      awayTeamLogo: "🔴",
    },
    {
      id: 5,
      homeTeam: "PSG",
      awayTeam: "Marseille",
      status: "UPCOMING",
      startTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
      league: "Ligue 1",
      homeTeamLogo: "🔵",
      awayTeamLogo: "⚪",
    },
    {
      id: 6,
      homeTeam: "Juventus",
      awayTeam: "AC Milan",
      status: "UPCOMING",
      startTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
      league: "Serie A",
      homeTeamLogo: "⚫",
      awayTeamLogo: "🔴",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 to-blue-900/20"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center space-y-6 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-display font-bold">
              <span className="text-gradient glow-text">SoccerLive</span>
            </h1>
            <p className="text-xl md:text-2xl text-dark-300 max-w-2xl mx-auto">
              Trải nghiệm bóng đá trực tiếp với chất lượng HD, chat realtime và
              thống kê chi tiết
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <a href="#live" className="btn btn-primary text-lg px-8">
                Xem trực tiếp ngay
              </a>
              <a href="#upcoming" className="btn btn-outline text-lg px-8">
                Lịch thi đấu
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Live Matches Section */}
      <section id="live" className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <h2 className="text-3xl font-display font-bold text-dark-50">
              Đang diễn ra
            </h2>
            <span className="text-dark-400">({liveMatches.length} trận)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Matches Section */}
      <section id="upcoming" className="py-16 px-4 bg-dark-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-3 mb-8">
            <svg
              className="w-8 h-8 text-primary-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h2 className="text-3xl font-display font-bold text-dark-50">
              Sắp diễn ra
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-display font-bold text-center mb-12 text-dark-50">
            Tính năng nổi bật
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-blue-500 rounded-full flex items-center justify-center mx-auto shadow-glow">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-dark-50">Stream HD</h3>
              <p className="text-dark-400">
                Chất lượng video cao, mượt mà không giật lag
              </p>
            </div>

            <div className="card text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-blue-500 rounded-full flex items-center justify-center mx-auto shadow-glow">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-dark-50">Chat Realtime</h3>
              <p className="text-dark-400">
                Tương tác với fan hâm mộ trong thời gian thực
              </p>
            </div>

            <div className="card text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-blue-500 rounded-full flex items-center justify-center mx-auto shadow-glow">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-dark-50">Thống kê Live</h3>
              <p className="text-dark-400">
                Cập nhật tỷ số và sự kiện trận đấu tức thời
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
