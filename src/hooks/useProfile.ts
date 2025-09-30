import supabase from "../SupabaseUsers";
import type { TablesUpdate } from "../../database.types";
import useAuthStore from "../Store/authStore";
import { getActivePlan } from "./usePlans";

export type AccountForm = Omit<
  TablesUpdate<"accounts">,
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

    const { planData, planError } = await getActivePlan();

    const profile = {
      ...accountData,
      plan: planData && !planError
        ? {
            id: planData.plan_id,
            status: planData.status,
            name: planData.plans?.name ?? "Free",
            code: planData.plans?.code ?? "Free",
          }
        : {
            name: "Free",
            code: "Free",
            id: "",
            status: "inactive",
          },
    };

    setProfile(profile);
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

export const getPendingSubscriptions = async () => {
  const user_id = useAuthStore.getState().user_id;
  if (!user_id) throw new Error("User not authenticated");

  try {
    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user_id)
      .eq("status", "pending")
      .maybeSingle();

      if(!data) { return { data: null, planData: null, errorS: null }; }
    if (error) throw error;

    const { data: planData } = await supabase
      .from('plans')
      .select('*')
      .eq('plan_id', data?.plan_id)
      .single();

    return { data, planData, errorS: null };
  } catch (err: any) {
    return { data: null, planData: null, errorS: err.message || 'Failed to fetch pending subscriptions' };
  }
};
