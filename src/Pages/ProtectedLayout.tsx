import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import supabase from "../SupabaseUsers";

const ProtectedLayout: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    let mounted = true;

    // initial check
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!mounted) return;
        setSession(data.session ?? null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    // listen for auth changes (optional but useful)
    const { data: { subscription } = { subscription: undefined } } =
      supabase.auth.onAuthStateChange((_event, newSession) => {
        if (!mounted) return;
        setSession(newSession ?? null);
      });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  if (loading) {
    // show nothing or a spinner while checking auth
    <div className="min-h-screen flex items-center justify-center">Loading...</div>
    return null;
  }

  if (!session) {
    console.log("No session data found, redirecting to sign-in.");
    return <Navigate to="/sign-in" replace />;
  }

  console.log("Session data found, rendering protected layout.");
  return <Outlet />;
};

export default ProtectedLayout;