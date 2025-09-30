import { signOut } from "../hooks/useAuth";
import useAuthStore from "../Store/authStore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import CartModal from "../Pages/cart";

const getInitials = (name?: string | null, email?: string | null) => {
  if (name) {
    return name
      .split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }
  if (email) return email.charAt(0).toUpperCase();
  return "U";
};

const Profile = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const profile = useAuthStore((state) => state);
  const Nav = useNavigate();

  const displayName = profile?.full_name || profile?.email || "User";
  const planName = profile?.plan?.code || "Free";
  const initials = getInitials(profile?.full_name, profile?.email);

  return (
    <div className="flex flex-col md:flex-row gap-6 mx-4 md:mx-6">
      {/* Sidebar stacks on top for mobile */}
      <aside className="w-full md:w-64 bg-white rounded-2xl shadow-lg border border-slate-200 p-6 flex flex-col gap-6 top-24">
        {/* Profile Header */}
        <div className="flex flex-col items-center gap-3 pb-6 border-b border-slate-100">
          <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold shadow-md">
            {initials}
          </div>
          <div className="text-center">
            <h2 className="text-lg font-bold text-slate-800 overflow-hidden text-ellipsis whitespace-nowrap">{displayName}</h2>
            <p className="text-sm text-slate-500 overflow-hidden text-ellipsis whitespace-nowrap">{profile?.email}</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 text-blue-700 px-3 py-1 text-xs font-semibold ring-1 ring-blue-300">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none">
              <path d="M12 2v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 22v-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {planName}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => Nav("/edit-account")}
            className="w-full px-4 py-2 rounded-md bg-slate-100 text-slate-700 text-sm font-medium border border-slate-200 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 transition"
          >
            Edit Account
          </button>
          <button
            onClick={() => signOut()}
            className="w-full px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
          >
            Sign Out
          </button>
          <button
            onClick={() => setCartOpen(true)}
            className="w-full px-4 py-2 rounded-md bg-green-600 text-white text-sm font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300 transition"
          >
            View Cart
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          <h3 className="text-lg font-bold text-slate-800">Account Details</h3>
          <p className="mt-2 text-sm text-slate-500">
            Review and manage your personal info.
          </p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden">
              <div className="text-xs text-slate-400">Full name</div>
              <div className="mt-1 text-sm text-slate-800 overflow-hidden text-ellipsis whitespace-nowrap">{profile?.full_name ?? "—"}</div>
            </div>

            <div className="p-4 bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden">
              <div className="text-xs text-slate-400">Email</div>
              <div className="mt-1 text-sm text-slate-800 overflow-hidden text-ellipsis whitespace-nowrap">{profile?.email ?? "—"}</div>
            </div>

            <div className="p-4 bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden">
              <div className="text-xs text-slate-400">Phone</div>
              <div className="mt-1 text-sm text-slate-800 overflow-hidden text-ellipsis whitespace-nowrap">{profile?.phone ?? "—"}</div>
            </div>

            <div className="p-4 bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden">
              <div className="text-xs text-slate-400">City</div>
              <div className="mt-1 text-sm text-slate-800 overflow-hidden text-ellipsis whitespace-nowrap">{profile?.city ?? "—"}</div>
            </div>

            <div className="col-span-1 sm:col-span-2 p-4 bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden">
              <div className="text-xs text-slate-400">Address</div>
              <div className="mt-1 text-sm text-slate-800 overflow-hidden text-ellipsis whitespace-nowrap">{profile?.address ?? "—"}</div>
            </div>

            <div className="col-span-1 sm:col-span-2 p-4 rounded-lg bg-blue-50 text-sm text-blue-700 border border-blue-100 overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-blue-400">Subscription</div>
                  <div className="mt-1 font-semibold overflow-hidden text-ellipsis whitespace-nowrap">{planName}</div>
                </div>
                <div>
                  <button 
                    onClick={() => Nav("/plans")}
                    className="px-3 py-1 rounded-md bg-blue-100 text-blue-700 text-sm font-medium hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                  >
                    Manage
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-sm text-slate-500">
            Tip: keep your profile up to date to receive the best experience.
          </div>
        </div>
      </div>

      {/* Cart Modal */}
      <CartModal open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
};

export default Profile;