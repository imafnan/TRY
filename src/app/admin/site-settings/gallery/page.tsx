"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { motion } from "framer-motion";
import { Images, Loader2, Pencil, Trash2, Upload } from "lucide-react";
import { useRef } from "react";
import toast from "react-hot-toast";
import { siteSettingsService } from "@/services/siteSettingsService";
import type { GalleryItem } from "@/types";
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

export default function AdminGalleryPage() {
  const queryClient = useQueryClient();
  const addInputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["site-gallery"],
    queryFn: siteSettingsService.getGallery,
    staleTime: 30 * 1000,
  });

  const gallery = data?.gallery ?? [];
  const count = data?.count ?? gallery.length;

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["site-gallery"] });

  const addMutation = useMutation({
    mutationFn: (file: File) => siteSettingsService.addGalleryImage(file),
    onSuccess: () => {
      toast.success("Image added to gallery.");
      invalidate();
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) =>
      siteSettingsService.updateGalleryImage(id, file),
    onSuccess: () => {
      toast.success("Image updated.");
      invalidate();
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => siteSettingsService.deleteGalleryImage(id),
    onSuccess: () => {
      toast.success("Image removed.");
      invalidate();
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const deleteAllMutation = useMutation({
    mutationFn: () => siteSettingsService.deleteAllGallery(),
    onSuccess: () => {
      toast.success("All gallery images removed.");
      invalidate();
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const busyAny =
    addMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending ||
    deleteAllMutation.isPending;

  const onAddFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const err = validateImageFile(file);
    if (err) {
      toast.error(err);
      return;
    }
    addMutation.mutate(file);
  };

  const onReplaceFile = (galleryId: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const err = validateImageFile(file);
    if (err) {
      toast.error(err);
      return;
    }
    updateMutation.mutate({ id: galleryId, file });
  };

  const handleDeleteOne = (item: GalleryItem) => {
    if (!confirm(`Remove this image from the gallery?`)) return;
    deleteMutation.mutate(item.id);
  };

  const handleDeleteAll = () => {
    if (count === 0) return;
    if (
      !confirm(
        `Remove all ${count} gallery image(s) from the site and storage? This cannot be undone.`
      )
    ) {
      return;
    }
    deleteAllMutation.mutate();
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gallery</h1>
          <p className="mt-1 text-sm text-gray-500">
            Unlimited images for the public certificate page grid. JPEG, PNG, GIF, or WebP · max 5
            MB each. Field name <code className="rounded bg-gray-100 px-1 text-xs">image</code>.
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

      {isError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          Could not load gallery. Check the API or try again.
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
      >
        <div className="mb-4 flex items-center gap-2">
          <Upload className="text-[#0d2353]" size={22} />
          <h2 className="font-semibold text-gray-900">Add image</h2>
        </div>
        <input
          ref={addInputRef}
          type="file"
          accept={ACCEPT}
          className="hidden"
          onChange={onAddFile}
          disabled={busyAny}
        />
        <button
          type="button"
          onClick={() => addInputRef.current?.click()}
          disabled={busyAny || isLoading}
          className="inline-flex items-center gap-2 rounded-lg bg-[#0d2353] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1a3a6e] disabled:opacity-60"
        >
          {addMutation.isPending ? <Loader2 className="animate-spin" size={18} /> : <Images size={18} />}
          Choose file & upload
        </button>
        <p className="mt-2 text-xs text-gray-500">
          {count} image{count !== 1 ? "s" : ""} in gallery
        </p>
      </motion.div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="animate-spin text-[#0d2353]" size={32} />
        </div>
      ) : gallery.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 py-12 text-center text-sm text-gray-500">
          No gallery images yet. Upload one above — they appear on the certificate page in a
          responsive grid.
        </div>
      ) : (
        <ul className="m-0 grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {gallery.map((item) => {
            const updating =
              updateMutation.isPending && updateMutation.variables?.id === item.id;
            const deleting =
              deleteMutation.isPending && deleteMutation.variables === item.id;

            return (
              <li key={item.id} className="min-w-0">
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                  <div className="relative aspect-[4/3] w-full bg-gray-100">
                    <Image
                      src={item.url}
                      alt="Gallery"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {(updating || deleting) && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <Loader2 className="animate-spin text-white" size={28} />
                      </div>
                    )}
                  </div>
                  <div className="space-y-2 p-3">
                    <p className="truncate font-mono text-[10px] text-gray-400" title={item.publicId}>
                      {item.publicId}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100">
                        <Pencil size={14} />
                        Replace
                        <input
                          type="file"
                          accept={ACCEPT}
                          className="sr-only"
                          disabled={busyAny}
                          onChange={onReplaceFile(item.id)}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => handleDeleteOne(item)}
                        disabled={busyAny}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {gallery.length > 0 && (
        <div className="mt-8 border-t border-gray-100 pt-6">
          <button
            type="button"
            onClick={handleDeleteAll}
            disabled={busyAny}
            className="text-sm font-medium text-red-600 underline-offset-2 hover:underline disabled:opacity-50"
          >
            {deleteAllMutation.isPending ? "Removing all…" : "Remove all gallery images"}
          </button>
        </div>
      )}
    </div>
  );
}
