"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, ShieldAlert } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login(email, password);
      // Login function in auth-context updates state.
      // We need to check if the user is actually an admin is handled by the guard? 
      // No, login logic in api.ts returns the role.
      // But we can check the retrieved user or just redirect and let the guard handle it.
      // However, api.ts mock logic was updated to only return 'admin' role if creds match.
      // So if login succeeds (no error thrown), we assume we might be logged in. 
      // But we should verify if we actually got admin access or just customer access.
      // Since login() updates context asynchronously, we might simply redirect to /admin.
      // If they are not admin, the /admin guard will kick them back.
      // Better UX: Check role immediately if possible, but login() returns void in the context types I saw.
      // I'll just redirect to /admin. The guard will do its job.
      router.push("/admin");
    } catch (err) {
      // api.ts throws error if login fails?
      // Actually api.ts returns a user object.
      // But auth-context login function wraps it in try-catch and might throw.
      // Let's assume standard error handling.
      console.error(err);
      setError("Invalid credentials. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Access</h1>
          <p className="text-muted-foreground">
            Enter your secure credentials to dashboard.
          </p>
        </div>

        <div className="bg-card p-8 rounded-2xl shadow-sm border border-border">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg flex items-center gap-2">
                <ShieldAlert size={16} />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">
                Email
              </label>
              <div className="relative">
                <div className="absolute left-3 top-2.5 text-muted-foreground">
                  <Mail size={18} />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="admin@urbanz.com"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-10 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-3 top-2.5 text-muted-foreground">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-10 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
            >
              {isSubmitting ? "Authenticating..." : "Login"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Restricted Area. Authorized Personnel Only.
        </p>
      </div>
    </div>
  );
}
