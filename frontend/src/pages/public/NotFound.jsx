import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

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

function NotFound() {
  return (
    <section className="relative overflow-hidden min-h-[70vh] flex items-center justify-center px-6 py-20 bg-ananda-cream/30">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, #7a0c0c 0px, #7a0c0c 1px, transparent 1px, transparent 28px)",
        }}
      />
      
      <Reveal className="relative max-w-xl w-full text-center bg-white border border-ananda-gold/15 p-8 sm:p-12 rounded-3xl shadow-xl">
        <p className="font-display text-8xl font-bold tracking-widest text-ananda-gold animate-pulse">
          404
        </p>

        <h1 className="font-display mt-6 text-3xl font-bold uppercase tracking-tight text-ananda-dark-maroon">
          Page Not Found
        </h1>

        <p className="mt-4 text-gray-600 leading-relaxed">
          The page you are looking for does not exist, has been removed, or is temporarily unavailable.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="font-display rounded-xl bg-ananda-maroon px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-ananda-dark-maroon hover:scale-[1.02] shadow-sm"
          >
            Go Back Home
          </Link>
          
          <Link
            to="/sports"
            className="font-display rounded-xl border border-ananda-maroon/30 px-6 py-3 text-sm font-bold uppercase tracking-wide text-ananda-maroon hover:bg-ananda-cream transition hover:scale-[1.02]"
          >
            Explore Sports
          </Link>
        </div>
      </Reveal>
    </section>
  );
}

export default NotFound;