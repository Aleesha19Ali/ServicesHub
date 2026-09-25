import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, ShieldCheck, Clock3 } from "lucide-react";
import { Link } from "react-router-dom";

import ServiceCard from "../components/ServiceCard";
import api from "../services/api";

export default function Home() {
  const [services, setServices] = useState([]);

  // Fetch services from backend
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get("/services");
        setServices(response.data.services || []);
      } catch (error) {
        console.error("Failed to fetch services:", error);
      }
    };

    fetchServices();
  }, []);

  return (
    <>
      <section className="bg-gradient-to-br from-emerald-50 via-white to-slate-50">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm ring-1 ring-emerald-100">
              <CheckCircle2 className="h-4 w-4" />
              Trusted by 10,000+ customers
            </div>

            <h1 className="max-w-xl text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl">
              Find & Book
              <span className="block text-emerald-600">Trusted Services</span>
              Near You
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
              Home cleaning, repairs, moving and more — all in one place.
              Quick, easy and reliable.
            </p>

            <Link
              to="/services"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3.5 font-semibold text-white shadow-sm hover:bg-emerald-700"
            >
              Browse Services
              <ArrowRight className="h-5 w-5" />
            </Link>

            <div className="mt-8 flex flex-wrap gap-5 text-sm text-slate-600">
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                Verified providers
              </span>

              <span className="flex items-center gap-2">
                <Clock3 className="h-5 w-5 text-emerald-600" />
                Quick booking
              </span>
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80"
              alt="Professional service provider"
              className="h-[430px] w-full rounded-3xl object-cover shadow-xl"
            />

            <div className="absolute bottom-6 left-6 rounded-2xl bg-white p-4 shadow-lg">
              <p className="text-sm font-bold text-slate-900">
                Quality Service
              </p>
              <p className="mt-1 text-xs text-slate-500">
                At your doorstep
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-7 flex items-end justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-emerald-600">
              Popular
            </p>

            <h2 className="mt-1 text-3xl font-bold text-slate-900">
              Popular Services
            </h2>
          </div>

          <Link
            to="/services"
            className="hidden text-sm font-bold text-emerald-600 sm:block"
          >
            View All →
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.slice(0, 4).map((service) => (
            <ServiceCard key={service._id} service={service} />
          ))}
        </div>
      </section>
    </>
  );
}