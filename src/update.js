import { assertSupabase } from "./supabase";

export async function updateMyCredit(newCredit) {
    const client = assertSupabase();
    const { data: userData, error: userError } = await client.auth.getUser();
    if (userError) throw userError;

    const user = userData.user;
    if (!user) throw new Error("Not logged in");

    const { data, error } = await client
        .from("profiles")
        .update({ credit: newCredit })
        .eq("id", user.id)
        .select()
        .single();

    if (error) throw error;
    return data;
}
