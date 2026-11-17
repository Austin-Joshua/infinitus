'use client';

export default function GlobalError({ error, reset }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F7F5EF] text-[#0C0E1F] flex items-center justify-center p-6 font-sans">
        <div className="max-w-lg text-center space-y-4">
          <p className="font-mono text-xs uppercase tracking-widest text-[#1D2566]">500 · System Anomaly</p>
          <h1 className="text-3xl font-bold">Unexpected Exception</h1>
          <p className="text-sm opacity-80">
            A critical boundary error occurred. Please try reloading or returning home.
          </p>
          <div className="pt-4 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => reset()}
              className="px-4 py-2 bg-[#1D2566] text-white rounded-lg text-sm font-medium hover:opacity-90 transition cursor-pointer"
            >
              Try again
            </button>
            <a
              href="/"
              className="px-4 py-2 border border-[#1D2566]/20 rounded-lg text-sm font-medium hover:bg-black/5 transition"
            >
              Return to Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
