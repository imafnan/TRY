"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Download, X, AlertCircle, Loader2 } from "lucide-react";
import { certificateService } from "@/services/certificateService";
import type { Certificate } from "@/types";
import {
  CertificateJpgLayer,
  saveCertificatePdf,
  useResolvedTemplateUrl,
} from "@/components/certificate/certificateTemplateCore";
import { CertificatePrintPreview } from "@/components/certificate/CertificatePrintPreview";
import toast from "react-hot-toast";

export function CertificateSection() {
  const [refNo, setRefNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [showFallbackPreview, setShowFallbackPreview] = useState(false);

  const certRef = useRef<HTMLDivElement>(null);

  const { url: templateUrl, ready: templateReady } =
    useResolvedTemplateUrl(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = refNo.trim();

    if (!trimmed) {
      toast.error("Please enter a Ref ID");
      return;
    }

    setLoading(true);
    setError(null);
    setCertificate(null);
    setSearched(true);
    setShowFallbackPreview(false);

    try {
      const cert = await certificateService.getByRef(trimmed);
      setCertificate(cert);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Certificate not found";

      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setCertificate(null);
    setError(null);
    setRefNo("");
    setSearched(false);
    setShowFallbackPreview(false);
  };

  const handleDownloadPdf = async () => {
    if (!certRef.current || !certificate) return;

    setPdfLoading(true);

    try {
      await saveCertificatePdf(certRef.current, certificate.ref_no);
      toast.success("PDF downloaded");
    } catch {
      toast.error("Could not generate PDF. Please try again.");
    } finally {
      setPdfLoading(false);
    }
  };

  const certificateVisible = Boolean(certificate && !loading);

  return (
    <section
      id="certificate"
      className="py-10 sm:py-16 px-2 sm:px-4 bg-white"
    >
      <div className="mx-auto w-full min-w-0 max-w-6xl px-3 sm:px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Heading */}
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 text-center md:text-left">
            Certificate
          </h2>

          <p className="text-gray-500 mb-8 text-center md:text-left">
            Enter your Reference ID to verify and download your certificate.
          </p>

          {/* Search Form */}
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-3 mb-6"
          >
            <div className="relative flex-1">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />

              <input
                type="text"
                value={refNo}
                onChange={(e) => setRefNo(e.target.value)}
                placeholder="Enter Ref ID e.g. SPD000001"
                className="w-full border border-gray-300 rounded-lg pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d2353] focus:border-transparent transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-[#0d2353] text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-[#1a3a6e] transition-all duration-200 disabled:opacity-60 min-w-[130px] flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search size={16} />
                  Search
                </>
              )}
            </button>
          </form>

          {/* Loading */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-gray-50 border border-gray-200 rounded-2xl p-8 mb-6 flex flex-col items-center justify-center gap-3 min-h-[160px]"
              >
                <Loader2
                  className="animate-spin text-[#0d2353]"
                  size={28}
                />

                <p className="text-sm text-gray-500">
                  Looking up certificate…
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error */}
          <AnimatePresence>
            {error && searched && !loading && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl mb-6"
              >
                <AlertCircle
                  size={18}
                  className="text-red-500 flex-shrink-0 mt-0.5"
                />

                <div className="flex-1">
                  <p className="text-red-700 font-medium text-sm">
                    Certificate Not Found
                  </p>

                  <p className="text-red-600 text-xs mt-0.5">
                    {error}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleClear}
                  className="text-red-400 hover:text-red-600"
                >
                  <X size={16} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Certificate */}
          <AnimatePresence>
            {certificateVisible && certificate && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-5"
              >
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-green-700">
                      Verified
                    </span>

                    <span className="text-gray-400 mx-2">·</span>

                    <span className="font-mono text-gray-900">
                      {certificate.ref_no}
                    </span>

                    {certificate.status === "published" && (
                      <span className="ml-2 text-xs font-semibold text-green-800 bg-green-100 px-2.5 py-0.5 rounded-full">
                        Published
                      </span>
                    )}
                  </p>

                  <button
                    type="button"
                    onClick={handleClear}
                    className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                    aria-label="Clear result"
                  >
                    <X size={20} />
                  </button>
                </div>

                {!templateReady ? (
                  <div className="flex flex-col items-center justify-center gap-3 py-16 bg-gray-50 rounded-xl border border-gray-100">
                    <Loader2
                      className="animate-spin text-[#0d2353]"
                      size={28}
                    />

                    <p className="text-sm text-gray-500">
                      Loading certificate…
                    </p>
                  </div>
                ) : templateUrl ? (
                  <>
                    <div className="w-full min-w-0 flex justify-center bg-gray-50 rounded-xl p-2 sm:p-4 md:p-6 border border-gray-100">
                      <CertificateJpgLayer
                        ref={certRef}
                        certificate={certificate}
                        imageUrl={templateUrl}
                      />
                    </div>

                    <div className="flex justify-center pt-1">
                      <button
                        type="button"
                        disabled={pdfLoading}
                        onClick={handleDownloadPdf}
                        className="inline-flex items-center justify-center gap-2 bg-[#0d2353] text-white px-10 py-3.5 rounded-lg font-semibold hover:bg-[#1a3a6e] transition-colors text-sm disabled:opacity-60 min-w-[200px]"
                      >
                        {pdfLoading ? (
                          <>
                            <Loader2
                              size={18}
                              className="animate-spin"
                            />
                            Generating…
                          </>
                        ) : (
                          <>
                            <Download size={18} />
                            Download PDF
                          </>
                        )}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-center space-y-3">
                    <p className="text-sm text-amber-900">
                      The printable certificate image is not
                      available on this site.
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        setShowFallbackPreview(true)
                      }
                      className="text-sm font-semibold text-[#0d2353] underline hover:no-underline"
                    >
                      Open printable certificate
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Fallback Preview */}
      <AnimatePresence>
        {showFallbackPreview && certificate && (
          <CertificatePrintPreview
            certificate={certificate}
            onClose={() => setShowFallbackPreview(false)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}