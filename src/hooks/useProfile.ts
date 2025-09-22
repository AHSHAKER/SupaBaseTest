import { useEffect, useState } from "react";
import supabase from "../SupabaseUsers";

type Profile = {
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  plan?: string | null;
};

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await supabase.auth.getUser();
        const user = data?.user;
        if (!user) {
          setError("Not authenticated");
          return;
        }

        const { data: accountData, error: accountError } = await supabase
          .from("accounts")
          .select("full_name, email, phone, address, city, country")
          .eq("user_id", user.id)
          .maybeSingle();

        if (accountError) throw accountError;
        if (!accountData) {
          setError("Account not found");
          return;
        }

        const { data: subData, error: subError } = await supabase
          .from("subscriptions")
          .select("plan_id, status, plans(name, code)")
          .eq("user_id", user.id)
          .eq("status", "active")
          .limit(1)
          .maybeSingle();

        if (subError) throw subError;

        const planName =
          subData?.plans?.[0]?.name ?? subData?.plan_id ?? "Free";

        if (mounted) {
          setProfile({
            full_name: accountData.full_name,
            email: accountData.email,
            phone: accountData.phone,
            address: accountData.address,
            city: accountData.city,
            country: accountData.country,
            plan: planName,
          });
        }
      } catch (err: any) {
        setError(err?.message ?? "Failed to load profile");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return { profile, loading, error };
}