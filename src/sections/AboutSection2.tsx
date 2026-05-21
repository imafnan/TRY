"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import IMG2 from '../../public/About2img.jpeg'

export function AboutSection2() {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Left content */}
       <motion.div
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="order-2 text-center md:order-1 md:text-left"
      >
        <h2 className="mb-4 text-2xl font-bold text-gray-900 md:text-3xl">
          Your Trusted Property Partner
        </h2>

        <p className="mb-6 text-gray-600 leading-relaxed md:text-[25px]">
          Shwapnopuri Properties and Developments works with honesty, care, and
          professionalism to provide reliable property solutions. We focus on quality
          development, clear communication, and customer satisfaction to help clients
          make confident real estate decisions.
        </p>

       <Link
          href="https://wa.me/8801342642413"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block w-full rounded-[5px] bg-[#0d2353] px-10 py-3 text-center font-semibold text-white shadow-md transition-all duration-200 hover:bg-[#1a3a6e] sm:w-auto md:px-8 md:py-3"
        >
          Contract Now
        </Link>

      </motion.div>


          {/* Right image */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="order-1 md:order-2 rounded-xl overflow-hidden shadow-lg"
          >
            <Image
              src={IMG2}
              alt="Property partner"
              width={600}
              height={420}
              className="w-full h-[401px] md:h-[588px] object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
