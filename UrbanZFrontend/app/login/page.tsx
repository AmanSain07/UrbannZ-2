"use client";

import { useState, Suspense } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Loader2, Eye, EyeOff, AlertCircle } from "lucide-react";

function AuthContent() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login, signup } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isSignup) {
        await signup(name, email, password);
        // All new registrations are customers
        router.push("/dashboard/customer");
      } else {
        await login(email, password);
        // auth-context.login() stores user in state but we can't read it
        // synchronously here. The /dashboard page already handles role-based
        // redirect via useEffect, so we just go to /dashboard.
        router.push(redirect === "/dashboard" ? "/dashboard" : redirect);
      }
    } catch (err: any) {
      setError(err?.message || "Authentication failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4 bg-secondary/5 overflow-hidden">
      <div className="w-full max-w-md bg-card border border-border p-8 rounded-3xl shadow-xl relative">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black mb-2">{isSignup ? "Join the Crew" : "Welcome Back"}</h1>
          <p className="text-muted-foreground">
            {isSignup ? "Create an account to start your drip." : "Login to access your dashboard."}
          </p>
        </div>

        {error && (
          <div className="mb-4 flex items-start gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 text-sm font-medium">
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          {isSignup && (
            <div>
              <label className="block text-sm font-bold mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-background border border-input focus:ring-2 focus:ring-primary outline-none transition-all"
                placeholder="Your Name"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-background border border-input focus:ring-2 focus:ring-primary outline-none transition-all"
              placeholder="name@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-background border border-input focus:ring-2 focus:ring-primary outline-none transition-all pr-12"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-muted-foreground hover:text-primary transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-primary text-white font-bold hover:scale-[1.02] transition-transform flex items-center justify-center"
          >
            {loading ? <Loader2 className="animate-spin" /> : isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

        {/* Mascot */}
        <div className="absolute -top-16 -right-12 hidden md:block">
          <Image
            src="/mascot.png"
            alt="Mascot"
            width={128}
            height={128}
            className="w-32 h-32 object-contain drop-shadow-xl hover:scale-110 transition-transform cursor-pointer"
          />
        </div>

        <div className="mt-6 text-center space-y-2">
          <button
            type="button"
            onClick={() => { setIsSignup(!isSignup); setError(null); }}
            className="text-sm text-primary font-bold hover:underline"
          >
            {isSignup ? "Already have an account? Login" : "New here? Create account"}
          </button>

          {!isSignup && (
            <div className="border-t pt-4 mt-4 border-dashed border-gray-200">
              <p className="text-sm text-muted-foreground">Want to sell on UrbanZ?</p>
              <Link href="/become-seller" className="text-sm font-black text-black dark:text-white hover:underline block mt-1">
                Open a Store &rarr;
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="animate-spin" />
        </div>
      }
    >
      <AuthContent />
    </Suspense>
  );
}
