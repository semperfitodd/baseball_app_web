import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { useAuth } from "@/contexts/auth-context";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/play", label: "Play" },
  { to: "/progress", label: "Progress" },
  { to: "/leaderboard", label: "Leaderboard" },
] as const;

export function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);

  useEffect(() => {
    closeMobileMenu();
    setProfileOpen(false);
  }, [location.pathname, closeMobileMenu]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-navy-700">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">⚾</span>
          <span className="text-lg font-bold text-white">Baseball Intelligence</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`min-h-[44px] rounded-lg px-3 py-2 text-sm font-medium transition-colors
                flex items-center
                ${location.pathname === link.to
                  ? "bg-navy-800 text-white"
                  : "text-navy-100 hover:bg-navy-600 hover:text-white"
                }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {user && (
            <div ref={profileRef} className="relative hidden md:block">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex min-h-[44px] items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-navy-100 transition-colors hover:bg-navy-600 hover:text-white"
              >
                {user.picture ? (
                  <img
                    src={user.picture}
                    alt=""
                    className="h-7 w-7 rounded-full"
                  />
                ) : (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-navy-500 text-xs font-bold text-white">
                    {user.givenName?.[0] ?? user.name?.[0] ?? "?"}
                  </div>
                )}
                <span>{user.givenName || user.name}</span>
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-1 w-48 rounded-lg bg-white py-1 shadow-lg ring-1 ring-black/5">
                  <Link
                    to="/profile"
                    className="block min-h-[44px] px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={logout}
                    className="block w-full min-h-[44px] px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-navy-100 hover:bg-navy-600 md:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-navy-600 bg-navy-700 md:hidden">
          <div className="space-y-1 px-4 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`block min-h-[44px] rounded-lg px-3 py-2 text-sm font-medium transition-colors
                  flex items-center
                  ${location.pathname === link.to
                    ? "bg-navy-800 text-white"
                    : "text-navy-100 hover:bg-navy-600 hover:text-white"
                  }`}
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <>
                <Link
                  to="/profile"
                  className="flex min-h-[44px] items-center rounded-lg px-3 py-2 text-sm font-medium text-navy-100 hover:bg-navy-600 hover:text-white"
                >
                  Profile
                </Link>
                <button
                  onClick={logout}
                  className="flex min-h-[44px] w-full items-center rounded-lg px-3 py-2 text-left text-sm font-medium text-navy-100 hover:bg-navy-600 hover:text-white"
                >
                  Sign out
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
