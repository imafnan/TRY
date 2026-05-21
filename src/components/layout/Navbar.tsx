"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_LINKS } from "@/constants";
import Image from "next/image";
import Logo from '../../../public/lo-sp.png'

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-[#0d2353] mt-0.5 shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
         <Image src={Logo} alt="Logo" width={80} height={80} className="rounded-full" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white hover:text-[#c7c7c7] font-medium text-sm transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/certificates"
            className="border border-[#ffffff] bg-white text-[#0d2353] px-5 py-2 rounded text-sm font-semibold hover:bg-[#0d2353] hover:text-white transition-all duration-200"
          >
            Find Certificate
          </Link>
          <button
            className="md:hidden text-[#ffffff]"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 py-3 flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-black hover:text-[#c7c7c7] font-medium text-sm py-2 border-b border-gray-50"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
