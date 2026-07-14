import { useEffect, useRef, useState } from"react";
import { Navigate, useNavigate } from"react-router-dom";
import { useAuth } from"../../hooks/useAuth";
import backgroundImg from"../../assets/background1.jpeg";

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
      { threshold: 0.01 }
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

function Login() {
  const navigate = useNavigate();
  const { login, loading, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    username:"",
    password:"",
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
    <section
      className="relative flex min-h-[calc(100vh-80px)] items-center justify-center bg-cover bg-center bg-no-repeat px-6 py-16"
      style={{ backgroundImage:`url(${backgroundImg})` }}
    >
      {/* Dark overlay with slight blur */}
      <div className="absolute inset-0 bg-ananda-dark-maroon/65 backdrop-blur-[2px]" />

      {/* FORM PANEL CONTAINER */}
      <div className="relative z-10 w-full max-w-md">
        <Reveal className="w-full rounded-3xl border border-ananda-gold/20 bg-white/95 p-8 shadow-2xl sm:p-10 backdrop-blur-md">
          <div className="mb-2 flex items-center gap-2">
            <span className="font-display text-xs font-semibold tracking-[0.25em] text-ananda-gold">
              Ananda College
            </span>
          </div>

          <h2 className="font-display text-2xl font-bold tracking-tight text-ananda-dark-maroon">
            Admin Login
          </h2>
          <p className="mb-8 mt-1 text-xs font-semibold tracking-wider text-gray-400">
            Sign in with your school-issued credentials.
          </p>

          {error && (
            <div className="mb-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-bold tracking-wider text-red-700">
              <svg
                className="mt-0.5 h-4 w-4 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
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
                className="font-display mb-1.5 block text-xs font-bold tracking-wider text-gray-505"
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
                className="w-full rounded-xl border border-ananda-gold/25 bg-white px-4 py-3 text-sm outline-none transition focus:border-ananda-maroon focus:ring-1 focus:ring-ananda-maroon"
                placeholder="Enter username"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="font-display mb-1.5 block text-xs font-bold tracking-wider text-gray-500"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ?"text" :"password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-ananda-gold/25 bg-white px-4 py-3 pr-12 text-sm outline-none transition focus:border-ananda-maroon focus:ring-1 focus:ring-ananda-maroon"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-extrabold tracking-wider text-gray-400 transition hover:text-ananda-maroon cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ?"Hide" :"Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="font-display flex w-full items-center justify-center gap-2 rounded-xl bg-ananda-maroon px-6 py-3.5 text-xs font-bold tracking-wider text-white transition hover:bg-ananda-dark-maroon disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer hover:scale-[1.01]"
            >
              {loading && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              )}
              {loading ?"Logging in..." :"Login"}
            </button>
          </form>

          <p className="mt-8 text-center text-[10px] font-bold tracking-wider text-gray-400">
            Accounts are created by the school administrator. There is no
            public registration.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

export default Login;