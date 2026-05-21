"use client";
import { forwardRef, useEffect, useState } from "react";
import type { Certificate } from "@/types";
import { formatDate } from "@/utils";

export const CERT_WIDTH_PX = 794;
/** Matches public/Certification-Final-Blank.jpg.jpeg (8192×5734). */
export const CERT_HEIGHT_PX = Math.round((CERT_WIDTH_PX * 5734) / 8192);

/** Default blank certificate artwork in /public. */
export const CERTIFICATE_TEMPLATE_PATH = "/Certification-Final-Blank.jpg.jpeg";
/** Bust browser cache when the JPG in /public is replaced. */
const CERTIFICATE_TEMPLATE_CACHE_KEY = "2026-05-19";
export const CERTIFICATE_TEMPLATE_URL = `${CERTIFICATE_TEMPLATE_PATH}?v=${CERTIFICATE_TEMPLATE_CACHE_KEY}`;

export const CERTIFICATE_WISHES_LINE =
  "We extend our best wishes for their future success.";

/** Shared line-height for ref, issue date, and body overlay text. */
export const CERTIFICATE_LINE_HEIGHT = 2;

/** Pixels on the 794px-wide design → fluid length so overlay stays aligned on narrow screens. */
function certPx(px: number): string {
  return `calc(100cqw * ${px} / ${CERT_WIDTH_PX})`;
}

const ENV_TEMPLATE =
  process.env.NEXT_PUBLIC_CERTIFICATE_TEMPLATE_URL?.trim() || "";
const PUBLIC_TEMPLATE_CANDIDATES = [CERTIFICATE_TEMPLATE_URL] as const;

/** Overlay positions tuned to Certification-Final-Blank.jpg.jpeg artwork. */
const TEMPLATE_TEXT = {
  refNoBlock: {
    top: "35.3%",
    right: "5%",
    left: "50%",
    textAlign: "right" as const,
    fontSize: certPx(11),
    // lineHeight: CERTIFICATE_LINE_HEIGHT,
  },
  issueDateBlock: {
    top: "37.3%",
    right: "5%",
    left: "50%",
    textAlign: "right" as const,
    fontSize: certPx(11),
    lineHeight: CERTIFICATE_LINE_HEIGHT,
  },
  bodyBlock: {
    top: "46%",
    left: "5%",
    right: "5%",
    fontSize: certPx(11.5),
    lineHeight: CERTIFICATE_LINE_HEIGHT,
    textAlign: "left" as const,
  },
  /**
   * Centered above signature when the template art has no wishes line.
   * Hidden when using the default JPG (wishes are printed on the template).
   */
  wishesAboveSignature: {
    bottom: "22.5%",
    left: "14%",
    right: "14%",
    textAlign: "center" as const,
    fontSize: certPx(11.5),
    fontWeight: 700,
    lineHeight: CERTIFICATE_LINE_HEIGHT,
  },
} as const;

const BODY_PARAGRAPH_GAP = certPx(3);

/**
 * html2canvas (esp. mobile) often mis-resolves `cqw` inside its iframe.
 * Replace design-relative sizes with px from the actual raster width.
 */
function patchCertificateTextRasterStyles(
  root: HTMLElement,
  containerWidthPx: number,
) {
  const w =
    containerWidthPx > 0 ? containerWidthPx : CERT_WIDTH_PX;
  const px = (designPx: number) => `${(designPx * w) / CERT_WIDTH_PX}px`;

  root.querySelectorAll<HTMLElement>("[data-cert-fs]").forEach((el) => {
    const n = Number(el.dataset.certFs);
    if (!Number.isFinite(n)) return;
    el.style.fontSize = px(n);
  });

  root.querySelectorAll<HTMLElement>("[data-cert-mt]").forEach((el) => {
    const n = Number(el.dataset.certMt);
    if (!Number.isFinite(n)) return;
    el.style.marginTop = px(n);
  });
}

export function expToWords(n: number): string {
  const words = [
    "Zero",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
  ];
  return n >= 0 && n <= 10 ? words[n] : String(n);
}

function missing(val?: string | null): string {
  const t = (val || "").trim();
  return t.length > 0 ? t : "\u2014";
}

/** Format a date string as DD/MM/YYYY. */
function formatDateDMY(dateStr?: string | null): string {
  if (!dateStr) return "............";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export function useResolvedTemplateUrl(override?: string | null): {
  url: string | null;
  ready: boolean;
} {
  const [publicDefaultUrl, setPublicDefaultUrl] = useState<string | null>(null);
  const [probeDone, setProbeDone] = useState(false);

  useEffect(() => {
    if (override || ENV_TEMPLATE) {
      setPublicDefaultUrl(null);
      setProbeDone(true);
      return;
    }
    setProbeDone(false);
    setPublicDefaultUrl(null);
    let cancelled = false;
    let index = 0;

    const tryNext = () => {
      if (cancelled) return;
      if (index >= PUBLIC_TEMPLATE_CANDIDATES.length) {
        setPublicDefaultUrl(null);
        setProbeDone(true);
        return;
      }
      const src = PUBLIC_TEMPLATE_CANDIDATES[index];
      const img = new Image();
      img.onload = () => {
        if (!cancelled) {
          setPublicDefaultUrl(src);
          setProbeDone(true);
        }
      };
      img.onerror = () => {
        index += 1;
        tryNext();
      };
      img.src = src;
    };

    tryNext();
    return () => {
      cancelled = true;
    };
  }, [override]);

  const url = (override || ENV_TEMPLATE || publicDefaultUrl) as string | null;
  const ready = Boolean(override || ENV_TEMPLATE) || probeDone;
  return { url: url || null, ready };
}

/** Default JPG already prints the wishes line on the artwork. */
function templateHasPrintedWishes(imageUrl: string): boolean {
  const base = CERTIFICATE_TEMPLATE_PATH.replace(/^\//, "");
  return imageUrl.includes(base);
}

function CertificateTextOverTemplate({
  certificate,
  imageUrl,
}: {
  certificate: Certificate;
  imageUrl: string;
}) {
  const font = "var(--font-poppins), Poppins, sans-serif";
  const showWishesOverlay = !templateHasPrintedWishes(imageUrl);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        fontFamily: font,
      }}
    >
      <div
        data-cert-fs={11}
        style={{
          position: "absolute",
          ...TEMPLATE_TEXT.refNoBlock,
          color: "#111",
        }}
      >
        <strong>Ref No:</strong> {certificate.ref_no}
      </div>
      <div
        data-cert-fs={11}
        style={{
          position: "absolute",
          ...TEMPLATE_TEXT.issueDateBlock,
          color: "#111",
        }}
      >
        <strong>Issue Date:</strong> {formatDateDMY(certificate.issue_date)}
      </div>

      <div
        data-cert-fs={11.5}
        style={{
          position: "absolute",
          ...TEMPLATE_TEXT.bodyBlock,
          color: "#111",
        }}
      >
        <p style={{ margin: 0 }}>
          <strong>Name:</strong> {certificate.full_name}
          &nbsp;&nbsp;
          <strong>Date of Birth:</strong>{" "}
          {formatDateDMY(certificate.date_of_birth)}
          &nbsp;&nbsp;
          <strong>Passport No:</strong> {missing(certificate.passport_no)}
          &nbsp;&nbsp;
          <strong>NID Card No:</strong> {missing(certificate.nid_card_no)}
          &nbsp;&nbsp; This is to certify that
        </p>
        <p
          data-cert-mt={3}
          style={{ marginTop: BODY_PARAGRAPH_GAP, marginBottom: 0 }}
        >
          <strong>{certificate.full_name}</strong>, Son/Daughter of{" "}
          <strong>{missing(certificate.father_name)}</strong> &amp;{" "}
          <strong>{missing(certificate.mother_name)}</strong>, Address: Village:{" "}
          <strong>{missing(certificate.village)}</strong>, Post Office:{" "}
          <strong>{missing(certificate.post_office)}</strong>, Upazila:{" "}
          <strong>{missing(certificate.upazila)}</strong>, District:{" "}
          <strong>{missing(certificate.district)}</strong>. I know him/her
          personally. He/She is very skilled in{" "}
          <strong>{missing(certificate.skill_title)}</strong>. He/She worked
          efficiently from{" "}
          <strong>{formatDateDMY(certificate.start_date)}</strong> to{" "}
          <strong>{formatDateDMY(certificate.end_date)}</strong>.
        </p>
      </div>

      {showWishesOverlay && (
        <p
          data-cert-fs={11.5}
          style={{
            position: "absolute",
            ...TEMPLATE_TEXT.wishesAboveSignature,
            margin: 0,
            color: "#111",
          }}
        >
          {CERTIFICATE_WISHES_LINE}
        </p>
      )}
    </div>
  );
}

export const CertificateJpgLayer = forwardRef<
  HTMLDivElement,
  { certificate: Certificate; imageUrl: string }
>(function CertificateJpgLayer({ certificate, imageUrl }, ref) {
  return (
    <div
      ref={ref}
      className="certificate-jpg-root w-full max-w-full"
      style={{
        width: "100%",
        maxWidth: `${CERT_WIDTH_PX}px`,
        aspectRatio: `${CERT_WIDTH_PX} / ${CERT_HEIGHT_PX}`,
        height: "auto",
        position: "relative",
        margin: "0 auto",
        backgroundColor: "#fff",
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <CertificateTextOverTemplate
        certificate={certificate}
        imageUrl={imageUrl}
      />
    </div>
  );
});

/** CSS px at 96dpi → mm (jsPDF units). */
const CSS_PX_TO_MM = 25.4 / 96;
const PDF_CAPTURE_SCALE = 2;

export async function saveCertificatePdf(
  root: HTMLElement,
  refNo: string,
): Promise<void> {
  const snapshot = {
    width: root.style.width,
    height: root.style.height,
    maxWidth: root.style.maxWidth,
    aspectRatio: root.style.aspectRatio,
    flexShrink: root.style.flexShrink,
    minWidth: root.style.minWidth,
    overflow: root.style.overflow,
  };
  root.style.width = `${CERT_WIDTH_PX}px`;
  root.style.height = `${CERT_HEIGHT_PX}px`;
  root.style.maxWidth = "none";
  root.style.aspectRatio = "unset";
  /** Without this, a narrow flex parent can shrink the node below 794px and break the PDF. */
  root.style.flexShrink = "0";
  root.style.minWidth = `${CERT_WIDTH_PX}px`;
  root.style.overflow = "visible";

  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import("html2canvas"),
    import("jspdf"),
  ]);

  try {
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
    );

    const canvas = await html2canvas(root, {
      scale: PDF_CAPTURE_SCALE,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      scrollX: 0,
      scrollY: 0,
      windowWidth: CERT_WIDTH_PX + 80,
      windowHeight: CERT_HEIGHT_PX + 80,
      onclone: (clonedDoc: Document, clonedRoot: HTMLElement) => {
        void clonedDoc;
        const w =
          clonedRoot.offsetWidth ||
          clonedRoot.getBoundingClientRect().width ||
          CERT_WIDTH_PX;
        patchCertificateTextRasterStyles(clonedRoot, w);
      },
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.98);
    const cssW = canvas.width / PDF_CAPTURE_SCALE;
    const cssH = canvas.height / PDF_CAPTURE_SCALE;
    const pdfWmm = cssW * CSS_PX_TO_MM;
    const pdfHmm = cssH * CSS_PX_TO_MM;

    const pdf = new jsPDF({
      unit: "mm",
      format: [pdfWmm, pdfHmm],
      orientation: pdfWmm >= pdfHmm ? "landscape" : "portrait",
      compress: true,
    });

    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    pdf.addImage(imgData, "JPEG", 0, 0, pageW, pageH, undefined, "FAST");
    pdf.save(`certificate-${refNo}.pdf`);
  } finally {
    root.style.width = snapshot.width;
    root.style.height = snapshot.height;
    root.style.maxWidth = snapshot.maxWidth;
    root.style.aspectRatio = snapshot.aspectRatio;
    root.style.flexShrink = snapshot.flexShrink;
    root.style.minWidth = snapshot.minWidth;
    root.style.overflow = snapshot.overflow;
  }
}
