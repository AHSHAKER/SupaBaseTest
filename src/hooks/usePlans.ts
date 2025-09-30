import { useCallback, useEffect, useState } from 'react'
import supabase from '../SupabaseUsers'
import type { Tables } from '../../database.types'
import { addTransaction } from './useTransactions'
import type { transaction } from './useTransactions'
import useAuthStore from '../Store/authStore'

export type Plan = Tables<'plans'>

export const getActivePlan = async () => {
    let userId = useAuthStore.getState().user_id;
    if (!userId) {
        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;
        userId = data.user?.id;
    }

  if (!userId) throw new Error("User not authenticated");
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
    const [error, setError] = useState<string | null>(null)

    const fetchPlans = useCallback(async () => {
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
        }
    }, [])



    useEffect(() => {
        fetchPlans()
    }, [fetchPlans])

    return {
        plans,
        error,
        refresh: fetchPlans,
    }
}

export const createSubscription = async (planId: string, auto_renew: boolean) => {
    const user_id = useAuthStore.getState().user_id;
    if (!user_id) throw new Error("User not authenticated");
    try {
        const { data, error } = await supabase
            .from('subscriptions')
            .insert({ plan_id: planId, status: 'pending', user_id: user_id, auto_renew: auto_renew })
            .select('subscription_id')
            .single();

        if (error) throw error;

        return { data, errorS: null };
    } catch (err: any) {
        return { data: null, errorS: err.message || 'Subscription failed' };
    }
}

export const activateSubscription = async (subscriptionId: string, plan: Plan) => {
    const user_id = useAuthStore.getState().user_id;
    if (!user_id) throw new Error("User not authenticated");

    try {
        const { data, error } = await supabase
            .from('subscriptions')
            .update({ status: 'active' })
            .eq('subscription_id', subscriptionId)
            .select('subscription_id, plan_id')
            .single();

        if (error) throw error;

        
        const transaction: transaction = {
            user_id: user_id,
            status: 'succeeded',
            subscription_id: data?.subscription_id,
            currency: 'USD',
            amount: plan.price_amount,
            event_type: 'payment',
            description: `Subscribed to plan ${plan.name} for ${plan.billing_period}`,
        };

        const newPlan = {
            name: plan.name,
            code: plan.code,
            id: plan.plan_id,
            status: 'active' as 'active',
        };

        useAuthStore.getState().plan = newPlan;

        await addTransaction(transaction);

        return { data, errorS: null };
    } catch (err: any) {
        return { data: null, errorS: err.message || 'Failed to activate subscription' };
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

export const deleteSubscription = async (subscriptionId: string) => {
    const user_id = useAuthStore.getState().user_id;
    if (!user_id) throw new Error("User not authenticated");
    try {
        const { data, error } = await supabase
            .from('subscriptions')
            .delete()
            .eq('subscription_id', subscriptionId)
            .eq('user_id', user_id)
            .select('subscription_id')
            .single();
        if (error) throw error;
        return { data, errorC: null };
    } catch (err: any) {
        return { data: null, errorC: err.message || 'Deletion failed' };
    }
}