function Login() {
  return (
    <section className="mx-auto flex max-w-7xl justify-center px-6 py-16">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-3xl font-bold text-ananda-dark-maroon">
          Admin Login
        </h1>

        <p className="mb-8 text-gray-600">
          Authorized users only.
        </p>

        <form className="space-y-5">
          <div>
            <label className="mb-2 block font-semibold text-gray-700">
              Username
            </label>
            <input
              type="text"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-ananda-maroon"
              placeholder="Enter username"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold text-gray-700">
              Password
            </label>
            <input
              type="password"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-ananda-maroon"
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-ananda-maroon px-6 py-3 font-semibold text-white hover:bg-ananda-dark-maroon"
          >
            Login
          </button>
        </form>
      </div>
    </section>
  );
}

export default Login;