import { useNavigate } from "react-router-dom";
import Profile from "./Profile";

const Dashboard = () => {
const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gradient-to-b from-slate-50 to-white text-slate-50">
      <nav className="flex items-center justify-between p-4 md:p-6 border-b border-slate-100 dark:bg-slate-800 backdrop-blur-sm">
        <div onClick={() => navigate("/")} className="cursor-pointer flex items-center gap-3 font-bold text-lg">
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
            className="cursor-pointer text-slate-900 border border-slate-200 px-3 py-2 bg-slate-200 rounded-md hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200"
            onClick={() => navigate("/transactions")}
            aria-label="Transactions"
          >
            Transactions
          </button>

          <button
            type="button"
            className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
            onClick={() => navigate("/usage")}
            aria-label="Go to profile"
          >
            Data Usage
          </button>
        </div>
      </nav>
      
      <Profile />

      <footer className="p-4 md:p-6 text-sm text-slate-400 border-t border-slate-100 flex items-center justify-between">
        <span>
          © {new Date().getFullYear()} MyApp — Built with React
        </span>
        <button
          type="button"
          className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          onClick={() => navigate("/ticket")}
          aria-label="Go to ticket"
        >
          Submit a Ticket
        </button>
      </footer>
    </div>
  );
};

export default Dashboard;
