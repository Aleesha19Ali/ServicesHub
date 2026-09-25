import { useEffect, useState } from "react";
import { CalendarDays, Clock3, MapPin } from "lucide-react";
import toast from "react-hot-toast";

import api from "../services/api";

const statusClass = {
  Pending: "bg-amber-50 text-amber-700",
  Confirmed: "bg-blue-50 text-blue-700",
  Completed: "bg-emerald-50 text-emerald-700",
  Cancelled: "bg-red-50 text-red-700",
};

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  // =========================
  // Get user's bookings
  // =========================
  const fetchBookings = async () => {
    try {
      const response = await api.get("/bookings/my");

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
  // Cancel Booking
  // =========================
  const handleCancel = async (bookingId) => {
    try {
      await api.put(`/bookings/${bookingId}/cancel`);

      toast.success("Booking cancelled successfully!");

      // Refresh bookings after cancellation
      fetchBookings();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to cancel booking"
      );
    }
  };

  // =========================
  // Filter Bookings
  // =========================
  const filteredBookings =
    activeFilter === "All"
      ? bookings
      : bookings.filter(
          (booking) => booking.status === activeFilter
        );

  // =========================
  // Loading
  // =========================
  if (loading) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold">
          My Bookings
        </h1>

        <p className="mt-2 text-slate-500">
          Loading your bookings...
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold">
        My Bookings
      </h1>

      <p className="mt-2 text-slate-500">
        View and manage your bookings.
      </p>

      {/* =========================
          Booking Filters
      ========================== */}
      <div className="mt-7 flex gap-2 overflow-x-auto pb-2">
        {[
          "All",
          "Pending",
          "Confirmed",
          "Completed",
          "Cancelled",
        ].map((item) => (
          <button
            key={item}
            onClick={() => setActiveFilter(item)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold ${
              activeFilter === item
                ? "bg-emerald-600 text-white"
                : "bg-white text-slate-600 ring-1 ring-slate-200"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* =========================
          Bookings
      ========================== */}
      <div className="mt-5 space-y-4">
        {filteredBookings.map((booking) => (
          <article
            key={booking._id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <div className="flex flex-wrap items-center gap-3">

                  {/* Service Name */}
                  <h2 className="text-lg font-bold">
                    {booking.service?.name}
                  </h2>

                  {/* Status */}
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      statusClass[booking.status]
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>

                <div className="mt-3 grid gap-2 text-sm text-slate-500 sm:grid-cols-3">

                  {/* Date */}
                  <span className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    {booking.date}
                  </span>

                  {/* Time */}
                  <span className="flex items-center gap-2">
                    <Clock3 className="h-4 w-4" />
                    {booking.time}
                  </span>

                  {/* Address */}
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {booking.address}
                  </span>

                </div>
              </div>

              {/* Cancel Button */}
              {booking.status === "Pending" && (
                <button
                  onClick={() => handleCancel(booking._id)}
                  className="rounded-lg bg-red-50 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-100"
                >
                  Cancel
                </button>
              )}
            </div>
          </article>
        ))}

        {/* No Bookings */}
        {filteredBookings.length === 0 && (
          <p className="py-16 text-center text-slate-500">
            No bookings found.
          </p>
        )}
      </div>
    </section>
  );
}