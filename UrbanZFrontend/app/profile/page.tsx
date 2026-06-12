"use client";

import { useAuth } from "@/lib/auth-context";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, CheckCircle, Loader2, Lock, Mail, Phone, Save, User as UserIcon, Shield, Store, ShoppingBag, ArrowRight } from "lucide-react";
import { updateProfile, changePassword, uploadAvatarAPI } from "@/lib/api";
import Link from "next/link";

export default function ProfilePage() {
  const { user, isLoading, refreshUser } = useAuth();
  const router = useRouter();

  // Form states
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileForm, setProfileForm] = useState({ name: "", phone: "" });

  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordForm, setPasswordForm] = useState({
    old_password: "",
    new_password: "",
    confirm_new_password: "",
  });

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.push("/login");
    } else {
      setProfileForm({ name: user.name || "", phone: user.phone || "" });
    }
  }, [user, isLoading, router]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileError(null);
    setProfileSaved(false);
    try {
      await updateProfile({ name: profileForm.name, phone: profileForm.phone });
      await refreshUser();
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } catch (err: any) {
      setProfileError(err?.message || "Failed to save profile.");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfileLoading(true);
    setProfileError(null);
    setProfileSaved(false);
    try {
      await uploadAvatarAPI(file);
      await refreshUser();
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } catch (err: any) {
      setProfileError(err?.message || "Failed to upload photo.");
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.new_password !== passwordForm.confirm_new_password) {
      setPasswordError("New passwords do not match.");
      return;
    }
    setPasswordLoading(true);
    setPasswordError(null);
    setPasswordSaved(false);
    try {
      await changePassword(passwordForm);
      setPasswordSaved(true);
      setPasswordForm({ old_password: "", new_password: "", confirm_new_password: "" });
      setTimeout(() => setPasswordSaved(false), 3000);
    } catch (err: any) {
      setPasswordError(err?.message || "Failed to change password.");
    } finally {
      setPasswordLoading(false);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const userInitials = user.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const avatarSrc = user.avatar
    ? user.avatar.startsWith("http")
      ? user.avatar
      : `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"}${user.avatar}`
    : null;

  // Role-based styling & content
  const roleBadgeColors = {
    customer: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    shopkeeper: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    admin: "bg-red-500/10 text-red-600 border-red-500/20"
  };

  const getDashboardLink = () => {
    if (user.role === "admin") return "/dashboard/admin";
    if (user.role === "shopkeeper") return "/dashboard/shopkeeper";
    return "/dashboard/customer";
  };

  return (
    <div className="min-h-screen bg-secondary/5 pb-20">
      {/* Dynamic Cover Banner */}
      <div className="h-64 w-full bg-gradient-to-br from-primary/80 via-accent/60 to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
      </div>

      <div className="container px-4 max-w-6xl mx-auto -mt-24 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Identity & Quick Actions */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-card border border-border/50 rounded-3xl p-8 shadow-xl shadow-black/5 backdrop-blur-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
              
              <div className="flex flex-col items-center text-center">
                <div className="relative group size-32 mb-6">
                  <div className="size-32 rounded-full overflow-hidden bg-gradient-to-tr from-primary to-accent text-white flex items-center justify-center font-bold text-5xl shadow-2xl shadow-primary/20 ring-4 ring-background">
                    {avatarSrc ? (
                      <img src={avatarSrc} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      userInitials
                    )}
                  </div>
                  
                  {/* Photo Upload Overlay */}
                  <label className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all cursor-pointer text-xs font-bold scale-95 group-hover:scale-100">
                    <Camera size={24} className="mb-2 text-white/90" />
                    Upload Photo
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                  </label>
                </div>

                <h1 className="text-3xl font-black tracking-tight mb-1">{user.name}</h1>
                <p className="text-muted-foreground font-medium mb-4">{user.email}</p>
                
                <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase border ${roleBadgeColors[user.role]}`}>
                  {user.role === 'admin' && <Shield size={14} />}
                  {user.role === 'shopkeeper' && <Store size={14} />}
                  {user.role === 'customer' && <ShoppingBag size={14} />}
                  {user.role} Account
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-border/50 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground font-medium">Joined Date</span>
                  <span className="font-bold">{user.created_at ? new Date(user.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long" }) : "Recently"}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground font-medium">Account Status</span>
                  <span className="text-green-600 font-bold flex items-center gap-1"><CheckCircle size={14} /> Active</span>
                </div>
              </div>

              <div className="mt-8">
                <Link href={getDashboardLink()}>
                  <button className="w-full flex items-center justify-center gap-2 bg-foreground text-background hover:bg-foreground/90 transition-all rounded-xl py-3 font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0">
                    Go to Dashboard <ArrowRight size={18} />
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Settings Forms */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* General Profile Settings */}
            <div className="bg-card border border-border/50 rounded-3xl p-8 shadow-xl shadow-black/5">
              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-border/50">
                <div className="p-3 bg-primary/10 text-primary rounded-xl">
                  <UserIcon size={24} className="stroke-[2.5]" />
                </div>
                <div>
                  <h2 className="text-2xl font-black">Personal Information</h2>
                  <p className="text-muted-foreground text-sm font-medium">Update your name and contact details.</p>
                </div>
              </div>

              <form onSubmit={handleProfileSave} className="space-y-6">
                {profileError && (
                  <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl text-red-700 dark:text-red-400 text-sm font-bold flex items-center gap-2">
                    <Shield size={16} /> {profileError}
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2.5">
                    <label className="text-xs font-black uppercase text-muted-foreground tracking-wider pl-1">Display Name</label>
                    <div className="relative group">
                      <UserIcon className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <input
                        required
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="w-full bg-secondary/10 hover:bg-secondary/20 rounded-2xl py-3.5 pl-12 pr-4 font-bold border border-border/50 focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                        placeholder="Your display name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <label className="text-xs font-black uppercase text-muted-foreground tracking-wider pl-1">Phone Number</label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <input
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        className="w-full bg-secondary/10 hover:bg-secondary/20 rounded-2xl py-3.5 pl-12 pr-4 font-bold border border-border/50 focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <label className="text-xs font-black uppercase text-muted-foreground tracking-wider pl-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground/50" />
                    <input
                      value={user.email}
                      disabled
                      className="w-full bg-secondary/5 rounded-2xl py-3.5 pl-12 pr-4 font-bold border border-border/30 text-muted-foreground outline-none cursor-not-allowed opacity-80"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground font-medium pl-1">Email address cannot be changed currently.</p>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-border/50">
                  {profileSaved && (
                    <span className="flex items-center gap-2 text-green-600 font-bold text-sm animate-in fade-in slide-in-from-left-2">
                      <CheckCircle size={18} className="drop-shadow-sm" /> Profile Saved!
                    </span>
                  )}
                  <button
                    type="submit"
                    disabled={profileLoading}
                    className="ml-auto flex items-center gap-2 px-8 py-3.5 bg-primary text-white rounded-2xl font-black hover:bg-primary/90 transition-all shadow-xl shadow-primary/25 hover:shadow-primary/40 disabled:opacity-70 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {profileLoading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> Save Changes</>}
                  </button>
                </div>
              </form>
            </div>

            {/* Password Security */}
            <div className="bg-card border border-border/50 rounded-3xl p-8 shadow-xl shadow-black/5">
              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-border/50">
                <div className="p-3 bg-accent/10 text-accent rounded-xl">
                  <Lock size={24} className="stroke-[2.5]" />
                </div>
                <div>
                  <h2 className="text-2xl font-black">Security</h2>
                  <p className="text-muted-foreground text-sm font-medium">Update your password to keep your account safe.</p>
                </div>
              </div>

              <form onSubmit={handlePasswordSave} className="space-y-6">
                {passwordError && (
                  <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl text-red-700 dark:text-red-400 text-sm font-bold flex items-center gap-2">
                    <Shield size={16} /> {passwordError}
                  </div>
                )}

                <div className="space-y-5">
                  {[
                    { key: "old_password", label: "Current Password" },
                    { key: "new_password", label: "New Password" },
                    { key: "confirm_new_password", label: "Confirm New Password" },
                  ].map(({ key, label }) => (
                    <div key={key} className="space-y-2.5">
                      <label className="text-xs font-black uppercase text-muted-foreground tracking-wider pl-1">{label}</label>
                      <input
                        type="password"
                        value={(passwordForm as any)[key]}
                        onChange={(e) => setPasswordForm({ ...passwordForm, [key]: e.target.value })}
                        required
                        className="w-full bg-secondary/10 hover:bg-secondary/20 rounded-2xl py-3.5 px-5 font-bold border border-border/50 focus:border-accent focus:bg-background focus:ring-4 focus:ring-accent/10 transition-all outline-none"
                        placeholder="••••••••"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-border/50">
                  {passwordSaved && (
                    <span className="flex items-center gap-2 text-green-600 font-bold text-sm animate-in fade-in slide-in-from-left-2">
                      <CheckCircle size={18} className="drop-shadow-sm" /> Password Updated!
                    </span>
                  )}
                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="ml-auto flex items-center gap-2 px-8 py-3.5 bg-foreground text-background rounded-2xl font-black hover:bg-foreground/90 transition-all shadow-xl hover:shadow-2xl disabled:opacity-70 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {passwordLoading ? <Loader2 className="animate-spin text-background" size={20} /> : <><Lock size={20} /> Change Password</>}
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
