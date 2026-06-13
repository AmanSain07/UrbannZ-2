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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
        if (password !== confirmPassword) {
          setError("Passwords do not match.");
          setLoading(false);
          return;
        }
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
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-bold">Password</label>
              {!isSignup && (
                <Link href="#" className="text-xs text-primary font-bold hover:underline">
                  Forgot Password?
                </Link>
              )}
            </div>
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

          {isSignup && (
            <div>
              <label className="block text-sm font-bold mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-input focus:ring-2 focus:ring-primary outline-none transition-all pr-12"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-3.5 text-muted-foreground hover:text-primary transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-primary text-white font-bold hover:scale-[1.02] transition-transform flex items-center justify-center"
          >
            {loading ? <Loader2 className="animate-spin" /> : isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-4">
          <div className="flex-1 border-t border-border/50"></div>
          <span className="text-xs text-muted-foreground font-medium uppercase">Or</span>
          <div className="flex-1 border-t border-border/50"></div>
        </div>

        <button className="w-full mt-6 py-3 rounded-full bg-background border border-input text-foreground font-bold hover:bg-secondary/20 transition-colors flex items-center justify-center gap-2">
          <svg viewBox="0 0 24 24" className="w-5 h-5">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </button>

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
