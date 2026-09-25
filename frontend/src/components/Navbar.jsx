import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import api from "../services/api";
import { logoutUser } from "../store/authSlice";

// Navigation link styling
const navLinkClass = ({ isActive }) =>
  `text-sm font-medium ${
    isActive
      ? "text-emerald-600"
      : "text-slate-600 hover:text-emerald-600"
  }`;

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get user authentication information from Redux
  const { user, isLoggedIn } = useSelector(
    (state) => state.auth
  );

  // =========================
  // Logout
  // =========================
  const handleLogout = async () => {
    try {
      // Logout from backend
      await api.post("/auth/logout");

      // Clear Redux authentication state
      dispatch(logoutUser());

      // Close mobile menu
      setIsOpen(false);

      // Show success message
      toast.success("Logout successful!");

      // Redirect to login page
      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Logout failed"
      );
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* =========================
            Main Navbar
        ========================== */}
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-extrabold tracking-tight"
          >
            Service<span className="text-emerald-600">Hub</span>
          </Link>

          {/* =========================
              Desktop Navigation
          ========================== */}
          <nav className="hidden items-center gap-7 md:flex">

            <NavLink
              to="/"
              className={navLinkClass}
            >
              Home
            </NavLink>

            <NavLink
              to="/services"
              className={navLinkClass}
            >
              Services
            </NavLink>

            <NavLink
              to="/my-bookings"
              className={navLinkClass}
            >
              My Bookings
            </NavLink>

            {/* Admin - Only visible to admin */}
            {isLoggedIn && user?.role === "admin" && (
              <NavLink
                to="/admin"
                className={navLinkClass}
              >
                Admin
              </NavLink>
            )}

          </nav>

          {/* =========================
              Desktop Auth Section
          ========================== */}
          <div className="hidden items-center gap-3 md:flex">

            {!isLoggedIn ? (
              <>
                {/* Login */}
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-700 hover:text-emerald-600"
                >
                  Login
                </Link>

                {/* Register */}
                <Link
                  to="/register"
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                {/* Logged-in user */}
                <span className="text-sm font-medium text-slate-600">
                  Hi, {user?.fullname}
                </span>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="rounded-lg bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            )}

          </div>

          {/* =========================
              Mobile Menu Button
          ========================== */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-lg p-2 text-slate-700 md:hidden"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

        </div>

        {/* =========================
            Mobile Navigation
        ========================== */}
        {isOpen && (
          <div className="border-t border-slate-200 py-4 md:hidden">

            <nav className="flex flex-col gap-4">

              {/* Home */}
              <NavLink
                to="/"
                onClick={() => setIsOpen(false)}
                className={navLinkClass}
              >
                Home
              </NavLink>

              {/* Services */}
              <NavLink
                to="/services"
                onClick={() => setIsOpen(false)}
                className={navLinkClass}
              >
                Services
              </NavLink>

              {/* My Bookings */}
              <NavLink
                to="/my-bookings"
                onClick={() => setIsOpen(false)}
                className={navLinkClass}
              >
                My Bookings
              </NavLink>

              {/* Admin - Only visible to admin */}
              {isLoggedIn && user?.role === "admin" && (
                <NavLink
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className={navLinkClass}
                >
                  Admin
                </NavLink>
              )}

              {/* =========================
                  Mobile Auth Section
              ========================== */}

              {!isLoggedIn ? (
                <>
                  {/* Login */}
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="text-sm font-semibold text-slate-700"
                  >
                    Login
                  </Link>

                  {/* Register */}
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="w-fit rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
                  >
                    Register
                  </Link>
                </>
              ) : (
                <>
                  {/* Logged-in user */}
                  <span className="text-sm font-medium text-slate-600">
                    Hi, {user?.fullname}
                  </span>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="rounded-lg bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
                  >
                    Logout
                  </button>
                </>
              )}

            </nav>
          </div>
        )}

      </div>
    </header>
  );
}