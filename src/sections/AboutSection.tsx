"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import IMG1 from '../../public/About1img.jpeg'


export function AboutSection() {
  return (
    <section id="about" className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Left image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="rounded-xl overflow-hidden shadow-lg"
          >
            <Image
              src={IMG1}
              alt="Construction site"
             
              className="w-full h-[401px] md:h-[588px] object-cover"
            />
          </motion.div>

          {/* Right content */}
     {/* Right content */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-center md:text-left"
        >
          <h2 className="mb-4 text-2xl font-bold text-gray-900 md:text-3xl">
            Building Dreams into Reality
          </h2>

          <p className="mb-6 leading-relaxed text-gray-600 md:text-[25px]">
            Our journey began on 05/09/2024 with a vision of quality, innovation, and trust. We are committed to creating modern, durable, and inspiring spaces while turning dreams into reality through excellent craftsmanship and customer satisfaction.
            <br />
            <br />
            Building Trust, Creating Your Dream Destination.
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

        </div>
      </div>
    </section>
  );
}
