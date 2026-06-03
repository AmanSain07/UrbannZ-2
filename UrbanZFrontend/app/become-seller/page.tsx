"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { submitVendorApplication, fetchMyVendorApplication } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Loader2, Store, ArrowRight, Mail, Lock, MapPin, Tag, Phone, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";

type AppStatus = "idle" | "pending" | "approved" | "rejected";

export default function BecomeSellerPage() {
  const { user, signup } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [appStatus, setAppStatus] = useState<AppStatus>("idle");
  const [step, setStep] = useState<"auth" | "apply">(user ? "apply" : "auth");

  const [authData, setAuthData] = useState({ name: "", email: "", password: "" });
  const [formData, setFormData] = useState({
    business_name: "",
    phone: "",
    description: "",
    address: "",
  });

  // Check existing application status
  useEffect(() => {
    if (user) {
      fetchMyVendorApplication()
        .then((app: any) => setAppStatus(app.status))
        .catch(() => setAppStatus("idle"));
    }
  }, [user]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(authData.name, authData.email, authData.password);
      setStep("apply");
    } catch (error: any) {
      alert(error.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitVendorApplication(formData);
      setAppStatus("pending");
    } catch (error: any) {
      alert(error.message || "Application submission failed.");
    } finally {
      setLoading(false);
    }
  };

  // Status display after submission
  if (appStatus === "pending") {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-secondary/5">
        <div className="max-w-md w-full text-center space-y-6 bg-card border border-border p-10 rounded-3xl shadow-xl">
          <div className="w-20 h-20 mx-auto rounded-full bg-yellow-100 flex items-center justify-center">
            <Clock className="w-10 h-10 text-yellow-600" />
          </div>
          <h1 className="text-2xl font-black">Application Submitted!</h1>
          <p className="text-muted-foreground">
            Your vendor application is under review. Our team will evaluate your application and notify you within 24–48 hours.
          </p>
          <div className="bg-secondary/10 rounded-2xl p-4 text-sm text-left space-y-2">
            <p className="font-bold text-sm">What happens next?</p>
            <p className="text-muted-foreground">1. Admin reviews your application</p>
            <p className="text-muted-foreground">2. You receive a notification with the decision</p>
            <p className="text-muted-foreground">3. If approved, you can create your store</p>
          </div>
          <Link href="/dashboard/customer" className="block w-full py-3 rounded-full bg-primary text-white font-bold text-center hover:opacity-90 transition-opacity">
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (appStatus === "approved") {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-secondary/5">
        <div className="max-w-md w-full text-center space-y-6 bg-card border border-border p-10 rounded-3xl shadow-xl">
          <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-black">You&apos;re a Vendor!</h1>
          <p className="text-muted-foreground">Your application has been approved. You can now create and manage your store.</p>
          <button
            onClick={() => router.push("/dashboard/shopkeeper")}
            className="block w-full py-3 rounded-full bg-black text-white font-bold hover:opacity-90 transition-opacity"
          >
            Go to Vendor Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left: Branding */}
      <div className="hidden lg:flex flex-col justify-between bg-black text-white p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80')] bg-cover opacity-20" />
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-20 text-white hover:opacity-80 transition-opacity">
            <div className="size-8 rounded-full bg-white text-black flex items-center justify-center font-bold">U</div>
            <span className="font-bold text-xl">UrbanZ</span>
          </Link>
          <h1 className="text-6xl font-black mb-6 leading-tight">Build Your <br /><span className="text-primary">Empire.</span></h1>
          <p className="text-xl text-gray-400 max-w-md">Join thousands of creators and sellers on the fastest growing hyperlocal marketplace.</p>
        </div>
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md">
              <Store className="size-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold">Approval-Based Onboarding</h3>
              <p className="text-sm text-gray-400">Secure, verified vendor network.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex items-center justify-center p-8 bg-gray-50 dark:bg-background">
        <div className="w-full max-w-md space-y-8">

          {/* Step Indicator */}
          <div className="flex gap-2 items-center">
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${step === "auth" ? "bg-primary text-white" : "bg-green-100 text-green-700"}`}>
              {step === "auth" ? "1. Create Account" : "1. Account Created"}
            </div>
            <div className="h-px flex-1 bg-border" />
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${step === "apply" ? "bg-primary text-white" : "bg-secondary/30 text-muted-foreground"}`}>
              2. Apply as Vendor
            </div>
          </div>

          {/* Step 1: Auth (only shown if not logged in) */}
          {step === "auth" && (
            <>
              <div>
                <h2 className="text-3xl font-black tracking-tight">Create Account</h2>
                <p className="text-muted-foreground mt-2">First, create your customer account.</p>
              </div>
              <form onSubmit={handleAuth} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Full Name</label>
                  <input required value={authData.name} onChange={(e) => setAuthData({ ...authData, name: e.target.value })}
                    className="w-full mt-1 p-3 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-primary outline-none" placeholder="Your Name" />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <input required type="email" value={authData.email} onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
                    className="w-full mt-1 p-3 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-primary outline-none" placeholder="you@example.com" />
                </div>
                <div>
                  <label className="text-sm font-medium">Password</label>
                  <input required type="password" value={authData.password} onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
                    className="w-full mt-1 p-3 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-primary outline-none" placeholder="••••••••" />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-4 rounded-full bg-black text-white font-bold text-lg hover:scale-[1.02] transition-transform shadow-xl shadow-black/20 flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="animate-spin" /> : <>Continue <ArrowRight size={20} /></>}
                </button>
              </form>
              <p className="text-center text-sm text-gray-500">
                Already have an account? <Link href="/login" className="text-primary font-bold hover:underline">Login here</Link>
              </p>
            </>
          )}

          {/* Step 2: Apply as Vendor */}
          {step === "apply" && (
            <>
              <div>
                <h2 className="text-3xl font-black tracking-tight">Vendor Application</h2>
                <p className="text-muted-foreground mt-2">Tell us about your business. Admin will review within 24h.</p>
              </div>
              <form onSubmit={handleApply} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Business Name</label>
                  <div className="relative mt-1">
                    <Store className="absolute left-3 top-3 size-4 text-gray-400" />
                    <input required value={formData.business_name} onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                      className="w-full pl-10 p-3 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-primary outline-none" placeholder="e.g. Urban Kicks" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Phone Number</label>
                  <div className="relative mt-1">
                    <Phone className="absolute left-3 top-3 size-4 text-gray-400" />
                    <input required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-10 p-3 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-primary outline-none" placeholder="+91 98765 43210" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">What do you sell?</label>
                  <div className="relative mt-1">
                    <Tag className="absolute left-3 top-3 size-4 text-gray-400" />
                    <textarea required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full pl-10 p-3 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-primary outline-none min-h-[80px]" placeholder="Describe your products and business..." />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">City / Location</label>
                  <div className="relative mt-1">
                    <MapPin className="absolute left-3 top-3 size-4 text-gray-400" />
                    <input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full pl-10 p-3 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-primary outline-none" placeholder="e.g. Mumbai, India" />
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-4 rounded-full bg-black text-white font-bold text-lg hover:scale-[1.02] transition-transform shadow-xl shadow-black/20 flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="animate-spin" /> : <>Submit Application <ArrowRight size={20} /></>}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
