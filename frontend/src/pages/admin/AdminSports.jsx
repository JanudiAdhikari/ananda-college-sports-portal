import { useEffect, useRef, useState } from "react";
import {
  createSport,
  deleteSport,
  getSports,
  updateSport,
} from "../../services/sportService";

const initialFormData = {
  name: "",
  category: "TEAM",
  description: "",
  displayOrder: 0,
};

// Scroll-triggered reveal wrapper — fades sections in once
function Reveal({ children, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`${visible ? "reveal" : "opacity-0"} ${className}`}>
      {children}
    </div>
  );
}

function AdminSports() {
  const [sports, setSports] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [editingSportId, setEditingSportId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchSports = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getSports();
      setSports(data.sports || []);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load sports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadInitialSports = async () => {
      try {
        const data = await getSports();

        if (isMounted) {
          setSports(data.sports || []);
        }
      } catch (error) {
        if (isMounted) {
          setError(error.response?.data?.message || "Failed to load sports.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadInitialSports();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setMessage("");
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const payload = {
        ...formData,
        displayOrder: Number(formData.displayOrder),
      };

      if (editingSportId) {
        await updateSport(editingSportId, payload);
        setMessage("Sport updated successfully.");
      } else {
        await createSport(payload);
        setMessage("Sport created successfully.");
      }

      setFormData(initialFormData);
      setEditingSportId(null);
      await fetchSports();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to save sport.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (sport) => {
    setEditingSportId(sport._id);

    setFormData({
      name: sport.name || "",
      category: sport.category || "TEAM",
      description: sport.description || "",
      displayOrder: sport.displayOrder || 0,
    });

    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingSportId(null);
    setFormData(initialFormData);
    setMessage("");
    setError("");
  };

  const handleDelete = async (sportId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this sport?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setMessage("");
      setError("");

      await deleteSport(sportId);
      setMessage("Sport deleted successfully.");
      await fetchSports();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete sport.");
    }
  };

  return (
    <div>
      <p className="font-display mb-1 text-xs font-semibold uppercase tracking-wider text-ananda-gold">
        Admin Panel
      </p>

      <h1 className="font-display mb-2 text-3xl font-bold uppercase tracking-tight text-ananda-dark-maroon">
        Manage Sports
      </h1>

      <p className="mb-8 text-sm text-gray-600">
        Add, edit, and delete sports available at Ananda College.
      </p>

      {message && (
        <div className="mb-6 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm font-semibold text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Form Column */}
        <Reveal className="rounded-2xl border border-ananda-gold/15 bg-white p-6 shadow-sm lg:col-span-1 h-fit">
          <h2 className="font-display mb-5 text-lg font-bold uppercase tracking-tight text-ananda-maroon">
            {editingSportId ? "Edit Sport" : "Add New Sport"}
          </h2>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="font-display text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">
                Sport Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Example: Cricket"
                className="w-full rounded-xl border border-ananda-gold/25 bg-white px-4 py-3 outline-none focus:border-ananda-maroon focus:ring-1 focus:ring-ananda-maroon transition shadow-sm text-sm"
                required
              />
            </div>

            <div>
              <label className="font-display text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">
                Category
              </label>
              <div className="relative">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full appearance-none rounded-xl border border-ananda-gold/25 bg-white px-4 py-3 pr-10 outline-none focus:border-ananda-maroon focus:ring-1 focus:ring-ananda-maroon transition shadow-sm text-sm"
                >
                  <option value="TEAM">Team Sport</option>
                  <option value="INDIVIDUAL">Individual Sport</option>
                  <option value="AQUATIC">Aquatic Sport</option>
                  <option value="ATHLETICS">Athletics</option>
                  <option value="OTHER">Other</option>
                </select>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>
            </div>

            <div>
              <label className="font-display text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">
                Display Order
              </label>
              <input
                type="number"
                name="displayOrder"
                value={formData.displayOrder}
                onChange={handleChange}
                className="w-full rounded-xl border border-ananda-gold/25 bg-white px-4 py-3 outline-none focus:border-ananda-maroon focus:ring-1 focus:ring-ananda-maroon transition shadow-sm text-sm"
              />
            </div>

            <div>
              <label className="font-display text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                placeholder="Write a short description about this sport..."
                className="w-full rounded-xl border border-ananda-gold/25 bg-white px-4 py-3 outline-none focus:border-ananda-maroon focus:ring-1 focus:ring-ananda-maroon transition shadow-sm text-sm"
              />
            </div>

            <div className="space-y-2">
              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-xl bg-ananda-maroon px-6 py-3 font-semibold text-white hover:bg-ananda-dark-maroon disabled:cursor-not-allowed disabled:opacity-70 transition duration-300 font-display text-xs font-bold uppercase tracking-wider cursor-pointer hover:scale-[1.01]"
              >
                {saving
                  ? "Saving..."
                  : editingSportId
                    ? "Update Sport"
                    : "Add Sport"}
              </button>

              {editingSportId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="w-full rounded-xl border border-ananda-maroon/30 px-6 py-3 font-semibold text-ananda-maroon hover:bg-ananda-cream/45 transition duration-300 font-display text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </Reveal>

        {/* List Column */}
        <Reveal className="rounded-2xl border border-ananda-gold/15 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="font-display mb-5 text-lg font-bold uppercase tracking-tight text-ananda-maroon">
            Sports List
          </h2>

          {loading && (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-ananda-gold/30 border-t-ananda-maroon" />
              <p className="font-display text-xs uppercase tracking-wider text-ananda-maroon animate-pulse">Loading sports...</p>
            </div>
          )}

          {!loading && sports.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-500">
              No sports found.
            </div>
          )}

          {!loading && sports.length > 0 && (
            <div className="overflow-hidden border border-ananda-gold/15 rounded-2xl shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-ananda-gold/15 bg-ananda-cream/35 font-display text-xs font-bold uppercase tracking-wider text-ananda-dark-maroon">
                      <th className="px-5 py-4">Name</th>
                      <th className="px-5 py-4">Category</th>
                      <th className="px-5 py-4">Order</th>
                      <th className="px-5 py-4 text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {sports.map((sport) => (
                      <tr key={sport._id} className="hover:bg-gray-50/50 transition">
                        <td className="px-5 py-4">
                          <p className="font-semibold text-ananda-dark-maroon">
                            {sport.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            /sports/{sport.slug}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                          {sport.category}
                        </td>

                        <td className="px-5 py-4 text-sm font-semibold text-gray-700">
                          {sport.displayOrder}
                        </td>

                        <td className="px-5 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEdit(sport)}
                              className="font-display text-[10px] font-bold uppercase tracking-wider bg-ananda-gold hover:bg-ananda-light-gold text-ananda-dark-maroon px-3 py-1.5 rounded-lg transition duration-250 cursor-pointer"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => handleDelete(sport._id)}
                              className="font-display text-[10px] font-bold uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg transition duration-250 cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </Reveal>
      </div>
    </div>
  );
}

export default AdminSports;
