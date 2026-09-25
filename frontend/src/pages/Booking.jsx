import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../services/api";

export default function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form data
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [address, setAddress] = useState("");

  // =========================
  // Get single service
  // =========================
  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await api.get(`/services/${id}`);

        setService(response.data.service);
      } catch (error) {
        console.error(
          error.response?.data?.message || "Failed to fetch service"
        );

        setService(null);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  // =========================
  // Submit Booking
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const response = await api.post("/bookings", {
        service: id,
        date,
        time,
        address,
      });

      toast.success(
        response.data.message || "Booking created successfully!"
      );

      // Go to My Bookings after successful booking
      navigate("/my-bookings");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Booking failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =========================
  // Loading
  // =========================
  if (loading) {
    return (
      <div className="py-20 text-center">
        <p className="text-slate-500">Loading service...</p>
      </div>
    );
  }

  // =========================
  // Service Not Found
  // =========================
  if (!service) {
    return (
      <div className="py-20 text-center">
        <p className="text-xl font-bold text-slate-900">
          Service not found.
        </p>

        <Link
          to="/services"
          className="mt-4 inline-block text-emerald-600"
        >
          Back to Services
        </Link>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold text-slate-900">
        Book Service
      </h1>

      <p className="mt-2 text-slate-500">
        Fill in the details to confirm your booking.
      </p>

      <div className="mt-8 grid gap-8 md:grid-cols-5">

        {/* =========================
            Service Information
        ========================== */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white md:col-span-2">
          <img
            src={service.image}
            alt={service.name}
            className="h-64 w-full object-cover"
          />

          <div className="p-5">
            <h2 className="text-xl font-bold">
              {service.name}
            </h2>

            <p className="mt-2 text-lg font-bold text-emerald-600">
              Rs. {service.price.toLocaleString()}
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              {service.description}
            </p>
          </div>
        </div>

        {/* =========================
            Booking Form
        ========================== */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:col-span-3"
        >
          <div className="grid gap-5 sm:grid-cols-2">

            {/* Date */}
            <label className="text-sm font-semibold text-slate-700">
              Select Date

              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-3 outline-none focus:border-emerald-500"
              />
            </label>

            {/* Time */}
            <label className="text-sm font-semibold text-slate-700">
              Select Time

              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-3 outline-none focus:border-emerald-500"
              />
            </label>
          </div>

          {/* Address */}
          <label className="mt-5 block text-sm font-semibold text-slate-700">
            Address

            <textarea
              required
              rows="4"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your complete address"
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-3 font-normal outline-none focus:border-emerald-500"
            />
          </label>

          {/* Confirm Booking */}
          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full rounded-lg bg-emerald-600 px-5 py-3.5 font-bold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Booking..." : "Confirm Booking"}
          </button>

          {/* Go Back */}
          <Link
            to={`/services/${service._id}`}
            className="mt-3 block text-center text-sm font-semibold text-slate-500"
          >
            Go back
          </Link>
        </form>
      </div>
    </section>
  );
}