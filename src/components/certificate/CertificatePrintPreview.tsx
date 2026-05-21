"use client";
import { useRef, useState } from "react";
import { X, Printer, Download, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Certificate } from "@/types";
import { formatDate, formatDateMDY } from "@/utils";
import { COMPANY } from "@/constants";
import {
  CERT_WIDTH_PX,
  CERT_HEIGHT_PX,
  CertificateJpgLayer,
  CERTIFICATE_WISHES_LINE,
  CERTIFICATE_LINE_HEIGHT,
  saveCertificatePdf,
  useResolvedTemplateUrl,
} from "@/components/certificate/certificateTemplateCore";

export interface CertificatePrintPreviewProps {
  certificate: Certificate;
  onClose: () => void;
  /** Highest priority: e.g. object URL from an admin file upload. */
  templateImageUrl?: string | null;
}

export function CertificatePrintPreview({
  certificate,
  onClose,
  templateImageUrl: templateImageUrlProp,
}: CertificatePrintPreviewProps) {
  const certRef = useRef<HTMLDivElement>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const { url: templateImageUrl, ready: templateOverlayReady } =
    useResolvedTemplateUrl(templateImageUrlProp ?? null);
  const useImageTemplate = Boolean(templateImageUrl);

  const handleDownloadPDF = async () => {
    if (!certRef.current) return;
    setPdfLoading(true);
    try {
      await saveCertificatePdf(certRef.current, certificate.ref_no);
    } catch {
      handlePrint();
    } finally {
      setPdfLoading(false);
    }
  };

  const handlePrint = () => {
    const content = certRef.current;
    if (!content) return;
    const win = window.open("", "_blank");
    if (!win) return;
    const poppinsLink = useImageTemplate
      ? `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap">`
      : "";
    const bodyFont = useImageTemplate
      ? "'Poppins', sans-serif"
      : "'Times New Roman', serif";
    win.document.write(`<!DOCTYPE html><html><head>
      ${poppinsLink}
      <title>Certificate – ${certificate.ref_no}</title>
      <style>
        *{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:${bodyFont};background:#fff;}
        @page{size:A4 landscape;margin:0;}
        @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}}
      </style>
    </head><body>${content.outerHTML}</body></html>`);
    win.document.close();
    win.focus();
    setTimeout(() => {
      win.print();
      win.close();
    }, 600);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] bg-black/70 flex items-start justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.25 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-6"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-2xl">
            <div>
              <h3 className="font-bold text-lg text-[#0d2353]">
                Certificate Preview
              </h3>
              <p className="text-xs text-gray-500 font-mono mt-0.5">
                {certificate.ref_no}
              </p>
              {useImageTemplate && (
                <p className="text-[11px] text-gray-500 mt-1">
                  Using JPG/PNG template with overlaid data.
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 border border-[#0d2353] text-[#0d2353] px-4 py-2 rounded-lg font-medium hover:bg-[#0d2353] hover:text-white transition-colors text-sm"
              >
                <Printer size={15} />
                Print
              </button>
              <button
                onClick={handleDownloadPDF}
                disabled={pdfLoading}
                className="flex items-center gap-2 bg-[#0d2353] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#1a3a6e] transition-colors text-sm disabled:opacity-70"
              >
                {pdfLoading ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Download size={15} />
                )}
                {pdfLoading ? "Generating..." : "Download PDF"}
              </button>
              <button
                onClick={onClose}
                className="ml-1 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {!templateOverlayReady && !templateImageUrlProp ? (
            <div className="p-6 flex flex-col items-center justify-center gap-3 min-h-[280px] bg-gray-100 rounded-b-2xl">
              <Loader2 className="animate-spin text-[#0d2353]" size={28} />
              <p className="text-sm text-gray-500">Loading certificate…</p>
            </div>
          ) : (
            <div className="p-3 sm:p-6 w-full min-w-0 overflow-x-auto bg-gray-100 rounded-b-2xl">
              {useImageTemplate ? (
                <CertificateJpgLayer
                  ref={certRef}
                  certificate={certificate}
                  imageUrl={templateImageUrl!}
                />
              ) : (
                <div
                  ref={certRef}
                  style={{
                    width: `${CERT_WIDTH_PX}px`,
                    minHeight: `${CERT_HEIGHT_PX}px`,
                    fontFamily: "'Times New Roman', serif",
                    border: "6px solid #0d2353",
                    position: "relative",
                    background: "white",
                    margin: "0 auto",
                  }}
                >
                  <>
                    <div
                      style={{
                        height: "6px",
                        background:
                          "linear-gradient(90deg,#c9a227,#f5d76e,#c9a227)",
                      }}
                    />

                    <div
                      style={{
                        background: "#0d2353",
                        padding: "22px 40px",
                        display: "flex",
                        alignItems: "center",
                        gap: "22px",
                      }}
                    >
                      <div
                        style={{
                          width: "86px",
                          height: "86px",
                          borderRadius: "50%",
                          background: "#c9a227",
                          border: "4px solid #f5d76e",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          position: "relative",
                        }}
                      >
                        <div
                          style={{
                            width: "64px",
                            height: "64px",
                            borderRadius: "50%",
                            background: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "7px",
                              fontWeight: "bold",
                              color: "#0d2353",
                              textAlign: "center",
                              lineHeight: "1.3",
                            }}
                          >
                            SWAPNOPURI
                          </span>
                        </div>
                        <div
                          style={{
                            position: "absolute",
                            bottom: "-20px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: 0,
                            height: 0,
                            borderLeft: "14px solid transparent",
                            borderRight: "14px solid transparent",
                            borderTop: "22px solid #cc0000",
                          }}
                        />
                      </div>
                      <div>
                        <h1
                          style={{
                            color: "white",
                            fontSize: "38px",
                            fontWeight: "900",
                            letterSpacing: "2px",
                            fontFamily: "Arial, sans-serif",
                            lineHeight: "1.1",
                          }}
                        >
                          CERTIFICATION
                        </h1>
                        <p
                          style={{
                            color: "#c9a227",
                            fontSize: "13px",
                            fontWeight: "600",
                            letterSpacing: "3px",
                            marginTop: "4px",
                          }}
                        >
                          OF EXPERIENCE AND COMPETENCE
                        </p>
                      </div>
                    </div>

                    <div
                      style={{
                        height: "4px",
                        background:
                          "linear-gradient(90deg,#c9a227,#f5d76e,#c9a227)",
                      }}
                    />

                    <div style={{ padding: "28px 50px", position: "relative" }}>
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%,-50%)",
                          opacity: 0.04,
                          fontSize: "58px",
                          fontWeight: "900",
                          color: "#0d2353",
                          whiteSpace: "nowrap",
                          pointerEvents: "none",
                          letterSpacing: "4px",
                        }}
                      >
                        SWAPNOPURI
                      </div>

                      <div
                        style={{ textAlign: "center", marginBottom: "16px" }}
                      >
                        <p
                          style={{
                            fontWeight: "bold",
                            fontSize: "14px",
                            letterSpacing: "1px",
                          }}
                        >
                          {COMPANY.name.toUpperCase()}
                        </p>
                        <p
                          style={{
                            fontSize: "11px",
                            color: "#555",
                            letterSpacing: "0.5px",
                          }}
                        >
                          {COMPANY.address.toUpperCase()}
                        </p>
                      </div>

                      <div
                        style={{
                          textAlign: "right",
                          marginBottom: "4px",
                          fontSize: "14px",
                          lineHeight: CERTIFICATE_LINE_HEIGHT,
                        }}
                      >
                        <strong>Ref No:</strong> {certificate.ref_no}
                      </div>
                      <div
                        style={{
                          textAlign: "right",
                          marginBottom: "8px",
                          fontSize: "14px",
                          lineHeight: CERTIFICATE_LINE_HEIGHT,
                        }}
                      >
                        <strong>Issue Date:</strong>{" "}
                        {formatDateMDY(certificate.issue_date)}
                      </div>

                      <div
                        style={{
                          borderTop: "2px solid #333",
                          marginBottom: "10px",
                        }}
                      />

                      <div
                        style={{
                          lineHeight: CERTIFICATE_LINE_HEIGHT,
                          fontSize: "14px",
                        }}
                      >
                        <p style={{ margin: 0 }}>
                          <strong>Name:</strong> {certificate.full_name}
                          &nbsp;&nbsp;&nbsp;
                          <strong>Date of Birth:</strong>{" "}
                          {formatDate(certificate.date_of_birth)}
                          &nbsp;&nbsp;&nbsp;
                          <strong>Passport No:</strong>{" "}
                          {certificate.passport_no || "............"}
                          &nbsp;&nbsp;&nbsp;
                          <strong>NID Card No:</strong>{" "}
                          {certificate.nid_card_no || "............"}
                          &nbsp;&nbsp; This is to certify that
                        </p>
                        <p style={{ marginTop: "6px", marginBottom: 0 }}>
                          <strong>{certificate.full_name}</strong>, Son/Daughter
                          of{" "}
                          <strong>
                            {certificate.father_name || "............"}
                          </strong>{" "}
                          &amp;{" "}
                          <strong>
                            {certificate.mother_name || "............"}
                          </strong>
                          , Address: Village:{" "}
                          <strong>
                            {certificate.village || "............"}
                          </strong>
                          , Post Office:{" "}
                          <strong>
                            {certificate.post_office || "............"}
                          </strong>
                          , Upazila:{" "}
                          <strong>
                            {certificate.upazila || "............"}
                          </strong>
                          , District:{" "}
                          <strong>
                            {certificate.district || "............"}
                          </strong>
                          . I know him/her personally. He/She is very skilled in{" "}
                          <strong>
                            {certificate.skill_title || "Agriculture"}
                          </strong>
                          . He/She worked efficiently from{" "}
                          <strong>
                            {certificate.start_date
                              ? formatDateMDY(certificate.start_date)
                              : "............"}
                          </strong>{" "}
                          to{" "}
                          <strong>
                            {certificate.end_date
                              ? formatDateMDY(certificate.end_date)
                              : "............"}
                          </strong>
                          .
                        </p>
                      </div>

                      <p
                        style={{
                          textAlign: "center",
                          marginTop: "20px",
                          marginBottom: "12px",
                          fontSize: "15px",
                          fontWeight: "bold",
                          lineHeight: CERTIFICATE_LINE_HEIGHT,
                        }}
                      >
                        {CERTIFICATE_WISHES_LINE}
                      </p>

                      <div
                        style={{
                          borderTop: "1px solid #aaa",
                          marginTop: "8px",
                          marginBottom: "10px",
                        }}
                      />

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: "12px",
                          fontWeight: "bold",
                          letterSpacing: "2px",
                        }}
                      >
                        <div>
                          DATE
                          <br />
                          <span
                            style={{ fontWeight: "normal", fontSize: "11px" }}
                          >
                            {formatDateMDY(certificate.issue_date)}
                          </span>
                        </div>
                        <div style={{ textAlign: "center" }}>
                          REF NO
                          <br />
                          <span
                            style={{
                              fontWeight: "normal",
                              fontSize: "11px",
                              fontFamily: "monospace",
                            }}
                          >
                            {certificate.ref_no}
                          </span>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          AUTHORISED SIGNATURE
                          <br />
                          <span
                            style={{ fontWeight: "normal", fontSize: "11px" }}
                          >
                            _________________________
                          </span>
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        height: "4px",
                        background:
                          "linear-gradient(90deg,#c9a227,#f5d76e,#c9a227)",
                      }}
                    />
                  </>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
