import supabase from "../SupabaseUsers";
import type { TablesInsert } from "../../database.types";
import useAuthStore from "../Store/authStore";

export type transaction = Omit<TablesInsert<"transactions_history">, "id" | "created_at" | "updated_at">;

export const getTransactions = async () => {

    const user_id = useAuthStore.getState().user_id;

    const { data, error } = await supabase
        .from('transactions_history')
        .select('*')
        .eq('user_id', user_id)
        .order('created_at', { ascending: false });
    return { data: data as transaction[] | null, error };
}

export const addTransaction = async (transaction: transaction) => {

    try {
        const { data, error } = await supabase
            .from('transactions_history')
            .insert({ ...transaction });
        return { data: data as transaction[] | null, error };
    } catch (err) {
        console.error("Error adding transaction:", err);
        return { data: null, error: err };
    }
    
}