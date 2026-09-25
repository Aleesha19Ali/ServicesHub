import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import {
  CalendarDays,
  CircleDollarSign,
  PackageCheck,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";

import api from "../services/api";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // Get all bookings
  // =========================
  const fetchBookings = async () => {
    try {
      const response = await api.get("/bookings");

      setBookings(response.data.bookings);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load bookings"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // =========================
  // Dashboard Statistics
  // =========================

  // Total bookings
  const totalBookings = bookings.length;

  // Pending bookings
  const pendingBookings = bookings.filter(
    (booking) => booking.status === "Pending"
  ).length;

  // Total revenue
  const totalRevenue = bookings
    .filter(
      (booking) =>
        booking.status === "Completed"
    )
    .reduce(
      (total, booking) =>
        total + (booking.service?.price || 0),
      0
    );

  // Unique users
  const totalUsers = new Set(
    bookings
      .map((booking) => booking.user?._id)
      .filter(Boolean)
  ).size;

  const stats = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: Users,
    },
    {
      title: "Total Bookings",
      value: totalBookings,
      icon: CalendarDays,
    },
    {
      title: "Pending Bookings",
      value: pendingBookings,
      icon: PackageCheck,
    },
    {
      title: "Total Revenue",
      value: `Rs. ${totalRevenue.toLocaleString()}`,
      icon: CircleDollarSign,
    },
  ];

  // =========================
  // Update Booking Status
  // =========================
  const handleStatusChange = async (
    bookingId,
    status
  ) => {
    try {
      await api.put(
        `/bookings/${bookingId}/status`,
        { status }
      );

      toast.success(
        "Booking status updated successfully!"
      );

      // Refresh dashboard data
      fetchBookings();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update booking status"
      );
    }
  };

  // =========================
  // Loading
  // =========================
  if (loading) {
    return (
      <section className="mx-auto flex max-w-7xl items-center justify-center rounded-2xl border border-slate-200 bg-white lg:my-10">
        <div className="py-20 text-center">
          <p className="text-slate-500">
            Loading dashboard...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto flex max-w-7xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:my-10 lg:flex-row">
      <AdminSidebar />

      <div className="min-w-0 flex-1 bg-slate-50 p-5 sm:p-8">

        {/* =========================
            Dashboard Header
        ========================== */}
        <div>
          <p className="text-sm text-slate-500">
            Overview of your platform
          </p>

          <h1 className="mt-1 text-3xl font-extrabold">
            Dashboard
          </h1>
        </div>

        {/* =========================
            Statistics
        ========================== */}
        <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(
            ({ title, value, icon: Icon }) => (
              <div
                key={title}
                className="rounded-2xl border border-slate-200 bg-white p-5"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-500">
                    {title}
                  </p>

                  <Icon className="h-5 w-5 text-emerald-600" />
                </div>

                <p className="mt-3 text-2xl font-extrabold">
                  {value}
                </p>
              </div>
            )
          )}
        </div>

        {/* =========================
            Recent Bookings
        ========================== */}
        <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-5">

          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">
              Recent Bookings
            </h2>

            <button
              onClick={fetchBookings}
              className="text-sm font-bold text-emerald-600"
            >
              Refresh
            </button>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[750px] text-left text-sm">

              <thead className="border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="px-3 py-3 font-semibold">
                    Customer
                  </th>

                  <th className="px-3 py-3 font-semibold">
                    Service
                  </th>

                  <th className="px-3 py-3 font-semibold">
                    Date & Time
                  </th>

                  <th className="px-3 py-3 font-semibold">
                    Status
                  </th>

                  <th className="px-3 py-3 font-semibold">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {bookings
                  .slice(0, 5)
                  .map((booking) => (
                    <tr
                      key={booking._id}
                      className="border-b border-slate-100 last:border-0"
                    >

                      {/* Customer */}
                      <td className="px-3 py-4 font-semibold">
                        {booking.user?.fullname ||
                          "Unknown User"}
                      </td>

                      {/* Service */}
                      <td className="px-3 py-4 text-slate-600">
                        {booking.service?.name ||
                          "Unknown Service"}
                      </td>

                      {/* Date & Time */}
                      <td className="px-3 py-4 text-slate-600">
                        {booking.date} |{" "}
                        {booking.time}
                      </td>

                      {/* Status */}
                      <td className="px-3 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            booking.status ===
                            "Pending"
                              ? "bg-amber-50 text-amber-700"
                              : booking.status ===
                                "Confirmed"
                              ? "bg-blue-50 text-blue-700"
                              : booking.status ===
                                "Completed"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-3 py-4">
                        {booking.status ===
                          "Pending" && (
                          <button
                            onClick={() =>
                              handleStatusChange(
                                booking._id,
                                "Confirmed"
                              )
                            }
                            className="font-bold text-emerald-600 hover:text-emerald-700"
                          >
                            Confirm
                          </button>
                        )}

                        {booking.status ===
                          "Confirmed" && (
                          <button
                            onClick={() =>
                              handleStatusChange(
                                booking._id,
                                "Completed"
                              )
                            }
                            className="font-bold text-emerald-600 hover:text-emerald-700"
                          >
                            Complete
                          </button>
                        )}

                        {booking.status ===
                          "Completed" && (
                          <span className="text-slate-400">
                            Done
                          </span>
                        )}

                        {booking.status ===
                          "Cancelled" && (
                          <span className="text-red-400">
                            Cancelled
                          </span>
                        )}
                      </td>

                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* No bookings */}
          {bookings.length === 0 && (
            <p className="py-10 text-center text-slate-500">
              No bookings found.
            </p>
          )}
        </div>

        {/* =========================
            Quick Actions
        ========================== */}
        <div className="mt-7 grid gap-4 sm:grid-cols-2">

          {/* Add Service */}
          <button
            onClick={() =>
              navigate("/admin/services")
            }
            className="rounded-xl border border-slate-200 bg-white p-4 text-left font-bold hover:border-emerald-300"
          >
            + Add Service
          </button>

          {/* Manage Services */}
          <button
            onClick={() =>
              navigate("/admin/services")
            }
            className="rounded-xl border border-slate-200 bg-white p-4 text-left font-bold hover:border-emerald-300"
          >
            Manage Services
          </button>

        </div>

      </div>
    </section>
  );
}