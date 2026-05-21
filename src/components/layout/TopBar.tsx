"use client";

import { Phone, Mail } from "lucide-react";
import { COMPANY } from "@/constants";

export function TopBar() {
  return (
    <div className="bg-[#0d2353] text-white py-2 px-4">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-2 lg:gap-0 text-xs sm:text-sm">
        
        {/* Left Side */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-5 text-center">
          
          {/* Phone */}
          <a
            href={`tel:${COMPANY.phone}`}
            className="flex items-center gap-2 hover:text-blue-300 transition-colors font-medium break-all"
          >
            <Phone size={14} className="shrink-0" />
            <span>{COMPANY.phone}</span>
          </a>

          {/* Email */}
          <a
            href={`mailto:${COMPANY.email}`}
            className="flex items-center gap-2 hover:text-blue-300 transition-colors break-all"
          >
            <Mail size={14} className="shrink-0" />
            <span>{COMPANY.email}</span>
          </a>
        </div>

        {/* Licence */}
        <div className="text-center lg:text-right font-medium text-gray-200">
          Licence No :{" "}
          <span className="text-white font-semibold">
            00035-04
          </span>
        </div>
      </div>
    </div>
  );
}