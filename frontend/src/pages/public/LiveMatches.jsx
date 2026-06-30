function LiveMatches() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="mb-2 text-3xl font-bold text-ananda-dark-maroon">
        Live Matches
      </h1>

      <p className="mb-8 text-gray-700">
        Watch live matches and follow live scores.
      </p>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-md lg:col-span-2">
          <div className="flex h-80 items-center justify-center rounded-xl bg-gray-900 text-white">
            Live video will appear here
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-md">
          <p className="mb-2 text-sm font-semibold uppercase text-ananda-gold">
            Live Score
          </p>

          <h2 className="mb-4 text-2xl font-bold text-ananda-maroon">
            Ananda College vs Opponent
          </h2>

          <div className="space-y-4">
            <div className="rounded-xl bg-ananda-cream p-4">
              <p className="text-sm text-gray-500">Ananda College</p>
              <p className="text-2xl font-bold text-ananda-maroon">
                145/4
              </p>
            </div>

            <div className="rounded-xl bg-ananda-cream p-4">
              <p className="text-sm text-gray-500">Overs</p>
              <p className="text-2xl font-bold text-ananda-maroon">
                18.2
              </p>
            </div>

            <div className="rounded-xl bg-ananda-cream p-4">
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-semibold text-green-700">
                Live
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LiveMatches;