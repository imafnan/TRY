"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { COMPANY } from "@/constants";
import { HERO_DESCRIPTION } from "@/constants/hero";
import { siteSettingsService } from "@/services/siteSettingsService";

const FALLBACK_HERO_IMAGE = "/Heroimg.jpeg";

export function HeroSection() {
  const { data } = useQuery({
    queryKey: ["hero-banners"],
    queryFn: siteSettingsService.getHeroBanners,
    staleTime: 60 * 1000,
  });

  const bgUrl = data?.banners?.[0]?.url ?? FALLBACK_HERO_IMAGE;

  return (
    <section className="relative flex min-h-[260px] items-center justify-center overflow-hidden bg-[#0d2353] px-4 py-10 text-white sm:min-h-[420px] md:min-h-[560px] lg:min-h-[640px]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628]/95 via-[#0d2353]/85 to-[#1a3a6e]/90" />

      <div
        className="absolute inset-0 bg-cover bg-center opacity-35 md:opacity-30"
        style={{
          backgroundImage: `url("${bgUrl}")`,
        }}
      />

      <motion.div
        className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center text-center"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="max-w-4xl text-[clamp(22px,5vw,40px)] font-bold leading-tight">
          {COMPANY.name}
        </h1>

        <div className="mt-3 flex max-w-3xl items-center justify-center gap-1.5 text-[12px] leading-snug text-blue-100 sm:text-sm md:text-[15px]">
          <span>{COMPANY.address}</span>
        </div>

        <div className="mt-6 w-full max-w-[92vw] border border-white/35 bg-white/5 px-4 py-4  sm:max-w-3xl sm:px-6 sm:py-5 md:max-w-4xl md:px-10 md:py-6">
          <p className="text-[12px] leading-relaxed text-white/90 sm:text-sm md:text-xl md:leading-relaxed">
            {HERO_DESCRIPTION}
          </p>
        </div>
      </motion.div>
    </section>
  );
}
