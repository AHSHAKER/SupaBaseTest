import { useCallback, useEffect, useState } from 'react'
import supabase from '../SupabaseUsers'

import type { Tables } from '../../database.types'

export type Plan = Tables<'plans'>

export default function usePlans() {
    const [plans, setPlans] = useState<Plan[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    const fetchPlans = useCallback(async () => {
        setLoading(true)
        setError(null)

        const { data, error: fetchError } = await supabase
            .from('plans')
            .select('*')
            .order('created_at', { ascending: false })

        if (fetchError) {
            setPlans([])
            setError(fetchError.message)
        } else {
            setPlans(data ?? [])
        }
        setLoading(false)
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