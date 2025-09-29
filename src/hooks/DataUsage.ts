import useAuthStore from "../Store/authStore";
import supabase from "../SupabaseUsers";
import { getActivePlan } from "./usePlans";

export type UsageSummary = {
    bytesUp: number;
    bytesDown: number;
    totalBytesUsed: number;
    gbUsed: number;
    gbTotal: number | null;
    subscriptionId: string | null;
    planName?: string;
};


export const fetchUsage = async () => {
    const userId = useAuthStore.getState().user_id;
    // Get current subscription
    const { planData } = await getActivePlan();

    // Get usage for the current subscription
    const { data: usageData, error: usageError } = await supabase
        .from("user_usage")
        .select("*")
        .eq("user_id", userId)
        .eq("subscription_id", planData?.subscription_id);

    if (usageError) throw usageError;

    // Aggregate usage
    const totalBytesUp = usageData?.reduce((acc, u) => acc + u.bytes_up, 0) || 0;
    const totalBytesDown = usageData?.reduce((acc, u) => acc + u.bytes_down, 0) || 0;
    const totalBytes = totalBytesUp + totalBytesDown;

    return {
        bytesUp: totalBytesUp,
        bytesDown: totalBytesDown,
        totalBytesUsed: totalBytes,
        gbUsed: totalBytes / (1024 ** 3),
        gbTotal: planData?.plans.data_cap_gb || null,
        subscriptionId: planData?.subscription_id || null,
        planName: planData?.plans.name,
    } as UsageSummary;
};
