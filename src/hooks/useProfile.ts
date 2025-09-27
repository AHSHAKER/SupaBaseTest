import supabase from "../SupabaseUsers";
import type { Tables } from "../../database.types";
import useAuthStore from "../Store/authStore";

export type AccountForm = Omit<
  Tables<"accounts">,
  "user_id" | "created_at" | "updated_at" | "email" | "metadata"
>;

export async function setProfile(): Promise<void> {
  const setProfile = useAuthStore.getState().setProfile;

  try {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) {
      setProfile(null as any);
      return;
    }
    const userId = user.id;

    const { data: accountData, error: accountError } = await supabase
      .from("accounts")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (accountError || !accountData) {
      setProfile(null as any);
      return;
    }

    // console.log("Account Data:", accountData);

    const { data: planData, error: planError } = await supabase
      .from("subscriptions")
      .select("plan_id, status, plans(name, code)")
      .eq("user_id", userId)
      .eq("status", "active") 
      .maybeSingle();

    if (planError || !planData) {
      setProfile({
        ...accountData,
        plan: {
          name: "Free",
          code: "",
          id: "",
          status: "inactive",
        },
      });
      return;
    }

    setProfile({
      ...accountData,
      plan: {
        id: planData.plan_id,
        status: planData.status,
        name: planData.plans?.name,
        code: planData.plans?.code,
      },
    });
  } catch (err) {
    console.error("Failed to load profile:", err);
    setProfile(null as any);
  }

  console.log("store:", useAuthStore.getState());
}

export async function updateAccount(formData: AccountForm) {
  const userId = useAuthStore.getState().user_id;
  const { error } = await supabase
    .from("accounts")
    .update(formData)
    .eq("user_id", userId);
  return { error };
}