import { useEffect, useRef, useState } from"react";
import {
  createUser,
  deactivateUser,
  getUsers,
  updateUser,
} from"../../services/userService";
import { useAuth } from"../../hooks/useAuth";

const initialFormData = {
  fullName:"",
  username:"",
  password:"",
  role:"PHOTO_CLUB",
  isActive: true,
};

const roleOptions = [
  { value:"SUPER_ADMIN", label:"Super Admin" },
  { value:"SPORTS_TEACHER", label:"Sports Teacher" },
  { value:"PHOTO_CLUB", label:"Photography Club" },
  { value:"VIDEO_CLUB", label:"Videography Club" },
];

const getRoleLabel = (value) => {
  return roleOptions.find((item) => item.value === value)?.label || value;
};

// Scroll-triggered reveal wrapper — fades sections in once
function Reveal({ children, className ="" }) {
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
    <div ref={ref} className={`${visible ?"reveal" :"opacity-0"} ${className}`}>
      {children}
    </div>
  );
}

function AdminUsers() {
  const { user: loggedUser } = useAuth();

  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [editingUserId, setEditingUserId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("ALL");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const buildUserParams = () => {
    const params = {};

    if (search.trim()) {
      params.search = search.trim();
    }

    if (filterRole !=="ALL") {
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
      setCurrentPage(1);
    } catch (error) {
      setError(error.response?.data?.message ||"Failed to load users.");
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

    if (filterRole !=="ALL") {
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
          setCurrentPage(1);
        })
        .catch((error) => {
          if (!isMounted) {
            return;
          }

          setError(error.response?.data?.message ||"Failed to load users.");
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
      [name]: type ==="checkbox" ? checked : value,
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
      setIsFormOpen(false);

      await loadUsers();
    } catch (error) {
      setError(error.response?.data?.message ||"Failed to save user.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (selectedUser) => {
    setEditingUserId(selectedUser._id);

    setFormData({
      fullName: selectedUser.fullName ||"",
      username: selectedUser.username ||"",
      password:"",
      role: selectedUser.role ||"PHOTO_CLUB",
      isActive: selectedUser.isActive,
    });

    setMessage("");
    setError("");
    setIsFormOpen(true);
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setFormData(initialFormData);
    setIsFormOpen(false);
    setMessage("");
    setError("");
  };

  const handleDeactivate = async (userId) => {
    const confirmed = window.confirm("Are you sure you want to deactivate this user?"
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
      setError(error.response?.data?.message ||"Failed to deactivate user.");
    }
  };

  // Pagination Logic
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = users.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <p className="font-display mb-1 text-xs font-semibold tracking-wider text-ananda-gold">
            Admin Panel
          </p>
          <h1 className="font-display text-3xl font-bold tracking-tight text-ananda-dark-maroon">
            Manage Users
          </h1>
        </div>

        <button
          onClick={() => {
            setEditingUserId(null);
            setFormData(initialFormData);
            setIsFormOpen(true);
            setMessage("");
            setError("");
          }}
          className="font-display self-start sm:self-auto rounded-xl bg-ananda-gold px-4 py-2.5 text-xs font-bold tracking-wider text-ananda-dark-maroon hover:bg-ananda-light-gold transition cursor-pointer flex items-center gap-1.5 shadow-sm hover:shadow-md hover:scale-[1.02]"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Add User
        </button>
      </div>

      <p className="mb-8 text-sm text-gray-600">
        Create login accounts for sports teachers, photography club, and
        videography club.
      </p>

      {message && (
        <div className="mb-6 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm font-semibold text-green-700 animate-fade-in">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm font-semibold text-red-700 animate-fade-in">
          {error}
        </div>
      )}

      {/* Full-width spacious view */}
      <Reveal className="rounded-2xl border border-ananda-gold/15 bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-4">
          <h2 className="font-display text-lg font-bold tracking-tight text-ananda-maroon">
            Users List
          </h2>

          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
            {/* Search */}
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search users..."
              className="rounded-xl border border-ananda-gold/25 bg-white px-4 py-2.5 text-xs font-semibold outline-none focus:border-ananda-maroon focus:ring-1 focus:ring-ananda-maroon transition shadow-sm"
            />

            {/* Role Filter */}
            <div className="relative">
              <select
                value={filterRole}
                onChange={handleRoleFilterChange}
                className="w-full appearance-none rounded-xl border border-ananda-gold/25 bg-white pl-3 pr-8 py-2.5 text-xs font-semibold tracking-wider outline-none focus:border-ananda-maroon focus:ring-1 focus:ring-ananda-maroon transition shadow-sm"
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
            <p className="font-display text-xs tracking-wider text-ananda-maroon animate-pulse">Loading users...</p>
          </div>
        )}

        {!loading && users.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-500">
            No users found matching the search criteria.
          </div>
        )}

        {!loading && users.length > 0 && (
          <div>
            <div className="overflow-hidden border border-ananda-gold/15 rounded-2xl shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-ananda-gold/15 bg-ananda-cream/35 font-display text-xs font-bold tracking-wider text-ananda-dark-maroon">
                      <th className="px-5 py-4">User</th>
                      <th className="px-5 py-4">Role</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-5 py-4 text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {paginatedUsers.map((selectedUser) => (
                      <tr key={selectedUser._id} className="hover:bg-gray-50/50 transition">
                        <td className="px-5 py-4">
                          <p className="font-semibold text-ananda-dark-maroon">
                            {selectedUser.fullName}
                          </p>
                          <p className="text-xs text-gray-400">
                            @{selectedUser.username}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-xs font-bold tracking-wider text-gray-550">
                          {getRoleLabel(selectedUser.role)}
                        </td>

                        <td className="px-5 py-4">
                          {selectedUser.isActive ? (
                            <span className="inline-flex items-center rounded-full bg-green-50 border border-green-200 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-green-600">
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-red-50 border border-red-200 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-red-600">
                              Inactive
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEdit(selectedUser)}
                              className="font-display text-[10px] font-bold tracking-wider bg-ananda-gold hover:bg-ananda-light-gold text-ananda-dark-maroon px-3 py-1.5 rounded-lg transition duration-250 cursor-pointer"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => handleDeactivate(selectedUser._id)}
                              disabled={
                                !selectedUser.isActive ||
                                loggedUser?.id === selectedUser._id
                              }
                              className="font-display text-[10px] font-bold tracking-wider bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg transition duration-250 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-gray-100 pt-4">
                <p className="text-xs font-semibold text-gray-500 tracking-wider">
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, users.length)} of {users.length} entries
                </p>
                <div className="flex flex-wrap gap-1">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="font-display text-[10px] font-bold tracking-wider border border-gray-200 bg-white hover:bg-gray-50 text-gray-750 px-3 py-1.5 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition duration-200 cursor-pointer"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`font-display text-[10px] font-bold  tracking-wider px-3 py-1.5 rounded-lg transition duration-200 cursor-pointer ${
                        currentPage === page
                          ?"bg-ananda-maroon text-white shadow-xs"
                          :"border border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="font-display text-[10px] font-bold tracking-wider border border-gray-200 bg-white hover:bg-gray-50 text-gray-750 px-3 py-1.5 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition duration-200 cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </Reveal>

      {/* Overlay Modal Form */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-lg rounded-2xl border border-ananda-gold/15 bg-white p-6 shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={handleCancelEdit}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-655 cursor-pointer transition hover:scale-110"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="font-display mb-5 text-lg font-bold tracking-tight text-ananda-maroon">
              {editingUserId ?"Edit User" :"Add New User"}
            </h2>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="font-display text-xs font-bold tracking-wider text-gray-500 mb-1.5 block">
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
                <label className="font-display text-xs font-bold tracking-wider text-gray-500 mb-1.5 block">
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
                <label className="font-display text-xs font-bold tracking-wider text-gray-500 mb-1.5 block">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={
                    editingUserId
                      ?"Leave blank to keep current password"
                      :"Enter password"
                  }
                  className="w-full rounded-xl border border-ananda-gold/25 bg-white px-4 py-3 outline-none focus:border-ananda-maroon focus:ring-1 focus:ring-ananda-maroon transition shadow-sm text-sm"
                  required={!editingUserId}
                />
              </div>

              <div>
                <label className="font-display text-xs font-bold tracking-wider text-gray-500 mb-1.5 block">
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
                  <span className="font-display text-xs font-bold tracking-wider text-ananda-dark-maroon">
                    Active user
                  </span>
                </label>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-xl bg-ananda-maroon px-6 py-3.5 font-semibold text-white hover:bg-ananda-dark-maroon disabled:cursor-not-allowed disabled:opacity-70 transition duration-300 font-display text-xs font-bold tracking-wider cursor-pointer hover:scale-[1.01]"
                >
                  {saving
                    ?"Saving..."
                    : editingUserId
                      ?"Update User"
                      :"Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;