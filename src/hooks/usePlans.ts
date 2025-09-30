import { useCallback, useEffect, useState } from 'react'
import supabase from '../SupabaseUsers'
import type { Tables } from '../../database.types'
import { addTransaction } from './useTransactions'
import type { transaction } from './useTransactions'
import useAuthStore from '../Store/authStore'

export type Plan = Tables<'plans'>

export const getActivePlan = async () => {
    const userId = useAuthStore.getState().user_id;
    if (!userId) {await supabase.auth.getUser().then(({ data }) => data.user?.id);} 
    if(!userId) throw new Error("User not authenticated");
    const { data: planData, error: planError } = await supabase
        .from("subscriptions")
        .select(`*, plans(*)`)
        .eq("user_id", userId)
        .eq("status", "active")
        .maybeSingle();
    if (planError) throw planError;
    return { planData, planError };
};

export function usePlans() {
    const [plans, setPlans] = useState<Plan[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    const fetchPlans = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            const { data, error: rpcError } = await supabase.rpc('get_plans', { p_payload: {} })

            if (rpcError) {
                setPlans([])
                setError(rpcError.message)
            } else if (data?.status === 'success') {
                setPlans(data.data ?? [])
            } else {
                setPlans([])
                setError(data?.message ?? 'Unknown error from get_plans')
            }
        } catch (err: any) {
            setPlans([])
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [])



    useEffect(() => {
        fetchPlans()
    }, [fetchPlans])

    return {
        plans,
        loading,
        error,
        refresh: fetchPlans,
    }
}

export const subscribeToPlan = async (plan: { planId: string; plan_code: string; plan_duration: string; plan_price: number; plan_name: string }, auto_renew: boolean) => {
    const user_id = useAuthStore.getState().user_id;
    if (!user_id) throw new Error("User not authenticated");
    const today = new Date();
    const created_at = today.toISOString();
    const current_date = created_at.split('T')[0];
    const cancel_at = new Date(today);

    if (plan.plan_duration === "monthly") {
        cancel_at.setMonth(cancel_at.getMonth() + 1);
    } else {
        cancel_at.setFullYear(cancel_at.getFullYear() + 1);
    }
    
    try {
        const { data, error } = await supabase
            .from('subscriptions')
            .insert({ plan_id: plan.planId, status: 'active', user_id: user_id, start_date: current_date, created_at: created_at, current_period_end: cancel_at, auto_renew: auto_renew })
            .select('subscription_id')
            .single();

        if (error) throw error;

        const transaction: transaction = {
            user_id: user_id,
            status: 'succeeded',
            subscription_id: data?.subscription_id,
            currency: 'USD',
            amount: plan.plan_price,
            event_type: 'payment',
            description: `Subscribed to plan ${plan.plan_name} for ${plan.plan_duration}`,
        };

        const newPlan = {
            name: plan.plan_name,
            code: plan.plan_code,
            id: plan.planId,
            status: 'active' as 'active',
        };

        useAuthStore.getState().plan = newPlan;

        await addTransaction(transaction);

        return { data, errorS: null };
    } catch (err: any) {
        return { data: null, errorS: err.message || 'Subscription failed' };
    }
}

export const cancelSubscription = async (planName: string) => {
    const user_id = useAuthStore.getState().user_id;
    if (!user_id) throw new Error("User not authenticated");

    try {
        const { data, error } = await supabase
            .from('subscriptions')
            .update({ status: 'canceled' })
            .eq('user_id', user_id)
            .eq('status', 'active')
            .select('subscription_id')
            .single();

        if (error) throw error;
        console.log("Subscription canceled in DB:", data);
        const transaction: transaction = {
            user_id: user_id,
            status: 'succeeded',
            subscription_id: data?.subscription_id,
            currency: 'USD',
            amount: 0,
            event_type: 'plan_cancellation',
            description: `Canceled subscription ${planName}`,
        };

        useAuthStore.getState().plan = null;

        await addTransaction(transaction);

        return { data, errorC: null };
    } catch (err: any) {
        return { data: null, errorC: err.message || 'Cancellation failed' };
    }
}
