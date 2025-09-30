import { Outlet, useNavigate } from "react-router-dom";

const Layout = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50">
      <nav className="sticky top-0 z-20 flex flex-wrap items-center justify-between px-3 sm:px-4 md:px-6 py-3 md:py-6 border-b border-slate-100 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md shadow-sm">
        <div
          onClick={() => navigate("/")}
          className="cursor-pointer flex items-center gap-3 font-bold text-lg text-slate-800 dark:text-slate-50 min-w-0"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
            <rect width="24" height="24" rx="6" fill="#2563eb" />
            <path d="M7 12h10" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M7 8h6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="truncate">MyApp</span>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 items-stretch  sm:w-auto mt-3 sm:mt-0">
          <button
            type="button"
            className="cursor-pointer text-slate-700 border border-slate-200 px-3 py-2 bg-slate-100 rounded-md font-medium hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 transition w-full sm:w-auto"
            onClick={() => navigate("/transactions")}
            aria-label="Transactions"
          >
            Transactions
          </button>

          <button
            type="button"
            className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition w-full sm:w-auto"
            onClick={() => navigate("/usage")}
            aria-label="Go to profile"
          >
            Data Usage
          </button>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-start">
        <div className="w-full max-w-6xl px-2 sm:px-4 md:px-6 py-6 md:py-8">
          <Outlet />
        </div>
      </main>

      <footer className="p-3 md:p-6 text-sm text-slate-400 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 bg-white/80 dark:bg-slate-800/80">
        <span className="truncate">
          © {new Date().getFullYear()} MyApp — Built with React
        </span>
        <button
          type="button"
          className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition w-full sm:w-auto"
          onClick={() => navigate("/ticket")}
          aria-label="Go to ticket"
        >
          Submit a Ticket
        </button>
      </footer>
    </div>
  );
};

export default Layout;