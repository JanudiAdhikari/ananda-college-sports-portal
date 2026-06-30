import { useEffect, useState } from "react";
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
      <p className="mb-2 text-sm font-semibold uppercase text-ananda-gold">
        Admin Panel
      </p>

      <h1 className="mb-2 text-3xl font-bold text-ananda-dark-maroon">
        Manage Sports
      </h1>

      <p className="mb-8 text-gray-700">
        Add, edit, and delete sports available at Ananda College.
      </p>

      {message && (
        <div className="mb-6 rounded-xl bg-green-50 px-4 py-3 text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-md lg:col-span-1">
          <h2 className="mb-5 text-xl font-bold text-ananda-maroon">
            {editingSportId ? "Edit Sport" : "Add New Sport"}
          </h2>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block font-semibold text-gray-700">
                Sport Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Example: Cricket"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-ananda-maroon"
                required
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold text-gray-700">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-ananda-maroon"
              >
                <option value="TEAM">Team Sport</option>
                <option value="INDIVIDUAL">Individual Sport</option>
                <option value="AQUATIC">Aquatic Sport</option>
                <option value="ATHLETICS">Athletics</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block font-semibold text-gray-700">
                Display Order
              </label>
              <input
                type="number"
                name="displayOrder"
                value={formData.displayOrder}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-ananda-maroon"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                placeholder="Write a short description about this sport..."
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-ananda-maroon"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-xl bg-ananda-maroon px-6 py-3 font-semibold text-white hover:bg-ananda-dark-maroon disabled:cursor-not-allowed disabled:opacity-70"
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
                className="w-full rounded-xl border border-ananda-maroon px-6 py-3 font-semibold text-ananda-maroon hover:bg-ananda-light-gold"
              >
                Cancel Edit
              </button>
            )}
          </form>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-md lg:col-span-2">
          <h2 className="mb-5 text-xl font-bold text-ananda-maroon">
            Sports List
          </h2>

          {loading && <p className="text-gray-600">Loading sports...</p>}

          {!loading && sports.length === 0 && (
            <p className="text-gray-600">No sports found.</p>
          )}

          {!loading && sports.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b bg-ananda-cream text-sm text-ananda-dark-maroon">
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Order</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {sports.map((sport) => (
                    <tr key={sport._id} className="border-b">
                      <td className="px-4 py-4">
                        <p className="font-semibold text-ananda-dark-maroon">
                          {sport.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          /sports/{sport.slug}
                        </p>
                      </td>

                      <td className="px-4 py-4 text-gray-700">
                        {sport.category}
                      </td>

                      <td className="px-4 py-4 text-gray-700">
                        {sport.displayOrder}
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleEdit(sport)}
                            className="rounded-lg bg-ananda-gold px-3 py-2 text-sm font-semibold text-ananda-dark-maroon hover:opacity-90"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(sport._id)}
                            className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
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
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminSports;
