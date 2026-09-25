import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute() {
  const { isLoggedIn } = useSelector(
    (state) => state.auth
  );

  const location = useLocation();

  // User login nahi hai
  if (!isLoggedIn) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // User logged in hai
  return <Outlet />;
}