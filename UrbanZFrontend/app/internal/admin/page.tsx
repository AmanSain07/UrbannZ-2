"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { ShieldAlert, Lock, Loader2, Eye, EyeOff } from "lucide-react";

export default function HiddenAdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // Mock password
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simple mock check to ensure "security" for the demo
    if (email === "admin@urbanz.com" && password === "admin123") {
      try {
        await login(email); // In real app, this would verify password too
        router.push("/dashboard/admin");
      } catch (err) {
        setError("Login failed. System error.");
      }
    } else {
      setError("Unauthorized access. IP logged.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-red-500/10 rounded-full text-red-500">
            <ShieldAlert size={32} />
          </div>
        </div>

        <h1 className="text-2xl font-mono text-center text-red-500 font-bold mb-2">RESTRICTED AREA</h1>
        <p className="text-zinc-500 text-center text-xs font-mono mb-8">
          AUTHORIZED PERSONNEL ONLY. ALL ATTEMPTS ARE FLAGGED.
        </p>

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-2">ADMIN ID</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded bg-black border border-zinc-700 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-colors font-mono text-sm"
                placeholder="admin@urbanz.com"
                required
              />
              <ShieldAlert className="absolute left-3 top-3.5 text-zinc-600 h-4 w-4" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-2">PASSKEY</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded bg-black border border-zinc-700 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-colors font-mono text-sm"
                placeholder="••••••••"
                required
              />
              <Lock className="absolute left-3 top-3.5 text-zinc-600 h-4 w-4" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-950/30 border border-red-500/20 text-red-500 text-xs font-mono rounded">
              Error: {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-mono font-bold rounded transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "AUTHENTICATE"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="text-zinc-600 hover:text-zinc-400 text-xs font-mono underline"
          >
            Return to Surface
          </button>
        </div>
      </div>
    </div>
  );
}
