import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function Login() {
  const navigate = useNavigate();
  const { login, loading, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await login(formData.username, formData.password);
    if (result.success) {
      navigate("/admin");
    } else {
      setError(result.message);
    }
  };

  return (
    <section className="flex min-h-[calc(100vh-80px)] items-stretch">
      {/* BRAND PANEL */}
      <div className="relative hidden w-1/2 overflow-hidden bg-ananda-dark-maroon lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, white 0px, white 1px, transparent 1px, transparent 28px)",
          }}
        />

        <p className="font-display relative text-xs font-semibold uppercase tracking-[0.3em] text-ananda-gold">
          Ananda College &middot; Colombo 10
        </p>

        <div className="relative">
          <h1 className="font-display text-4xl font-bold uppercase leading-tight tracking-tight text-white">
            Sports Portal
            <br />
            Control Room
          </h1>
          <p className="mt-4 max-w-sm text-ananda-light-gold/85">
            This area is reserved for sports teachers, the photography club,
            and the videography club to manage teams, fixtures, galleries,
            and live coverage.
          </p>
        </div>

        <p className="font-display relative text-xs uppercase tracking-wide text-ananda-light-gold/50">
          Authorized access only
        </p>
      </div>

      {/* FORM PANEL */}
      <div className="flex w-full items-center justify-center bg-ananda-cream/40 px-6 py-16 lg:w-1/2">
        <div className="reveal w-full max-w-md rounded-3xl border border-ananda-gold/15 bg-white p-8 shadow-lg sm:p-10">
          <div className="mb-2 flex items-center gap-2 lg:hidden">
            <span className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-ananda-gold">
              Ananda College
            </span>
          </div>

          <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-ananda-dark-maroon">
            Admin Login
          </h2>
          <p className="mb-8 mt-1 text-sm text-gray-500">
            Sign in with your school-issued credentials.
          </p>

          {error && (
            <div className="mb-5 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              <svg
                className="mt-0.5 h-4 w-4 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v3.75m0 3.75h.008v.008H12v-.008zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="username"
                className="font-display mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                autoComplete="username"
                className="w-full rounded-xl border border-gray-200 bg-ananda-cream/30 px-4 py-3 text-sm outline-none transition focus:border-ananda-maroon focus:bg-white focus:ring-4 focus:ring-ananda-maroon/10"
                placeholder="Enter username"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="font-display mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-gray-200 bg-ananda-cream/30 px-4 py-3 pr-12 text-sm outline-none transition focus:border-ananda-maroon focus:bg-white focus:ring-4 focus:ring-ananda-maroon/10"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold uppercase tracking-wide text-gray-400 transition hover:text-ananda-maroon"
                  tabIndex={-1}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="font-display flex w-full items-center justify-center gap-2 rounded-xl bg-ananda-maroon px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-ananda-dark-maroon disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              )}
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-gray-400">
            Accounts are created by the school administrator. There is no
            public registration.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Login;