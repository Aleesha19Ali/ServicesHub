import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../services/api";
import { loginUser } from "../store/authSlice";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Form fields state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Handle login form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send login data to backend
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      // Save user information in Redux
      dispatch(loginUser(response.data.user));

      // Show success message
      toast.success(
        response.data.message || "Login successful!"
      );

      // Go to My Bookings after successful login
      navigate("/");
    } catch (error) {
      // Show backend error message
      toast.error(
        error.response?.data?.message || "Login failed"
      );
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Login to your account"
      footer={
        <>
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-bold text-emerald-600"
          >
            Register
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Email Input */}
        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password Input */}
        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Login Button */}
        <button
          type="submit"
          className="w-full rounded-lg bg-emerald-600 py-3.5 font-bold text-white hover:bg-emerald-700"
        >
          Login
        </button>

      </form>
    </AuthLayout>
  );
}


// ==============================
// Reusable Input Component
// ==============================

function Input({
  label,
  type,
  placeholder,
  value,
  onChange,
}) {
  return (
    <label className="block text-sm font-semibold text-slate-700">
      {label}

      <input
        type={type}
        required
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 font-normal outline-none focus:border-emerald-500"
      />
    </label>
  );
}


// ==============================
// Authentication Layout
// ==============================

function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}) {
  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">

        {/* Logo & Heading */}
        <div className="text-center">

          <p className="text-2xl font-extrabold">
            Service
            <span className="text-emerald-600">
              Hub
            </span>
          </p>

          <h1 className="mt-7 text-2xl font-bold">
            {title}
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            {subtitle}
          </p>

        </div>

        {/* Form */}
        <div className="mt-7">
          {children}
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-slate-500">
          {footer}
        </p>

      </div>
    </section>
  );
}