"use client";

import { useState, Suspense } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Loader2, Eye, EyeOff } from "lucide-react";

function AuthContent() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, signup } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignup) {
        await signup(name, email, password);
        router.push("/dashboard/customer"); // New users go to customer dash
      } else {
        await login(email, password);

        if (email.includes("shop")) {
          router.push("/dashboard/shopkeeper");
        } else if (email.includes("admin")) {
          router.push("/dashboard/admin"); // Admin Dashboard
        } else {
          router.push("/dashboard/customer");
        }
      }
    } catch (error) {
      alert("Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  // Quick login helpers for demo
  const quickLogin = (roleEmail: string) => {
    setEmail(roleEmail);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4 bg-secondary/5 overflow-hidden">
      <div className="w-full max-w-md bg-card border border-border p-8 rounded-3xl shadow-xl relative">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black mb-2">{isSignup ? "Join the Crew" : "Welcome Back"}</h1>
          <p className="text-muted-foreground">{isSignup ? "Create an account to start your drip." : "Login to access your dashboard."}</p>
        </div>

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
            <label className="block text-sm font-bold mb-2">Email or Username</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-background border border-input focus:ring-2 focus:ring-primary outline-none transition-all"
              placeholder="name@example.com or username"
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
            {loading ? <Loader2 className="animate-spin" /> : (isSignup ? "Sign Up" : "Login")}
          </button>
        </form>

        {/* Mascot */}
        <div className="absolute -top-16 -right-12 hidden md:block">
          <Image src="/mascot.png" alt="Mascot" width={128} height={128} className="w-32 h-32 object-contain drop-shadow-xl hover:scale-110 transition-transform cursor-pointer" />
        </div>

        <div className="mt-6 text-center space-y-2">
          <button
            type="button"
            onClick={() => setIsSignup(!isSignup)}
            className="text-sm text-primary font-bold hover:underline"
          >
            {isSignup ? "Already have an account? Login" : "New here? Create account"}
          </button>

          {!isSignup && (
            <div className="border-t pt-4 mt-4 border-dashed border-gray-200">
              <p className="text-sm text-muted-foreground">Want to sell on UrbanZ?</p>
              <Link href="/become-seller" className="text-sm font-black text-black hover:underline block mt-1">
                Open a Store &rarr;
              </Link>
            </div>
          )}
        </div>

        {!isSignup && (
          <div className="mt-8 pt-8 border-t border-border">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 text-center">Demo Logins</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => quickLogin("shop1@urbanz.com")}
                className="text-xs py-2 px-2 bg-secondary/20 hover:bg-secondary/40 rounded-lg truncate whitespace-nowrap"
              >
                Shopkeeper
              </button>
              <button
                onClick={() => quickLogin("rahul@gmail.com")}
                className="text-xs py-2 px-2 bg-secondary/20 hover:bg-secondary/40 rounded-lg truncate whitespace-nowrap"
              >
                Customer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>}>
      <AuthContent />
    </Suspense>
  );
}
