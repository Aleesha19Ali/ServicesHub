import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import toast from "react-hot-toast";
import api from "../services/api";

export default function AdminBookings() {
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
  // Update booking status
  // =========================
  const handleStatusChange = async (bookingId, status) => {
    try {
      await api.put(
        `/bookings/${bookingId}/status`,
        { status }
      );

      toast.success("Booking status updated successfully!");

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
            Loading bookings...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto flex max-w-7xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:my-10 lg:flex-row">

      {/* Admin Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="min-w-0 flex-1 bg-slate-50 p-5 sm:p-8">

        {/* Header */}
        <div>
          <p className="text-sm text-slate-500">
            Manage customer bookings
          </p>

          <h1 className="mt-1 text-3xl font-extrabold">
            Bookings
          </h1>
        </div>

        {/* Bookings Table */}
        <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-5">

          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">
              All Bookings
            </h2>

            <button
              onClick={fetchBookings}
              className="text-sm font-bold text-emerald-600"
            >
              Refresh
            </button>
          </div>

          <div className="mt-5 overflow-x-auto">

            <table className="w-full min-w-[1000px] text-left text-sm">

              <thead className="border-b border-slate-200 text-slate-500">
                <tr>

                  <th className="px-3 py-3 font-semibold">
                    Customer
                  </th>

                  <th className="px-3 py-3 font-semibold">
                    Email
                  </th>

                  <th className="px-3 py-3 font-semibold">
                    Service
                  </th>

                  <th className="px-3 py-3 font-semibold">
                    Date & Time
                  </th>

                  <th className="px-3 py-3 font-semibold">
                    Address
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

                {bookings.map((booking) => (

                  <tr
                    key={booking._id}
                    className="border-b border-slate-100 last:border-0"
                  >

                    {/* Customer */}
                    <td className="px-3 py-4 font-semibold">
                      {booking.user?.fullname ||
                        "Unknown User"}
                    </td>

                    {/* Email */}
                    <td className="px-3 py-4 text-slate-600">
                      {booking.user?.email ||
                        "No Email"}
                    </td>

                    {/* Service */}
                    <td className="px-3 py-4 text-slate-600">
                      {booking.service?.name ||
                        "Unknown Service"}
                    </td>

                    {/* Date & Time */}
                    <td className="px-3 py-4 text-slate-600">
                      {booking.date} | {booking.time}
                    </td>

                    {/* Address */}
                    <td className="px-3 py-4 text-slate-600">
                      {booking.address}
                    </td>

                    {/* Status */}
                    <td className="px-3 py-4">

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          booking.status === "Pending"
                            ? "bg-amber-50 text-amber-700"
                            : booking.status === "Confirmed"
                            ? "bg-blue-50 text-blue-700"
                            : booking.status === "Completed"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {booking.status}
                      </span>

                    </td>

                    {/* Action */}
                    <td className="px-3 py-4">

                      {booking.status === "Pending" && (
                        <div className="flex gap-3">

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

                          <button
                            onClick={() =>
                              handleStatusChange(
                                booking._id,
                                "Cancelled"
                              )
                            }
                            className="font-bold text-red-500 hover:text-red-600"
                          >
                            Cancel
                          </button>

                        </div>
                      )}

                      {booking.status === "Confirmed" && (
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

                      {booking.status === "Completed" && (
                        <span className="text-slate-400">
                          Done
                        </span>
                      )}

                      {booking.status === "Cancelled" && (
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

      </div>

    </section>
  );
}