import { assertSupabase } from "./supabase";

export async function getMyProfile() {
    const client = assertSupabase();
    const { data: userData, error: userError } = await client.auth.getUser();
    if (userError) throw userError;

    const user = userData.user;
    if (!user) return null;

    const { data, error } = await client
        .from("profiles")
        .select("id, email, credit, created_at")
        .eq("id", user.id)
        .single();

    if (error) throw error;
    return data;
}
