import { supabase } from './supabase'

export async function getMyProfile() {
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError

    const user = userData.user
    if (!user) return null

    const { data, error } = await supabase
        .from('profiles')
        .select('id, email, credit, created_at')
        .eq('id', user.id)
        .single()

    if (error) throw error
    return data
}