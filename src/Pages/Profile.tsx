import { signOut } from "../hooks/useAuth";
import { useProfile } from "../hooks/useProfile";
import { useNavigate } from "react-router-dom";


type Profile = {
  full_name?: string | null
  email?: string | null
  phone?: string | null
  address?: string | null
  city?: string | null
  country?: string | null
  plan?: string | null
}

const getInitials = (name?: string | null, email?: string | null) => {
    
  if (name) {
    return name
      .split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase()
  }
  if (email) return email.charAt(0).toUpperCase()
  return "U"
}

const Profile = () => {
  const { profile, loading, error } = useProfile();
  const Nav = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-500 to-indigo-600">
        <div className="text-white/90">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-500 to-indigo-600">
        <div className="rounded-lg bg-white/10 p-6">
          <div className="text-red-200">Error: {error}</div>
        </div>
      </div>
    )
  }

  const displayName = profile?.full_name || profile?.email || "User"
  const plan = profile?.plan || "Free"
  const initials = getInitials(profile?.full_name, profile?.email)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-500 to-indigo-600 p-6">
      <div className="w-full max-w-3xl bg-white/95 dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left: profile summary */}
          <div className="md:w-1/3 bg-gradient-to-b from-white/60 to-white/40 dark:from-slate-900/70 dark:to-slate-900/50 p-8 flex flex-col items-center gap-4">
            <div
              aria-hidden
              className="w-28 h-28 rounded-full bg-indigo-600 text-white flex items-center justify-center text-3xl font-semibold shadow-md"
            >
              {initials}
            </div>
            <div className="text-center">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                {displayName}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {profile?.email}
              </p>
            </div>

            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-indigo-50 text-indigo-700 px-3 py-1 text-sm font-medium">
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 22v-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {plan}
            </div>

            <button
              onClick={() => signOut()}
              className="mt-6 w-full md:w-auto px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
            >
              Sign Out
            </button>
          </div>

          {/* Right: details */}
          <div className="md:w-2/3 p-8">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
              Account Details
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
              Review and manage your personal info.
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <div className="text-xs text-slate-400">Full name</div>
                <div className="mt-1 text-sm text-slate-800">{profile?.full_name ?? "—"}</div>
              </div>

              <div className="p-4 bg-white rounded-lg shadow-sm">
                <div className="text-xs text-slate-400">Email</div>
                <div className="mt-1 text-sm text-slate-800">{profile?.email ?? "—"}</div>
              </div>

              <div className="p-4 bg-white rounded-lg shadow-sm">
                <div className="text-xs text-slate-400">Phone</div>
                <div className="mt-1 text-sm text-slate-800">{profile?.phone ?? "—"}</div>
              </div>

              <div className="p-4 bg-white rounded-lg shadow-sm">
                <div className="text-xs text-slate-400">City</div>
                <div className="mt-1 text-sm text-slate-800">{profile?.city ?? "—"}</div>
              </div>

              <div className="col-span-1 sm:col-span-2 p-4 bg-white rounded-lg shadow-sm">
                <div className="text-xs text-slate-400">Address</div>
                <div className="mt-1 text-sm text-slate-800">{profile?.address ?? "—"}</div>
              </div>

              <div className="col-span-1 sm:col-span-2 p-4 rounded-lg bg-white/50 text-sm text-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-400">Subscription</div>
                    <div className="mt-1 font-medium">{plan}</div>
                  </div>
                  <div>
                    <button 
                    onClick={() => Nav("/plans")}
                    className="px-3 py-1 rounded-md bg-indigo-50 text-indigo-700 text-sm font-medium hover:bg-indigo-100">
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
      </div>
    </div>
  )
}

export default Profile;