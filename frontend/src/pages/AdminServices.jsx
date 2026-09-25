import { useEffect, useState } from "react";
import api from "../services/api";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminServices() {
  // Store all services
  const [services, setServices] = useState([]);

  // Loading state
  const [loading, setLoading] = useState(true);

  // Form open/close
  const [showForm, setShowForm] = useState(false);

  // Editing service
  const [editingId, setEditingId] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    rating: 5,
    includes: "",
  });

  // Submit loading
  const [submitting, setSubmitting] = useState(false);

  // =========================
  // Fetch Services
  // =========================
  const fetchServices = async () => {
    try {
      const response = await api.get("/services");

      setServices(response.data.services);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch services"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // =========================
  // Handle Input Change
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // Open Add Form
  // =========================
  const handleAdd = () => {
    setEditingId(null);

    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      image: "",
      rating: 5,
      includes: "",
    });

    setShowForm(true);
  };

  // =========================
  // Open Edit Form
  // =========================
  const handleEdit = (service) => {
    setEditingId(service._id);

    setFormData({
      name: service.name || "",
      description: service.description || "",
      price: service.price || "",
      category: service.category || "",
      image: service.image || "",
      rating: service.rating || 5,
      includes: service.includes?.join(", ") || "",
    });

    setShowForm(true);
  };

  // =========================
  // Submit Add/Edit
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const data = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        category: formData.category,
        image: formData.image,
        rating: Number(formData.rating),
        includes: formData.includes
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      // Edit existing service
      if (editingId) {
        const response = await api.put(
          `/services/${editingId}`,
          data
        );

        toast.success(
          response.data.message || "Service updated successfully"
        );
      } else {
        // Add new service
        const response = await api.post("/services", data);

        toast.success(
          response.data.message || "Service added successfully"
        );
      }

      // Refresh services
      await fetchServices();

      // Close form
      setShowForm(false);
      setEditingId(null);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =========================
  // Delete Service
  // =========================
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this service?"
    );

    if (!confirmed) return;

    try {
      const response = await api.delete(`/services/${id}`);

      toast.success(
        response.data.message || "Service deleted successfully"
      );

      // Remove deleted service from UI
      setServices((prev) =>
        prev.filter((service) => service._id !== id)
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete service"
      );
    }
  };

  // =========================
  // Loading
  // =========================
  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-12">
        <p className="text-center text-slate-500">
          Loading services...
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-emerald-600">
            Admin
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-slate-900">
            Service Management
          </h1>

          <p className="mt-2 text-slate-500">
            Add, edit and delete services.
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          <Plus className="h-5 w-5" />
          Add Service
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">
              {editingId ? "Edit Service" : "Add Service"}
            </h2>

            <button
              onClick={() => setShowForm(false)}
              className="text-slate-500 hover:text-slate-900"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-5 md:grid-cols-2"
          >

            {/* Name */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Service Name
              </label>

              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Home Cleaning"
                className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
              />
            </div>

            {/* Price */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Price
              </label>

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                placeholder="2500"
                className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
              />
            </div>

            {/* Category */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Category
              </label>

              <input
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                placeholder="Cleaning"
                className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
              />
            </div>

            {/* Rating */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Rating
              </label>

              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                min="0"
                max="5"
                step="0.1"
                className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
              />
            </div>

            {/* Image */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Image URL
              </label>

              <input
                name="image"
                value={formData.image}
                onChange={handleChange}
                required
                placeholder="https://example.com/image.jpg"
                className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                placeholder="Describe the service..."
                className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
              />
            </div>

            {/* Includes */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Service Includes
              </label>

              <input
                name="includes"
                value={formData.includes}
                onChange={handleChange}
                placeholder="Dusting, Mopping, Cleaning"
                className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
              />

              <p className="mt-1 text-xs text-slate-500">
                Separate items with commas.
              </p>
            </div>

            {/* Submit */}
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {submitting
                  ? "Saving..."
                  : editingId
                  ? "Update Service"
                  : "Add Service"}
              </button>
            </div>

          </form>
        </div>
      )}

      {/* Services List */}
      <div className="mt-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {services.length === 0 ? (
          <p className="p-8 text-center text-slate-500">
            No services found.
          </p>
        ) : (
          <div className="divide-y divide-slate-200">

            {services.map((service) => (
              <div
                key={service._id}
                className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between"
              >

                {/* Service Info */}
                <div className="flex items-center gap-4">

                  <img
                    src={service.image}
                    alt={service.name}
                    className="h-16 w-16 rounded-lg object-cover"
                  />

                  <div>
                    <h3 className="font-bold text-slate-900">
                      {service.name}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {service.category}
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      Rs. {service.price?.toLocaleString()}
                    </p>
                  </div>

                </div>

                {/* Actions */}
                <div className="flex gap-2">

                  <button
                    onClick={() => handleEdit(service)}
                    className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(service._id)}
                    className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 border border-red-700">
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

    </section>
  );
}