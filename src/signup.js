import { assertSupabase } from "./supabase";

export async function signUp(email, password) {
    const client = assertSupabase();
    const { data, error } = await client.auth.signUp({
        email,
        password
    });

    if (error) throw error;
    return data;
}
