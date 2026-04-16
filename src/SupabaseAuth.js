import React, { useEffect, useState } from "react";
import { hasSupabaseConfig, supabase } from "./supabase";
import { signIn } from "./login";
import { signUp } from "./signup";
import { getMyProfile } from "./load";
import { updateMyCredit } from "./update";

const DEFAULT_CREDIT_BOOST = 25;

export default function SupabaseAuth() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mode, setMode] = useState("login");
    const [loading, setLoading] = useState(false);
    const [session, setSession] = useState(null);
    const [profile, setProfile] = useState(null);
    const [status, setStatus] = useState("");

    const isLoggedIn = Boolean(session?.user);

    if (!hasSupabaseConfig) {
        return (
            <section className="auth-card">
                <div className="auth-card__header">
                    <h2>Supabase Account</h2>
                    <p>Missing setup</p>
                </div>
                <p className="auth-card__status auth-card__status--warn">
                    Add REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_PUBLISHABLE_KEY to your .env file, then restart the dev server.
                </p>
            </section>
        );
    }

    async function loadProfile() {
        try {
            const profileData = await getMyProfile();
            setProfile(profileData);
        } catch (error) {
            setProfile(null);
            setStatus(error.message || "Could not load profile.");
        }
    }

    useEffect(() => {
        let cancelled = false;

        async function boot() {
            const { data, error } = await supabase.auth.getSession();
            if (error) {
                setStatus(error.message || "Could not get current session.");
                return;
            }

            if (!cancelled) {
                setSession(data.session ?? null);
            }
        }

        boot();

        const {
            data: { subscription }
        } = supabase.auth.onAuthStateChange((_event, nextSession) => {
            setSession(nextSession ?? null);
        });

        return () => {
            cancelled = true;
            subscription.unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (!isLoggedIn) {
            setProfile(null);
            return;
        }

        loadProfile();
    }, [isLoggedIn]);

    async function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);
        setStatus("");

        try {
            if (mode === "login") {
                await signIn(email, password);
                setStatus("Logged in successfully.");
            } else {
                await signUp(email, password);
                setStatus("Account created. Check your email if confirmation is enabled.");
            }

            setPassword("");
        } catch (error) {
            setStatus(error.message || "Auth request failed.");
        } finally {
            setLoading(false);
        }
    }

    async function handleAddCredit() {
        if (!profile) return;

        setLoading(true);
        setStatus("");

        try {
            const currentCredit = Number(profile.credit || 0);
            const updated = await updateMyCredit(currentCredit + DEFAULT_CREDIT_BOOST);
            setProfile(updated);
            setStatus(`Added ${DEFAULT_CREDIT_BOOST} credit.`);
        } catch (error) {
            setStatus(error.message || "Failed to update credit.");
        } finally {
            setLoading(false);
        }
    }

    async function handleLogout() {
        setLoading(true);
        setStatus("");

        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            setProfile(null);
            setStatus("Logged out.");
        } catch (error) {
            setStatus(error.message || "Failed to log out.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="auth-card">
            <div className="auth-card__header">
                <h2>Supabase Account</h2>
                <p>Login + credit displayer</p>
            </div>

            {!isLoggedIn ? (
                <>
                    <div className="auth-card__tabs">
                        <button
                            type="button"
                            className={mode === "login" ? "active" : ""}
                            onClick={() => setMode("login")}
                        >
                            Login
                        </button>
                        <button
                            type="button"
                            className={mode === "signup" ? "active" : ""}
                            onClick={() => setMode("signup")}
                        >
                            Sign up
                        </button>
                    </div>

                    <form className="auth-card__form" onSubmit={handleSubmit}>
                        <label>
                            Email
                            <input
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                required
                                autoComplete="email"
                            />
                        </label>

                        <label>
                            Password
                            <input
                                type="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                required
                                autoComplete={mode === "login" ? "current-password" : "new-password"}
                                minLength={6}
                            />
                        </label>

                        <button type="submit" disabled={loading}>
                            {loading
                                ? "Please wait..."
                                : mode === "login"
                                    ? "Login"
                                    : "Create account"}
                        </button>
                    </form>
                </>
            ) : (
                <div className="auth-card__profile">
                    <p>
                        Logged in as <strong>{profile?.email || session.user.email}</strong>
                    </p>
                    <p className="auth-card__credit">
                        Credit: <strong>{profile?.credit ?? "..."}</strong>
                    </p>

                    <div className="auth-card__actions">
                        <button type="button" onClick={handleAddCredit} disabled={loading || !profile}>
                            +{DEFAULT_CREDIT_BOOST} credit
                        </button>
                        <button type="button" onClick={loadProfile} disabled={loading}>
                            Refresh
                        </button>
                        <button type="button" onClick={handleLogout} disabled={loading}>
                            Logout
                        </button>
                    </div>
                </div>
            )}

            {status ? <p className="auth-card__status">{status}</p> : null}
        </section>
    );
}
