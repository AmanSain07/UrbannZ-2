"use client";

import { useState, useEffect } from "react";
import { User as UserIcon, Mail, Phone, Save, Lock, Loader2, CheckCircle, Shield, AlertTriangle, Camera } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { updateProfile, changePassword, uploadAvatarAPI } from "@/lib/api";

export default function AdminSettingsPage() {
  const { user, refreshUser } = useAuth();
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [profileForm, setProfileForm] = useState({ name: "", phone: "" });
  const [passwordForm, setPasswordForm] = useState({
    old_password: "",
    new_password: "",
    confirm_new_password: "",
  });

  useEffect(() => {
    if (user) setProfileForm({ name: user.name || "", phone: user.phone || "" });
  }, [user]);

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

  if (!user) return null;

  const initials = user.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "A";

  const avatarSrc = user.avatar
    ? user.avatar.startsWith("http")
      ? user.avatar
      : `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"}${user.avatar}`
    : null;

  return (
    <div className="space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-2 duration-350">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Admin settings</h1>
        <p className="text-muted-foreground font-medium text-sm">Manage your administrator credentials and platform controls.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 items-start">
        {/* Left: Admin Overview Card */}
        <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col items-center text-center space-y-4 py-4">
            <div className="relative group size-24">
              <div className="size-24 rounded-full overflow-hidden bg-gradient-to-tr from-violet-600 to-indigo-500 text-white flex items-center justify-center font-bold text-4xl shadow-xl shadow-indigo-600/10">
                {avatarSrc ? (
                  <img src={avatarSrc} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  initials
                )}
              </div>
              
              {/* Photo Upload Overlay */}
              <label className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px] font-bold">
                <Camera size={18} className="mb-1" />
                Upload Photo
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
              </label>
            </div>

            <div>
              <h2 className="text-2xl font-black">{user.name}</h2>
              <p className="text-sm text-muted-foreground font-medium">{user.email}</p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Shield size={14} /> System Administrator
            </span>
          </div>

          <div className="border-t border-border/50 pt-6 space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground font-medium">Console Privilege</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400 uppercase">Superuser</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground font-medium">Session Status</span>
              <span className="text-green-600 font-bold flex items-center gap-1"><CheckCircle size={14} /> Authorized</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground font-medium">Created At</span>
              <span className="font-bold">{user.created_at ? new Date(user.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short" }) : "N/A"}</span>
            </div>
          </div>

          <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-4 flex gap-3 text-xs text-red-600 dark:text-red-400 font-semibold leading-relaxed">
            <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" />
            <p>Ensure your password remains complex and secure. Administrator accounts hold full destructive access over database objects and user profiles.</p>
          </div>
        </div>

        {/* Right: Input forms */}
        <div className="md:col-span-2 space-y-8">
          {/* Profile Details Form */}
          <form onSubmit={handleProfileSave} className="space-y-6 bg-card border border-border/50 rounded-3xl p-6 shadow-sm">
            <h3 className="text-xl font-bold flex items-center gap-2 border-b border-border/50 pb-4">
              <UserIcon className="w-5 h-5 text-primary" /> Administrator Profile Settings
            </h3>

            {profileError && (
              <div className="p-3.5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl text-red-700 dark:text-red-400 text-sm font-medium">
                {profileError}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground pl-1">Display Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
                  <input
                    required
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full bg-secondary/10 rounded-xl py-3 pl-10 pr-4 font-semibold border border-border/50 focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    placeholder="Your display name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground pl-1">Contact Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
                  <input
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full bg-secondary/10 rounded-xl py-3 pl-10 pr-4 font-semibold border border-border/50 focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground pl-1">Email Address (Read-only)</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
                <input
                  value={user.email}
                  disabled
                  className="w-full bg-secondary/5 rounded-xl py-3 pl-10 pr-4 font-semibold border border-border/30 text-muted-foreground outline-none cursor-not-allowed"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              {profileSaved && (
                <span className="flex items-center gap-1.5 text-green-600 font-bold text-sm animate-in fade-in">
                  <CheckCircle size={16} /> Saved!
                </span>
              )}
              <button
                type="submit"
                disabled={profileLoading}
                className="ml-auto flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-70 active:scale-95"
              >
                {profileLoading ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18} /> Save Settings</>}
              </button>
            </div>
          </form>

          {/* Password Section */}
          <form onSubmit={handlePasswordSave} className="space-y-6 bg-card border border-border/50 rounded-3xl p-6 shadow-sm">
            <h3 className="text-xl font-bold flex items-center gap-2 border-b border-border/50 pb-4">
              <Lock className="w-5 h-5 text-primary" /> Change Password
            </h3>

            {passwordError && (
              <div className="p-3.5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl text-red-700 dark:text-red-400 text-sm font-medium">
                {passwordError}
              </div>
            )}

            <div className="space-y-4">
              {[
                { key: "old_password", label: "Current Password" },
                { key: "new_password", label: "New Password" },
                { key: "confirm_new_password", label: "Confirm New Password" },
              ].map(({ key, label }) => (
                <div key={key} className="space-y-2">
                  <label className="text-xs font-bold uppercase text-muted-foreground pl-1">{label}</label>
                  <input
                    type="password"
                    value={(passwordForm as any)[key]}
                    onChange={(e) => setPasswordForm({ ...passwordForm, [key]: e.target.value })}
                    required
                    className="w-full bg-secondary/10 rounded-xl py-3 px-4 font-semibold border border-border/50 focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    placeholder="••••••••"
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              {passwordSaved && (
                <span className="flex items-center gap-1.5 text-green-600 font-bold text-sm animate-in fade-in">
                  <CheckCircle size={16} /> Password changed!
                </span>
              )}
              <button
                type="submit"
                disabled={passwordLoading}
                className="ml-auto flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-70 active:scale-95"
              >
                {passwordLoading ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18} /> Update Password</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
