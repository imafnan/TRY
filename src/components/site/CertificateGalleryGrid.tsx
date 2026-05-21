"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { siteSettingsService } from "@/services/siteSettingsService";
import { cn } from "@/utils";

const FALLBACK_SHOWCASE = [
  {
    key: "fallback-1",
    src: "/About1img.jpeg",
    alt: "Residential development by Swapnopuri Properties",
  },
  {
    key: "fallback-2",
    src: "/About2img.jpeg",
    alt: "Modern living spaces and quality construction",
  },
  {
    key: "fallback-3",
    src: "/Heroimg.jpeg",
    alt: "Swapnopuri Properties — trusted real estate in Bangladesh",
  },
] as const;

export function CertificateGalleryGrid({
  className,
}: {
  className?: string;
}) {
  const { data } = useQuery({
    queryKey: ["site-gallery"],
    queryFn: siteSettingsService.getGallery,
    staleTime: 60 * 1000,
  });

  const fromApi =
    data?.gallery
      ?.filter((g) => typeof g.url === "string" && g.url.length > 0)
      .map((g) => ({
        key: g.id,
        src: g.url,
        alt: "Swapnopuri Properties gallery photo",
      })) ?? [];

  const items =
    fromApi.length > 0 ? fromApi : [...FALLBACK_SHOWCASE];

  return (
    <div
      className={cn("mt-8 sm:mt-10", className)}
      aria-label="Project highlights"
    >
      <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
        {items.map((item, i) => (
          <li key={item.key} className="min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.45,
                delay: Math.min(i, 8) * 0.06,
              }}
              className="group relative h-[250px] sm:h-[280px] md:h-[320px] lg:h-[340px] w-full overflow-hidden rounded-2xl border border-gray-200/80 bg-gray-100 shadow-sm ring-1 ring-black/5"
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority={i === 0}
              />

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-70 transition-opacity group-hover:opacity-90" />
            </motion.div>
          </li>
        ))}
      </ul>
    </div>
  );
}