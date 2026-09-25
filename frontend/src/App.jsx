import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import Home from "./pages/Home";
import Services from "./pages/Services";
import ServiceDetails from "./pages/ServiceDetails";
import Booking from "./pages/Booking";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyBookings from "./pages/MyBookings";
import AdminDashboard from "./pages/AdminDashboard";
import AdminServices from "./pages/AdminServices";
import AdminBookings from "./pages/AdminBookings";
import AIChatbot from "./components/AIChatbot";

import api from "./services/api";
import { loginUser, logoutUser } from "./store/authSlice";

export default function App() {
  const dispatch = useDispatch();

  // Check authentication when app starts
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check JWT cookie with backend
        const response = await api.get("/auth/me");

        // Save user in Redux
        dispatch(loginUser(response.data.user));
      } catch (error) {
        // User is not logged in
        dispatch(logoutUser());
      } finally {
        // Authentication check completed
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, [dispatch]);

  // Wait until authentication is checked
  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-600">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <Routes>

          {/* =========================
              Public Routes
          ========================== */}

          <Route path="/" element={<Home />} />

          <Route path="/services" element={<Services />} />

          <Route path="/services/:id" element={<ServiceDetails />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />


          {/* =========================
              Logged-in User Routes
          ========================== */}

          <Route element={<ProtectedRoute />}>

            {/* Login required for booking */}
            <Route path="/booking/:id"  element={<Booking />}  />

            {/* Login required for my bookings */}
            <Route path="/my-bookings" element={<MyBookings />}/>

          </Route>


          {/* =========================
              Admin Only Routes
          ========================== */}

          <Route element={<AdminRoute />}>

            {/* Admin Dashboard */}
            <Route path="/admin" element={<AdminDashboard />} />

            {/* Admin Service Management */}
            <Route path="/admin/services"  element={<AdminServices />} />
              <Route path="/admin/bookings" element={<AdminBookings />}/>
          </Route>
        </Routes>
      </main>
      <Footer />
      <AIChatbot />
    </div>
  );
}