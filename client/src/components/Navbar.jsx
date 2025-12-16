import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn] = useState(false); // Mock auth state

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="glass sticky top-0 z-50 border-b border-dark-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-blue-500 rounded-lg flex items-center justify-center shadow-glow">
              <span className="text-2xl">⚽</span>
            </div>
            <span className="text-xl font-display font-bold text-gradient">
              SoccerLive
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`transition-colors ${
                isActive("/")
                  ? "text-primary-500"
                  : "text-dark-300 hover:text-primary-400"
              }`}
            >
              Trang chủ
            </Link>
            <Link
              to="/#live"
              className="text-dark-300 hover:text-primary-400 transition-colors"
            >
              Trực tiếp
            </Link>
            <Link
              to="/#upcoming"
              className="text-dark-300 hover:text-primary-400 transition-colors"
            >
              Lịch thi đấu
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <button className="text-dark-300 hover:text-primary-400 transition-colors">
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
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </button>
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center cursor-pointer">
                  <span className="text-sm font-semibold">U</span>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary text-sm">
                  Đăng nhập
                </Link>
                <Link to="/register" className="btn btn-primary text-sm">
                  Đăng ký
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-dark-300 hover:text-primary-400"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-dark-800 animate-slide-down">
          <div className="px-4 py-4 space-y-3">
            <Link
              to="/"
              className="block text-dark-300 hover:text-primary-400 transition-colors"
            >
              Trang chủ
            </Link>
            <Link
              to="/#live"
              className="block text-dark-300 hover:text-primary-400 transition-colors"
            >
              Trực tiếp
            </Link>
            <Link
              to="/#upcoming"
              className="block text-dark-300 hover:text-primary-400 transition-colors"
            >
              Lịch thi đấu
            </Link>
            <div className="pt-3 border-t border-dark-800 space-y-2">
              {isLoggedIn ? (
                <Link
                  to="/profile"
                  className="block btn btn-secondary w-full text-center"
                >
                  Tài khoản
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block btn btn-secondary w-full text-center"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="block btn btn-primary w-full text-center"
                  >
                    Đăng ký
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
