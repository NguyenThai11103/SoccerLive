import { Link } from "react-router-dom";

function MatchCard({ match }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case "LIVE":
        return <span className="badge badge-live">🔴 LIVE</span>;
      case "UPCOMING":
        return <span className="badge badge-upcoming">Sắp diễn ra</span>;
      case "FINISHED":
        return <span className="badge badge-finished">Kết thúc</span>;
      default:
        return null;
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Link to={`/match/${match.id}`}>
      <div className="card hover:border-primary-600 transition-all duration-300 hover:shadow-glow cursor-pointer group">
        {/* Status Badge */}
        <div className="flex justify-between items-center mb-4">
          {getStatusBadge(match.status)}
          <span className="text-dark-400 text-sm">
            {formatTime(match.startTime)}
          </span>
        </div>

        {/* Teams */}
        <div className="space-y-4">
          {/* Home Team */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1">
              <div className="w-10 h-10 bg-dark-800 rounded-full flex items-center justify-center text-xl">
                {match.homeTeamLogo || "⚽"}
              </div>
              <span className="font-semibold text-dark-50 group-hover:text-primary-400 transition-colors">
                {match.homeTeam}
              </span>
            </div>
            {match.status !== "UPCOMING" && (
              <span className="text-2xl font-bold text-primary-500 min-w-[2rem] text-center">
                {match.homeScore}
              </span>
            )}
          </div>

          {/* Away Team */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1">
              <div className="w-10 h-10 bg-dark-800 rounded-full flex items-center justify-center text-xl">
                {match.awayTeamLogo || "⚽"}
              </div>
              <span className="font-semibold text-dark-50 group-hover:text-primary-400 transition-colors">
                {match.awayTeam}
              </span>
            </div>
            {match.status !== "UPCOMING" && (
              <span className="text-2xl font-bold text-primary-500 min-w-[2rem] text-center">
                {match.awayScore}
              </span>
            )}
          </div>
        </div>

        {/* Match Info */}
        {match.league && (
          <div className="mt-4 pt-4 border-t border-dark-800">
            <span className="text-dark-400 text-sm">{match.league}</span>
          </div>
        )}

        {/* Viewers count for live matches */}
        {match.status === "LIVE" && match.viewers && (
          <div className="mt-3 flex items-center text-dark-400 text-sm">
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
        )}
      </div>
    </Link>
  );
}

export default MatchCard;
