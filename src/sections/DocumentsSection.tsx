"use client";
import { motion } from "framer-motion";
import Image from "next/image";

import Doc1 from "../../public/doc1.png";
import Doc2 from "../../public/doc2.png";
import logo from '../../public/lo-sp.png';

export function DocumentsSection() {
  const documents = [Doc1, Doc2];

  return (
    <section id="documents" className="bg-white">
      {/* Navy header bar */}
      <div className="bg-[#0d2353] py-1 px-2 md:py-4 md:px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">

          <Image src={logo} alt="Company Logo"  className="h-[50px] w-[50px] md:h-[70px] md:w-[70px]" />

          <h2 className="text-white text-xl md:text-2xl font-semibold tracking-wide">
            Our Company Document
          </h2>
        </div>
      </div>

      {/* Document cards */}
      <div className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {documents.map((doc, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="relative aspect-[3/4] overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <Image
                  src={doc}
                  alt={`Document ${i + 1}`}
                  fill
                  className="object-cover"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}