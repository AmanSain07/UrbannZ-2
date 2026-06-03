"use client";

import { useState, useEffect } from "react";
import { User, Mail, Phone, Save, Lock, Loader2, CheckCircle } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { updateProfile, changePassword } from "@/lib/api";

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
    if (user) setProfileForm({ name: user.name || "", phone: "" });
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

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Admin Settings</h1>
        <p className="text-muted-foreground">Manage your admin profile and account security.</p>
      </div>

      {/* Profile Section */}
      <form onSubmit={handleProfileSave} className="space-y-4 bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
        <h3 className="text-xl font-bold flex items-center gap-2 border-b border-border/50 pb-4">
          <User className="w-5 h-5 text-primary" /> Profile
        </h3>

        {profileError && (
          <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl text-red-700 dark:text-red-400 text-sm font-medium">
            {profileError}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-muted-foreground pl-1">Display Name</label>
          <div className="relative">
            <User className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
            <input
              value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              className="w-full bg-secondary/10 rounded-xl py-2.5 pl-10 pr-4 font-medium border border-border/50 focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              placeholder="Your display name"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-muted-foreground pl-1">Email (read-only)</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
            <input
              value={user.email}
              disabled
              className="w-full bg-secondary/5 rounded-xl py-2.5 pl-10 pr-4 font-medium border border-border/30 text-muted-foreground outline-none cursor-not-allowed"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-muted-foreground pl-1">Phone</label>
          <div className="relative">
            <Phone className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
            <input
              value={profileForm.phone}
              onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
              className="w-full bg-secondary/10 rounded-xl py-2.5 pl-10 pr-4 font-medium border border-border/50 focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              placeholder="+91 98765 43210"
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
            className="ml-auto flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-70"
          >
            {profileLoading ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18} /> Save Profile</>}
          </button>
        </div>
      </form>

      {/* Password Section */}
      <form onSubmit={handlePasswordSave} className="space-y-4 bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
        <h3 className="text-xl font-bold flex items-center gap-2 border-b border-border/50 pb-4">
          <Lock className="w-5 h-5 text-primary" /> Change Password
        </h3>

        {passwordError && (
          <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl text-red-700 dark:text-red-400 text-sm font-medium">
            {passwordError}
          </div>
        )}

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
              className="w-full bg-secondary/10 rounded-xl py-2.5 px-4 font-medium border border-border/50 focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              placeholder="••••••••"
            />
          </div>
        ))}

        <div className="flex items-center justify-between pt-2">
          {passwordSaved && (
            <span className="flex items-center gap-1.5 text-green-600 font-bold text-sm animate-in fade-in">
              <CheckCircle size={16} /> Password changed!
            </span>
          )}
          <button
            type="submit"
            disabled={passwordLoading}
            className="ml-auto flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-70"
          >
            {passwordLoading ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18} /> Update Password</>}
          </button>
        </div>
      </form>
    </div>
  );
}
