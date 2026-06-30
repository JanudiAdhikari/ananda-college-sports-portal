import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 text-center">
      <p className="mb-3 text-sm font-semibold uppercase text-ananda-gold">
        404 Error
      </p>

      <h1 className="mb-4 text-4xl font-bold text-ananda-dark-maroon">
        Page Not Found
      </h1>

      <p className="mx-auto mb-8 max-w-2xl text-gray-700">
        The page you are looking for does not exist or may have been moved.
      </p>

      <Link
        to="/"
        className="inline-block rounded-xl bg-ananda-maroon px-6 py-3 font-semibold text-white hover:bg-ananda-dark-maroon"
      >
        Go Back Home
      </Link>
    </section>
  );
}

export default NotFound;