import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Star } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../services/api";

export default function ServiceDetails() {
  const { id } = useParams();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

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
  // Loading
  // =========================
  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-slate-500">Loading service...</p>
      </div>
    );
  }

  // =========================
  // Service not found
  // =========================
  if (!service) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">
          Service not found
        </h1>

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
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        to="/services"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-emerald-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Services
      </Link>

      <div className="mt-7 grid gap-10 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-2 md:p-8">
        <img
          src={service.image}
          alt={service.name}
          className="h-[420px] w-full rounded-2xl object-cover"
        />

        <div className="flex flex-col justify-center">
          <span className="w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
            {service.category}
          </span>

          <h1 className="mt-4 text-4xl font-extrabold text-slate-900">
            {service.name}
          </h1>

          <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
            <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
            {service.rating} (120 reviews)
          </div>

          <p className="mt-5 text-2xl font-extrabold text-slate-900">
            Rs. {service.price.toLocaleString()}
          </p>

          <p className="mt-5 leading-7 text-slate-600">
            {service.description}
          </p>

          <h2 className="mt-7 font-bold text-slate-900">
            Service Includes
          </h2>

          <ul className="mt-3 space-y-3">
            {service.includes.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 text-sm text-slate-600"
              >
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                {item}
              </li>
            ))}
          </ul>

          <Link
            to={`/booking/${service._id}`}
            className="mt-8 rounded-lg bg-emerald-600 px-5 py-3.5 text-center font-bold text-white hover:bg-emerald-700"
          >
            Book Now
          </Link>
        </div>
      </div>
    </section>
  );
}