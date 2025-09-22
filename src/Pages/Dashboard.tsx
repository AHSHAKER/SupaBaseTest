import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const goToProfile = () => {
    navigate("/profile");
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <nav className="flex items-center justify-between p-4 md:p-6 border-b border-slate-100 bg-white/60 backdrop-blur-sm">
        <div className="flex items-center gap-3 font-bold text-lg">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
            <rect width="24" height="24" rx="6" fill="#2563eb" />
            <path d="M7 12h10" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M7 8h6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span>MyApp</span>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            className="bg-transparent text-slate-900 border border-slate-200 px-3 py-2 rounded-md hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200"
            onClick={() => navigate("/about")}
            aria-label="About"
          >
            About
          </button>

          <button
            type="button"
            className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
            onClick={goToProfile}
            aria-label="Go to profile"
          >
            Profile
          </button>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center p-8">
        <section className="max-w-3xl w-full bg-white rounded-xl p-8 shadow-lg grid gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold m-0">Welcome to your dashboard</h1>
            <p className="text-slate-500 leading-relaxed mt-2">
              This is a simple landing page with a navigation bar. Click the Profile button to go to
              your profile page. The router will handle the navigation (uses react-router-dom).
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-3 mt-2">
              <button
                type="button"
                className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                onClick={goToProfile}
              >
                Go to Profile
              </button>

              <button
                type="button"
                className="bg-transparent text-slate-900 border border-slate-200 px-3 py-2 rounded-md hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200"
                onClick={() => navigate("/features")}
              >
                View features
              </button>
            </div>

            <div className="text-slate-400 text-sm">
              Logged in as <strong className="text-slate-700"></strong>
            </div>
          </div>
        </section>
      </main>

      <footer className="p-4 md:p-6 text-sm text-slate-400 border-t border-slate-100">
        © {new Date().getFullYear()} MyApp — Built with React
      </footer>
    </div>
  );
};

export default Dashboard;
