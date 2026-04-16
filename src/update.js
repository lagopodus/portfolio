import { supabase } from './supabase'

export async function updateMyCredit(newCredit) {
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError

    const user = userData.user
    if (!user) throw new Error('Not logged in')

    const { data, error } = await supabase
        .from('profiles')
        .update({ credit: newCredit })
        .eq('id', user.id)
        .select()
        .single()

    if (error) throw error
    return data
}