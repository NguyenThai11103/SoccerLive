import { useState, useEffect } from "react";
import { getAllUsers, updateUserRole } from "../../services/adminService";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data.users || []);
    } catch (error) {
      console.error("Failed to load users:", error);
      // Mock data for development
      setUsers([
        {
          id: 1,
          username: "admin",
          email: "admin@soccerlive.com",
          role: "admin",
          createdAt: new Date().toISOString(),
        },
        {
          id: 2,
          username: "user1",
          email: "user1@example.com",
          role: "user",
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    if (!confirm(`Bạn có chắc muốn đổi role thành "${newRole}"?`)) {
      return;
    }

    try {
      await updateUserRole(userId, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
      alert("Đã cập nhật role!");
    } catch (error) {
      alert("Lỗi khi cập nhật role: " + error.message);
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-600";
      case "moderator":
        return "bg-purple-600";
      default:
        return "bg-blue-600";
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="card">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-dark-50">Quản lý người dùng</h2>
        <div className="text-dark-400">
          Tổng:{" "}
          <span className="text-primary-500 font-semibold">{users.length}</span>{" "}
          người dùng
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input w-full"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setRoleFilter("all")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              roleFilter === "all"
                ? "bg-primary-600 text-white"
                : "bg-dark-800 text-dark-300 hover:bg-dark-700"
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setRoleFilter("admin")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              roleFilter === "admin"
                ? "bg-red-600 text-white"
                : "bg-dark-800 text-dark-300 hover:bg-dark-700"
            }`}
          >
            Admin
          </button>
          <button
            onClick={() => setRoleFilter("user")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              roleFilter === "user"
                ? "bg-blue-600 text-white"
                : "bg-dark-800 text-dark-300 hover:bg-dark-700"
            }`}
          >
            User
          </button>
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
          <p className="text-dark-400 mt-4">Đang tải...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-dark-400">Không tìm thấy người dùng nào</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-700">
                <th className="text-left py-3 px-4 text-dark-300 font-semibold">
                  Người dùng
                </th>
                <th className="text-left py-3 px-4 text-dark-300 font-semibold">
                  Email
                </th>
                <th className="text-left py-3 px-4 text-dark-300 font-semibold">
                  Role
                </th>
                <th className="text-left py-3 px-4 text-dark-300 font-semibold">
                  Ngày tạo
                </th>
                <th className="text-right py-3 px-4 text-dark-300 font-semibold">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-dark-800 hover:bg-dark-800/50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold">
                          {user.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-dark-50">
                          {user.username}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-dark-300">{user.email}</td>
                  <td className="py-4 px-4">
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(user.id, e.target.value)
                      }
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(
                        user.role
                      )} text-white border-0 cursor-pointer`}
                    >
                      <option value="user">User</option>
                      <option value="moderator">Moderator</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="py-4 px-4 text-dark-300">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex justify-end space-x-2">
                      <button
                        className="p-2 text-primary-500 hover:bg-primary-600/20 rounded-lg transition-colors"
                        title="Xem chi tiết"
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
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>
                      <button
                        className="p-2 text-red-500 hover:bg-red-600/20 rounded-lg transition-colors"
                        title="Ban user"
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
                            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
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
    </div>
  );
}

export default UserManagement;
