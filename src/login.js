import { assertSupabase } from "./supabase";

export async function signIn(email, password) {
    const client = assertSupabase();
    const { data, error } = await client.auth.signInWithPassword({
        email,
        password
    });

    if (error) throw error;
    return data;
}
