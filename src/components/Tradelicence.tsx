import React from "react";
import { ShieldCheck } from "lucide-react";

const Tradelicence = () => {
  return (
    <section className=" flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">


        {/* Content */}
        <div className="p-6 md:p-5 space-y-3">
            <h1 className="text-center font-bold">Trade Licence</h1>
          
          {/* Licence No */}
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span className="text-gray-500 font-medium text-sm md:text-base">
              Licence No
            </span>

            <span className="text-[#0d2353] font-bold text-lg md:text-xl break-all">
              00035-04
            </span>
          </div>

          {/* Licence ID */}
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span className="text-gray-500 font-medium text-sm md:text-base">
              Licence ID No
            </span>

            <span className="text-[#0d2353] font-bold text-lg md:text-xl break-all">
              05-038-00035-04
            </span>
          </div>
        </div>

      
      </div>
    </section>
  );
};

export default Tradelicence;