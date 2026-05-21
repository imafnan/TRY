"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ImageIcon, Loader2, Trash2, Upload } from "lucide-react";
import toast from "react-hot-toast";
import { COMPANY } from "@/constants";
import { HERO_DESCRIPTION } from "@/constants/hero";
import { siteSettingsService } from "@/services/siteSettingsService";
import { getErrorMessage } from "@/utils";

const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPT = "image/jpeg,image/png,image/gif,image/webp,.jpg,.jpeg,.png,.gif,.webp";

function validateImageFile(file: File): string | null {
  if (file.size > MAX_BYTES) return "Image must be 5 MB or smaller.";
  const okType =
    /^image\/(jpeg|png|gif|webp)$/i.test(file.type) ||
    /\.(jpe?g|png|gif|webp)$/i.test(file.name);
  if (!okType) return "Use JPEG, PNG, GIF, or WebP only.";
  return null;
}

export default function AdminHeroBannerPage() {
  const queryClient = useQueryClient();
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["hero-banners"],
    queryFn: siteSettingsService.getHeroBanners,
    staleTime: 30 * 1000,
  });

  const banners = data?.banners ?? [];
  const count = data?.count ?? banners.length;
  const banner = banners[0];
  const hasBanner = count > 0 && !!banner;

  useEffect(() => {
    if (!pendingFile) {
      setObjectUrl(null);
      return;
    }
    const url = URL.createObjectURL(pendingFile);
    setObjectUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [pendingFile]);

  const previewBgUrl = useMemo(
    () => objectUrl ?? banner?.url ?? "/Heroimg.jpeg",
    [objectUrl, banner?.url]
  );

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["hero-banners"] });

  const addMutation = useMutation({
    mutationFn: (file: File) => siteSettingsService.addHeroBanner(file),
    onSuccess: () => {
      toast.success("Banner added.");
      setPendingFile(null);
      invalidate();
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) =>
      siteSettingsService.updateHeroBanner(id, file),
    onSuccess: () => {
      toast.success("Banner updated.");
      setPendingFile(null);
      invalidate();
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => siteSettingsService.deleteHeroBanner(id),
    onSuccess: () => {
      toast.success("Banner removed.");
      setPendingFile(null);
      invalidate();
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const err = validateImageFile(file);
    if (err) {
      toast.error(err);
      return;
    }
    setPendingFile(file);
  };

  const handleAdd = () => {
    if (!pendingFile || hasBanner) return;
    addMutation.mutate(pendingFile);
  };

  const handleUpdate = () => {
    if (!banner || !pendingFile) return;
    updateMutation.mutate({ id: banner.id, file: pendingFile });
  };

  const handleDelete = () => {
    if (!banner) return;
    if (!confirm("Remove this hero banner from the site and Cloudinary?")) return;
    deleteMutation.mutate(banner.id);
  };

  const busy =
    addMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hero banner</h1>
          <p className="mt-1 text-sm text-gray-500">
            Single banner for the homepage hero. JPEG, PNG, GIF, or WebP · max 5 MB.
          </p>
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isLoading}
          className="text-sm font-medium text-[#0d2353] hover:underline disabled:opacity-50"
        >
          Refresh
        </button>
      </div>

      {count > 1 && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Multiple banners exist on the server ({count}). Only one is shown on the site.
          Update or remove banners until one remains for the intended behaviour.
        </div>
      )}

      {isError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          Could not load banners. Check the API or try again.
        </div>
      )}

      {/* WYSIWYG preview */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 overflow-hidden rounded-xl border border-gray-200 shadow-sm"
      >
        <div className="border-b border-gray-100 bg-gray-50 px-4 py-2 text-xs font-medium uppercase tracking-wide text-gray-500">
          Homepage preview
        </div>
        <div className="relative flex min-h-[220px] items-center justify-center overflow-hidden bg-[#0d2353] px-4 py-8 text-white sm:min-h-[320px] md:min-h-[400px]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628]/95 via-[#0d2353]/85 to-[#1a3a6e]/90" />
          <div
            className="absolute inset-0 bg-cover bg-center opacity-35 md:opacity-30"
            style={{
              backgroundImage: `url("${previewBgUrl}")`,
            }}
          />
          <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center text-center">
            <h2 className="max-w-4xl text-[clamp(18px,4vw,36px)] font-bold leading-tight">
              {COMPANY.name}
            </h2>
            <div className="mt-2 max-w-3xl text-[11px] leading-snug text-blue-100 sm:text-xs md:text-base">
              <span>{COMPANY.address}</span>
            </div>
            <div className="mt-4 w-full max-w-[92vw] border border-white/35 bg-white/5 px-3 py-3 sm:max-w-3xl sm:px-5 sm:py-4 md:max-w-4xl">
              <p className="text-[10px] leading-relaxed text-white/90 sm:text-xs md:text-sm md:leading-relaxed">
                {HERO_DESCRIPTION}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Controls */}
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <ImageIcon className="text-[#0d2353]" size={22} />
          <h2 className="font-semibold text-gray-900">Banner image</h2>
        </div>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-gray-700">
            Choose file (field name <code className="rounded bg-gray-100 px-1 text-xs">image</code>)
          </span>
          <input
            type="file"
            accept={ACCEPT}
            onChange={onFileChange}
            disabled={busy}
            className="block w-full text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-[#0d2353] file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-[#1a3a6e]"
          />
        </label>

        {pendingFile && (
          <p className="mt-2 text-xs text-gray-600">
            Selected: <span className="font-mono">{pendingFile.name}</span> (
            {(pendingFile.size / 1024).toFixed(1)} KB)
          </p>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleAdd}
            disabled={busy || hasBanner || !pendingFile || isLoading}
            title={
              hasBanner
                ? "Remove the current banner before adding a new one."
                : !pendingFile
                  ? "Select an image first."
                  : undefined
            }
            className="inline-flex items-center gap-2 rounded-lg bg-[#0d2353] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1a3a6e] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {addMutation.isPending ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
            Add banner
          </button>

          <button
            type="button"
            onClick={handleUpdate}
            disabled={busy || !hasBanner || !pendingFile || isLoading}
            title={
              !hasBanner
                ? "Add a banner first."
                : !pendingFile
                  ? "Select a new image to replace the current one."
                  : undefined
            }
            className="inline-flex items-center gap-2 rounded-lg border border-[#0d2353] bg-white px-4 py-2.5 text-sm font-semibold text-[#0d2353] transition-colors hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {updateMutation.isPending ? <Loader2 className="animate-spin" size={18} /> : <ImageIcon size={18} />}
            Update image
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={busy || !hasBanner || isLoading}
            className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deleteMutation.isPending ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
            Remove banner
          </button>
        </div>

        <p className="mt-4 text-xs text-gray-500">
          <strong>Add banner</strong> is only available when no banner exists.{" "}
          <strong>Update image</strong> replaces the image on the server (same banner id).
        </p>
      </div>
    </div>
  );
}
