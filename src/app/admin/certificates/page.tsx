"use client";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { certificateService } from "@/services/certificateService";
import { Plus, Search, Pencil, Trash2, RefreshCw, AlertCircle, Eye } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { formatDate, getErrorMessage } from "@/utils";
import toast from "react-hot-toast";
import type { Certificate } from "@/types";
import { CertificatePrintPreview } from "@/components/certificate/CertificatePrintPreview";

export default function CertificatesPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [previewCert, setPreviewCert] = useState<Certificate | null>(null);
  /** Session JPG background for certificate preview (revoked on change/unmount). */
  const [templateObjectUrl, setTemplateObjectUrl] = useState<string | null>(null);
  const perPage = 10;

  useEffect(() => {
    return () => {
      if (templateObjectUrl) URL.revokeObjectURL(templateObjectUrl);
    };
  }, [templateObjectUrl]);

  const handleTemplateFile = (fileList: FileList | null) => {
    const file = fileList?.[0];
    if (!file) return;
    if (!/^image\/(jpeg|jpg|png|webp)$/i.test(file.type)) {
      toast.error("Please choose a JPG or PNG image.");
      return;
    }
    setTemplateObjectUrl(URL.createObjectURL(file));
    toast.success("Template applied to previews on this page.");
  };

  const {
    data: certificates = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["certificates"],
    queryFn: certificateService.getAll,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  const deleteMutation = useMutation({
    mutationFn: certificateService.delete,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["certificates"] });
      await queryClient.refetchQueries({ queryKey: ["certificates"] });
      toast.success("Certificate deleted successfully");
      setDeleteId(null);
    },
    onError: (err) => {
      toast.error(getErrorMessage(err));
      setDeleteId(null);
    },
  });

  const filtered = certificates.filter(
    (c) =>
      c.full_name.toLowerCase().includes(search.toLowerCase()) ||
      c.ref_no.toLowerCase().includes(search.toLowerCase()) ||
      (c.skill_title || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.district || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Certificates</h1>
          <p className="text-gray-500 text-sm mt-1">
            {isLoading ? "Loading..." : `${filtered.length} records found`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw size={18} className={isFetching ? "animate-spin" : ""} />
          </button>
          <Link
            href="/admin/certificates/create"
            className="flex items-center gap-2 bg-[#0d2353] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#1a3a6e] transition-colors"
          >
            <Plus size={16} />
            New Certificate
          </Link>
        </div>
      </div>

      {/* Search + optional certificate background JPG */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4 space-y-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search by name, ref no, skill, district..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0d2353] focus:border-transparent"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-gray-100 text-sm">
          <span className="text-gray-600 font-medium">Certificate background</span>
          <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-800 transition-colors">
            <span>Upload JPG / PNG</span>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              className="sr-only"
              onChange={(e) => {
                handleTemplateFile(e.target.files);
                e.target.value = "";
              }}
            />
          </label>
          {templateObjectUrl && (
            <button
              type="button"
              onClick={() => setTemplateObjectUrl(null)}
              className="text-red-600 hover:text-red-800 font-medium"
            >
              Clear upload
            </button>
          )}
          <span className="text-xs text-gray-500">
            Dynamic fields are drawn on top when you open a preview. For a permanent URL use{" "}
            <code className="text-[11px] bg-gray-100 px-1 rounded">NEXT_PUBLIC_CERTIFICATE_TEMPLATE_URL</code>{" "}
            or replace <code className="text-[11px] bg-gray-100 px-1 rounded">public/Certification-Final-Blank.jpg.jpeg</code>{" "}
            and bump the cache key in <code className="text-[11px] bg-gray-100 px-1 rounded">certificateTemplateCore.tsx</code>.
          </span>
        </div>
      </div>

      {/* Error state */}
      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 flex items-center gap-3">
          <AlertCircle size={18} className="text-red-500 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-red-700 text-sm font-medium">Failed to load certificates</p>
            <p className="text-red-600 text-xs mt-0.5">{getErrorMessage(error)}</p>
          </div>
          <button
            onClick={() => refetch()}
            className="text-red-600 hover:text-red-800 text-sm font-medium underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <TableSkeleton />
        ) : paginated.length === 0 ? (
          <EmptyState search={search} onClear={() => setSearch("")} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left py-3 px-4 font-semibold text-gray-600 text-xs uppercase tracking-wide">Ref No</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600 text-xs uppercase tracking-wide">Full Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600 text-xs uppercase tracking-wide hidden md:table-cell">Skill</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600 text-xs uppercase tracking-wide hidden lg:table-cell">District</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600 text-xs uppercase tracking-wide hidden lg:table-cell">Issue Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600 text-xs uppercase tracking-wide">Status</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-600 text-xs uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {paginated.map((cert, i) => (
                    <motion.tr
                      key={cert._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors"
                    >
                      <td className="py-3 px-4 font-mono text-xs text-gray-500">{cert.ref_no}</td>
                      <td className="py-3 px-4 font-medium text-gray-900">{cert.full_name}</td>
                      <td className="py-3 px-4 text-gray-600 hidden md:table-cell">{cert.skill_title || "—"}</td>
                      <td className="py-3 px-4 text-gray-600 hidden lg:table-cell">{cert.district || "—"}</td>
                      <td className="py-3 px-4 text-gray-600 hidden lg:table-cell">{formatDate(cert.issue_date)}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          cert.status === "published"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {cert.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Preview button */}
                          <button
                            onClick={() => setPreviewCert(cert)}
                            className="p-1.5 rounded-lg hover:bg-purple-50 text-purple-600 transition-colors"
                            title="Preview Certificate"
                          >
                            <Eye size={15} />
                          </button>
                          <Link
                            href={`/admin/certificates/${cert._id}`}
                            className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                            title="Edit"
                          >
                            <Pencil size={15} />
                          </Link>
                          <button
                            onClick={() => setDeleteId(cert._id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm">
            <span className="text-gray-500 text-xs">
              Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 text-gray-700 text-xs font-medium"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .map((p, idx, arr) => (
                  <>
                    {idx > 0 && arr[idx - 1] !== p - 1 && (
                      <span key={`ellipsis-${p}`} className="px-2 py-1.5 text-gray-400 text-xs">…</span>
                    )}
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                        page === p
                          ? "bg-[#0d2353] text-white border-[#0d2353]"
                          : "border-gray-200 hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      {p}
                    </button>
                  </>
                ))}
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 text-gray-700 text-xs font-medium"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewCert && (
          <CertificatePrintPreview
            certificate={previewCert}
            onClose={() => setPreviewCert(null)}
            templateImageUrl={templateObjectUrl}
          />
        )}
      </AnimatePresence>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {deleteId && (
          <DeleteModal
            onConfirm={() => deleteMutation.mutate(deleteId)}
            onCancel={() => setDeleteId(null)}
            loading={deleteMutation.isPending}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="p-4 space-y-3">
      <div className="h-8 bg-gray-100 rounded animate-pulse" />
      {[...Array(7)].map((_, i) => (
        <div key={i} className="h-12 bg-gray-50 rounded animate-pulse" style={{ opacity: 1 - i * 0.1 }} />
      ))}
    </div>
  );
}

function EmptyState({ search, onClear }: { search: string; onClear: () => void }) {
  return (
    <div className="p-16 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Search size={24} className="text-gray-400" />
      </div>
      <p className="text-gray-600 font-medium mb-1">
        {search ? "No certificates match your search" : "No certificates yet"}
      </p>
      <p className="text-gray-400 text-sm mb-4">
        {search ? `No results for "${search}"` : "Create your first certificate to get started"}
      </p>
      {search ? (
        <button onClick={onClear} className="text-[#0d2353] text-sm font-medium hover:underline">
          Clear search
        </button>
      ) : (
        <Link
          href="/admin/certificates/create"
          className="inline-flex items-center gap-2 bg-[#0d2353] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#1a3a6e] transition-colors"
        >
          <Plus size={16} />
          Create Certificate
        </Link>
      )}
    </div>
  );
}

function DeleteModal({
  onConfirm,
  onCancel,
  loading,
}: {
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl"
      >
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 size={20} className="text-red-600" />
        </div>
        <h3 className="font-bold text-lg text-gray-900 mb-2 text-center">Delete Certificate</h3>
        <p className="text-gray-500 text-sm mb-6 text-center">
          This action is permanent and cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
