import { Link } from "react-router-dom";
import { Star } from "lucide-react";

export default function ServiceCard({ service }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:-translate-y-1 hover:shadow-md">
      <img
        src={service.image}
        alt={service.name}
        className="h-44 w-full object-cover"
      />

      <div className="p-5">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            {service.category}
          </span>

          <span className="flex items-center gap-1 text-sm font-medium text-slate-600">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            {service.rating}
          </span>
        </div>

        <h3 className="text-lg font-bold text-slate-900">
          {service.name}
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          From Rs. {service.price.toLocaleString()}
        </p>

        {/* View Details */}
        <Link
          to={`/services/${service._id}`}
          className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}