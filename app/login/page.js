"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseClient";

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (isSignup) {
      // Check if email is on the invite allowlist
      const checkRes = await fetch("/api/invitations/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const checkData = await checkRes.json();

      if (!checkData.allowed) {
        setError("Sign up is by invitation only. Please contact the admin.");
        return;
      }

      const { data, error: signUpError } = await supabaseBrowser.auth.signUp({
        email,
        password,
        options: {
          data: { name: name || "", role: "admin" },
          emailRedirectTo: `${window.location.origin}/admin`
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      if (!data.session) {
        setMessage("Check your email to confirm your account, then sign in.");
        return;
      }

      router.push("/admin");
      return;
    }

    const { error: signInError } = await supabaseBrowser.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message || "Invalid email or password.");
      return;
    }

    router.push("/admin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-dark text-slate-100">
      <div className="max-w-md w-full bg-surface p-10 rounded-2xl border border-white/5 shadow-2xl">
        <h2 className="text-3xl font-black mb-6 text-center text-white">
          {isSignup ? "Create Admin Account" : "Admin Login"}
        </h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {message && <p className="text-emerald-400 mb-4 text-center">{message}</p>}
        <form onSubmit={handleLogin} className="space-y-6">
          {isSignup && (
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-300 ml-1">Name</label>
              <input
                type="text"
                className="w-full bg-slate-900 border-white/10 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary text-white p-4"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-300 ml-1">Email</label>
            <input 
              type="email" 
              className="w-full bg-slate-900 border-white/10 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary text-white p-4" 
              placeholder="admin@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-300 ml-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full bg-slate-900 border-white/10 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary text-white p-4 pr-12"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-white"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <span className="material-symbols-outlined text-xl">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>
          <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-background-dark font-black py-4 px-8 rounded-xl text-lg transition-all shadow-lg shadow-primary/20">
            {isSignup ? "Create Account" : "Sign In"}
          </button>
          <button
            type="button"
            onClick={() => setIsSignup((prev) => !prev)}
            className="w-full text-sm text-slate-300 hover:text-white transition-colors"
          >
            {isSignup ? "Already have an account? Sign in" : "Need an account? Create one"}
          </button>
        </form>
      </div>
    </div>
  );
}
