"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Lock, Mail, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { authService } from "@/services/authService";
import { useAuth } from "@/store/authStore";
import { getErrorMessage } from "@/utils";
import toast from "react-hot-toast";

const emailSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newEmail: z.string().email("Enter a valid email"),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

type EmailFormValues = z.infer<typeof emailSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function AccountPage() {
  const { user, updateUser } = useAuth();
  const [showEmailPwd, setShowEmailPwd] = useState(false);
  const [showCurrPwd, setShowCurrPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { currentPassword: "", newEmail: "" },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "" },
  });

  const onEmailSubmit = async (values: EmailFormValues) => {
    setEmailLoading(true);
    try {
      const { message, user: nextUser } = await authService.changeEmail(
        values.currentPassword,
        values.newEmail.trim()
      );
      updateUser(nextUser);
      toast.success(message || "Email updated.");
      emailForm.reset({ currentPassword: "", newEmail: "" });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setEmailLoading(false);
    }
  };

  const onPasswordSubmit = async (values: PasswordFormValues) => {
    setPasswordLoading(true);
    try {
      const { message } = await authService.changePassword(
        values.currentPassword,
        values.newPassword
      );
      toast.success(message || "Password updated.");
      passwordForm.reset();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Account</h1>
        <p className="text-gray-500 text-sm mt-1">
          Change the email or password used for admin login and API headers.
        </p>
      </div>

      <div className="mb-6 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Signed in as</p>
        <p className="mt-1 font-mono text-sm text-gray-800">{user?.email ?? "—"}</p>
        <p className="mt-0.5 text-xs text-gray-500">Role: {user?.role ?? "admin"}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
        >
          <div className="mb-5 flex items-center gap-2">
            <div className="rounded-lg bg-[#0d2353]/10 p-2 text-[#0d2353]">
              <Mail size={20} />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Change email</h2>
              <p className="text-xs text-gray-500">Confirm with your current password</p>
            </div>
          </div>

          <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">New email</label>
              <input
                {...emailForm.register("newEmail")}
                type="email"
                autoComplete="email"
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#0d2353]"
                placeholder="new@example.com"
              />
              {emailForm.formState.errors.newEmail && (
                <p className="mt-1 text-xs text-red-500">{emailForm.formState.errors.newEmail.message}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Current password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  {...emailForm.register("currentPassword")}
                  type={showEmailPwd ? "text" : "password"}
                  autoComplete="current-password"
                  className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-10 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#0d2353]"
                />
                <button
                  type="button"
                  onClick={() => setShowEmailPwd(!showEmailPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showEmailPwd ? "Hide password" : "Show password"}
                >
                  {showEmailPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {emailForm.formState.errors.currentPassword && (
                <p className="mt-1 text-xs text-red-500">
                  {emailForm.formState.errors.currentPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={emailLoading}
              className="w-full rounded-lg bg-[#0d2353] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1a3a6e] disabled:opacity-60"
            >
              {emailLoading ? "Updating…" : "Update email"}
            </button>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
        >
          <div className="mb-5 flex items-center gap-2">
            <div className="rounded-lg bg-[#0d2353]/10 p-2 text-[#0d2353]">
              <Shield size={20} />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Change password</h2>
              <p className="text-xs text-gray-500">Minimum 8 characters for the new password</p>
            </div>
          </div>

          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Current password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  {...passwordForm.register("currentPassword")}
                  type={showCurrPwd ? "text" : "password"}
                  autoComplete="current-password"
                  className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-10 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#0d2353]"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrPwd(!showCurrPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showCurrPwd ? "Hide password" : "Show password"}
                >
                  {showCurrPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {passwordForm.formState.errors.currentPassword && (
                <p className="mt-1 text-xs text-red-500">
                  {passwordForm.formState.errors.currentPassword.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">New password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  {...passwordForm.register("newPassword")}
                  type={showNewPwd ? "text" : "password"}
                  autoComplete="new-password"
                  className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-10 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#0d2353]"
                  placeholder="At least 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPwd(!showNewPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showNewPwd ? "Hide password" : "Show password"}
                >
                  {showNewPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {passwordForm.formState.errors.newPassword && (
                <p className="mt-1 text-xs text-red-500">
                  {passwordForm.formState.errors.newPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={passwordLoading}
              className="w-full rounded-lg bg-[#0d2353] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1a3a6e] disabled:opacity-60"
            >
              {passwordLoading ? "Updating…" : "Update password"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
