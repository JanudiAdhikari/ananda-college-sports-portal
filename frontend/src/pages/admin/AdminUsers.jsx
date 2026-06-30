import { useEffect, useRef, useState } from "react";
import {
  createUser,
  deactivateUser,
  getUsers,
  updateUser,
} from "../../services/userService";
import { useAuth } from "../../hooks/useAuth";

const initialFormData = {
  fullName: "",
  username: "",
  password: "",
  role: "PHOTO_CLUB",
  isActive: true,
};

const roleOptions = [
  { value: "SUPER_ADMIN", label: "Super Admin" },
  { value: "SPORTS_TEACHER", label: "Sports Teacher" },
  { value: "PHOTO_CLUB", label: "Photography Club" },
  { value: "VIDEO_CLUB", label: "Videography Club" },
];

const getRoleLabel = (value) => {
  return roleOptions.find((item) => item.value === value)?.label || value;
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

function AdminUsers() {
  const { user: loggedUser } = useAuth();

  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [editingUserId, setEditingUserId] = useState(null);

  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const buildUserParams = () => {
    const params = {};

    if (search.trim()) {
      params.search = search.trim();
    }

    if (filterRole !== "ALL") {
      params.role = filterRole;
    }

    return params;
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getUsers(buildUserParams());
      setUsers(data.users);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const params = {};

    if (search.trim()) {
      params.search = search.trim();
    }

    if (filterRole !== "ALL") {
      params.role = filterRole;
    }

    const timeoutId = setTimeout(() => {
      getUsers(params)
        .then((data) => {
          if (!isMounted) {
            return;
          }

          setUsers(data.users);
          setError("");
        })
        .catch((error) => {
          if (!isMounted) {
            return;
          }

          setError(error.response?.data?.message || "Failed to load users.");
        })
        .finally(() => {
          if (!isMounted) {
            return;
          }

          setLoading(false);
        });
    }, 300);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [search, filterRole]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    setMessage("");
    setError("");
  };

  const handleSearchChange = (event) => {
    setLoading(true);
    setSearch(event.target.value);
    setMessage("");
    setError("");
  };

  const handleRoleFilterChange = (event) => {
    setLoading(true);
    setFilterRole(event.target.value);
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
        fullName: formData.fullName,
        username: formData.username,
        role: formData.role,
        isActive: formData.isActive,
      };

      if (formData.password) {
        payload.password = formData.password;
      }

      if (!editingUserId && !payload.password) {
        setError("Password is required when creating a new user.");
        return;
      }

      if (editingUserId) {
        await updateUser(editingUserId, payload);
        setMessage("User updated successfully.");
      } else {
        await createUser(payload);
        setMessage("User created successfully.");
      }

      setEditingUserId(null);
      setFormData(initialFormData);

      await loadUsers();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to save user.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (selectedUser) => {
    setEditingUserId(selectedUser._id);

    setFormData({
      fullName: selectedUser.fullName || "",
      username: selectedUser.username || "",
      password: "",
      role: selectedUser.role || "PHOTO_CLUB",
      isActive: selectedUser.isActive,
    });

    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setFormData(initialFormData);
    setMessage("");
    setError("");
  };

  const handleDeactivate = async (userId) => {
    const confirmed = window.confirm(
      "Are you sure you want to deactivate this user?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setMessage("");
      setError("");

      await deactivateUser(userId);
      setMessage("User deactivated successfully.");
      await loadUsers();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to deactivate user.");
    }
  };

  return (
    <div>
      <p className="font-display mb-1 text-xs font-semibold uppercase tracking-wider text-ananda-gold">
        Admin Panel
      </p>

      <h1 className="font-display mb-2 text-3xl font-bold uppercase tracking-tight text-ananda-dark-maroon">
        Manage Users
      </h1>

      <p className="mb-8 text-sm text-gray-600">
        Create login accounts for sports teachers, photography club, and
        videography club.
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
            {editingUserId ? "Edit User" : "Add New User"}
          </h2>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="font-display text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. Photography Club Admin"
                className="w-full rounded-xl border border-ananda-gold/25 bg-white px-4 py-3 outline-none focus:border-ananda-maroon focus:ring-1 focus:ring-ananda-maroon transition shadow-sm text-sm"
                required
              />
            </div>

            <div>
              <label className="font-display text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="e.g. photo_admin"
                className="w-full rounded-xl border border-ananda-gold/25 bg-white px-4 py-3 outline-none focus:border-ananda-maroon focus:ring-1 focus:ring-ananda-maroon transition shadow-sm text-sm"
                required
              />
            </div>

            <div>
              <label className="font-display text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={
                  editingUserId
                    ? "Leave blank to keep current password"
                    : "Enter password"
                }
                className="w-full rounded-xl border border-ananda-gold/25 bg-white px-4 py-3 outline-none focus:border-ananda-maroon focus:ring-1 focus:ring-ananda-maroon transition shadow-sm text-sm"
                required={!editingUserId}
              />
            </div>

            <div>
              <label className="font-display text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">
                Role
              </label>
              <div className="relative">
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full appearance-none rounded-xl border border-ananda-gold/25 bg-white px-4 py-3 pr-10 outline-none focus:border-ananda-maroon focus:ring-1 focus:ring-ananda-maroon transition shadow-sm text-sm"
                  required
                >
                  {roleOptions.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-gray-555">
                  <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>
            </div>

            {editingUserId && (
              <label className="flex items-center gap-3 rounded-xl border border-ananda-gold/15 bg-ananda-cream/15 px-4 py-3.5 cursor-pointer hover:bg-ananda-cream/35 transition">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="rounded border-ananda-gold/25 text-ananda-maroon focus:ring-ananda-maroon h-4 w-4 cursor-pointer"
                />
                <span className="font-display text-xs font-bold uppercase tracking-wider text-ananda-dark-maroon">
                  Active user
                </span>
              </label>
            )}

            <div className="space-y-2">
              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-xl bg-ananda-maroon px-6 py-3 font-semibold text-white hover:bg-ananda-dark-maroon disabled:cursor-not-allowed disabled:opacity-70 transition duration-300 font-display text-xs font-bold uppercase tracking-wider cursor-pointer hover:scale-[1.01]"
              >
                {saving
                  ? "Saving..."
                  : editingUserId
                    ? "Update User"
                    : "Create User"}
              </button>

              {editingUserId && (
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
          <div className="mb-6 flex flex-col gap-4">
            <h2 className="font-display text-lg font-bold uppercase tracking-tight text-ananda-maroon">
              Users List
            </h2>

            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
              {/* Search */}
              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="Search users..."
                className="rounded-xl border border-ananda-gold/25 bg-white px-4 py-2 text-xs font-semibold outline-none focus:border-ananda-maroon focus:ring-1 focus:ring-ananda-maroon transition shadow-sm"
              />

              {/* Role Filter */}
              <div className="relative">
                <select
                  value={filterRole}
                  onChange={handleRoleFilterChange}
                  className="w-full appearance-none rounded-xl border border-ananda-gold/25 bg-white pl-3 pr-8 py-2.5 text-xs font-semibold uppercase tracking-wider outline-none focus:border-ananda-maroon focus:ring-1 focus:ring-ananda-maroon transition shadow-sm"
                >
                  <option value="ALL">All Roles</option>
                  {roleOptions.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-gray-555">
                  <svg className="h-3 w-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>
            </div>
          </div>

          {loading && (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-ananda-gold/30 border-t-ananda-maroon" />
              <p className="font-display text-xs uppercase tracking-wider text-ananda-maroon animate-pulse">Loading users...</p>
            </div>
          )}

          {!loading && users.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-500">
              No users found matching the search criteria.
            </div>
          )}

          {!loading && users.length > 0 && (
            <div className="overflow-hidden border border-ananda-gold/15 rounded-2xl shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-ananda-gold/15 bg-ananda-cream/35 font-display text-xs font-bold uppercase tracking-wider text-ananda-dark-maroon">
                      <th className="px-5 py-4">User</th>
                      <th className="px-5 py-4">Role</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-5 py-4 text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {users.map((selectedUser) => (
                      <tr key={selectedUser._id} className="hover:bg-gray-50/50 transition">
                        <td className="px-5 py-4">
                          <p className="font-semibold text-ananda-dark-maroon">
                            {selectedUser.fullName}
                          </p>
                          <p className="text-xs text-gray-400">
                            @{selectedUser.username}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-550">
                          {getRoleLabel(selectedUser.role)}
                        </td>

                        <td className="px-5 py-4">
                          {selectedUser.isActive ? (
                            <span className="inline-flex items-center rounded-full bg-green-50 border border-green-200 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-green-600">
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-red-50 border border-red-200 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-600">
                              Inactive
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEdit(selectedUser)}
                              className="font-display text-[10px] font-bold uppercase tracking-wider bg-ananda-gold hover:bg-ananda-light-gold text-ananda-dark-maroon px-3 py-1.5 rounded-lg transition duration-250 cursor-pointer"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => handleDeactivate(selectedUser._id)}
                              disabled={
                                !selectedUser.isActive ||
                                loggedUser?.id === selectedUser._id
                              }
                              className="font-display text-[10px] font-bold uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg transition duration-250 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                            >
                              Deactivate
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

export default AdminUsers;