import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AdminRoute() {
  const { user, isLoggedIn } = useSelector(
    (state) => state.auth
  );

  // User login nahi hai
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // User logged in hai lekin admin nahi hai
  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // User admin hai
  return <Outlet />;
}