import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import api from "../services/api";
import ServiceCard from "../components/ServiceCard";

const categories = [
  "All",
  "Cleaning",
  "Repair",
  "Moving",
  "Electrical",
  "Plumbing",
];

export default function Services() {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  // =========================
  // Get services from backend
  // =========================
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get("/services");

        // Save backend services in state
        setServices(response.data.services);
      } catch (error) {
        console.error(
          error.response?.data?.message || "Failed to fetch services"
        );
      }
    };

    fetchServices();
  }, []);

  // =========================
  // Search & Category Filter
  // =========================
  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesSearch = service.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || service.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [services, search, category]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-bold uppercase tracking-wider text-emerald-600">
          Explore
        </p>

        <h1 className="mt-2 text-4xl font-extrabold text-slate-900">
          All Services
        </h1>

        <p className="mt-3 text-slate-500">
          Find the best professionals for your needs.
        </p>
      </div>

      <div className="mx-auto mt-8 max-w-3xl">
        <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services..."
            className="min-w-0 flex-1 px-4 py-3.5 outline-none"
          />

          <button className="bg-emerald-600 px-5 text-white">
            <Search className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                category === item
                  ? "bg-emerald-600 text-white"
                  : "bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-emerald-300"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredServices.map((service) => (
          <ServiceCard
            key={service._id}
            service={service}
          />
        ))}
      </div>

      {filteredServices.length === 0 && (
        <p className="py-16 text-center text-slate-500">
          No services found.
        </p>
      )}
    </section>
  );
}