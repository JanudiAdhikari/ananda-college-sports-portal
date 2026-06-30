import { useEffect, useState } from "react";
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
      <p className="mb-2 text-sm font-semibold uppercase text-ananda-gold">
        Admin Panel
      </p>

      <h1 className="mb-2 text-3xl font-bold text-ananda-dark-maroon">
        Manage Users
      </h1>

      <p className="mb-8 text-gray-700">
        Create login accounts for sports teachers, photography club, and
        videography club.
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
            {editingUserId ? "Edit User" : "Add New User"}
          </h2>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block font-semibold text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Example: Photography Club Admin"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-ananda-maroon"
                required
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold text-gray-700">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Example: photo_admin"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-ananda-maroon"
                required
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold text-gray-700">
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
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-ananda-maroon"
                required={!editingUserId}
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold text-gray-700">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-ananda-maroon"
                required
              >
                {roleOptions.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>

            {editingUserId && (
              <label className="flex items-center gap-3 rounded-xl bg-ananda-cream px-4 py-3">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                />
                <span className="font-semibold text-ananda-dark-maroon">
                  Active user
                </span>
              </label>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-xl bg-ananda-maroon px-6 py-3 font-semibold text-white hover:bg-ananda-dark-maroon disabled:cursor-not-allowed disabled:opacity-70"
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
                className="w-full rounded-xl border border-ananda-maroon px-6 py-3 font-semibold text-ananda-maroon hover:bg-ananda-light-gold"
              >
                Cancel Edit
              </button>
            )}
          </form>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-md lg:col-span-2">
          <div className="mb-5">
            <h2 className="mb-4 text-xl font-bold text-ananda-maroon">
              Users List
            </h2>

            <div className="grid gap-3 md:grid-cols-2">
              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="Search users..."
                className="rounded-xl border border-gray-300 px-4 py-2 outline-none focus:border-ananda-maroon"
              />

              <select
                value={filterRole}
                onChange={handleRoleFilterChange}
                className="rounded-xl border border-gray-300 px-4 py-2 outline-none focus:border-ananda-maroon"
              >
                <option value="ALL">All Roles</option>
                {roleOptions.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading && <p className="text-gray-600">Loading users...</p>}

          {!loading && users.length === 0 && (
            <p className="text-gray-600">No users found.</p>
          )}

          {!loading && users.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b bg-ananda-cream text-sm text-ananda-dark-maroon">
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((selectedUser) => (
                    <tr key={selectedUser._id} className="border-b">
                      <td className="px-4 py-4">
                        <p className="font-semibold text-ananda-dark-maroon">
                          {selectedUser.fullName}
                        </p>
                        <p className="text-sm text-gray-500">
                          @{selectedUser.username}
                        </p>
                      </td>

                      <td className="px-4 py-4 text-gray-700">
                        {getRoleLabel(selectedUser.role)}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={
                            selectedUser.isActive
                              ? "rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700"
                              : "rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700"
                          }
                        >
                          {selectedUser.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleEdit(selectedUser)}
                            className="rounded-lg bg-ananda-gold px-3 py-2 text-sm font-semibold text-ananda-dark-maroon hover:opacity-90"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDeactivate(selectedUser._id)}
                            disabled={
                              !selectedUser.isActive ||
                              loggedUser?.id === selectedUser._id
                            }
                            className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
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
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminUsers;