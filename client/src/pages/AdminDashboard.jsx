import { useState } from "react";
import DashboardStats from "../components/admin/DashboardStats";
import MatchManagement from "../components/admin/MatchManagement";
import UserManagement from "../components/admin/UserManagement";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    {
      id: "overview",
      name: "Tổng quan",
      icon: (
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
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
    {
      id: "matches",
      name: "Trận đấu",
      icon: (
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
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      id: "users",
      name: "Người dùng",
      icon: (
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
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-dark-50 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-dark-400">
            Quản lý và theo dõi hoạt động của SoccerLive
          </p>
        </div>

        {/* Stats - Always visible */}
        <DashboardStats />

        {/* Tabs Navigation */}
        <div className="flex space-x-2 mb-6 border-b border-dark-800">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 font-semibold transition-colors relative ${
                activeTab === tab.id
                  ? "text-primary-500"
                  : "text-dark-400 hover:text-dark-200"
              }`}
            >
              {tab.icon}
              <span>{tab.name}</span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"></div>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="card">
                <h2 className="text-xl font-bold text-dark-50 mb-4">
                  Hành động nhanh
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => setActiveTab("matches")}
                    className="p-4 bg-dark-800 hover:bg-dark-700 rounded-lg transition-colors text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-primary-600/20 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-primary-500"
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
                      </div>
                      <div>
                        <p className="font-semibold text-dark-50">
                          Thêm trận đấu
                        </p>
                        <p className="text-sm text-dark-400">
                          Tạo trận đấu mới
                        </p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab("users")}
                    className="p-4 bg-dark-800 hover:bg-dark-700 rounded-lg transition-colors text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-blue-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-dark-50">
                          Quản lý user
                        </p>
                        <p className="text-sm text-dark-400">
                          Xem danh sách user
                        </p>
                      </div>
                    </div>
                  </button>

                  <button className="p-4 bg-dark-800 hover:bg-dark-700 rounded-lg transition-colors text-left">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-purple-500"
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
                      <div>
                        <p className="font-semibold text-dark-50">
                          Xem báo cáo
                        </p>
                        <p className="text-sm text-dark-400">
                          Thống kê chi tiết
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="card">
                <h2 className="text-xl font-bold text-dark-50 mb-4">
                  Hoạt động gần đây
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-dark-800 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-600/20 rounded-full flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-dark-50">
                          Trận đấu mới được tạo
                        </p>
                        <p className="text-sm text-dark-400">
                          Man Utd vs Liverpool
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-dark-500">5 phút trước</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-dark-800 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-600/20 rounded-full flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-blue-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-dark-50">
                          Người dùng mới đăng ký
                        </p>
                        <p className="text-sm text-dark-400">
                          john@example.com
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-dark-500">10 phút trước</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "matches" && <MatchManagement />}

          {activeTab === "users" && <UserManagement />}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
