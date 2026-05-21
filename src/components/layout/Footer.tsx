"use client";
import Link from "next/link";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { COMPANY } from "@/constants";

import logo from '../../../public/lo-sp.png';
import Image from "next/image";


export function Footer() {
  return (
    <footer className="bg-[#0d2353] text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <Image src={logo} alt="Company Logo"  className="h-[50px] w-[50px] md:h-[70px] md:w-[70px]" />
          </div>

          {/* Find More + Social */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-4">
              <span className="text-lg font-bold text-white">Find More</span>
              <div className="flex items-center gap-3">
                <Link
                  href={COMPANY.facebook}
                  target="_blank"
                  className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <Facebook size={16} />
                </Link>
                <Link
                  href={COMPANY.instagram}
                  target="_blank"
                  className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <Instagram size={16} />
                </Link>
                <Link
                  href={COMPANY.youtube}
                  target="_blank"
                  className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <Youtube size={16} />
                </Link>
              </div>
            </div>
            <p className="text-white/50 text-xs text-center">
              © {new Date().getFullYear()} {COMPANY.shortName}. All rights reserved.
            </p>
          </div>

          {/* Contact */}
          <div className="text-center md:text-right text-sm text-white/70 space-y-1">
            <p>{COMPANY.phone}</p>
            <p>{COMPANY.email}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
