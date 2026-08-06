"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ImageCarousel({
  images,
  alt,
  interval = 4000,
}: {
  images: string[];
  alt: string;
  interval?: number;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // Fait défiler automatiquement les photos, une à une
  useEffect(() => {
    if (images.length < 2 || paused) return;
    const t = setInterval(
      () => setIndex((i) => (i + 1) % images.length),
      interval
    );
    return () => clearInterval(t);
  }, [images.length, paused, interval]);

  const go = (dir: 1 | -1) =>
    setIndex((i) => (i + dir + images.length) % images.length);

  return (
    <div
      className="relative h-64 group/carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src={images[index]}
            alt={alt}
            width={768}
            height={1024}
            loading="eager"
            className="h-full w-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* flèches */}
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Photo précédente"
            className="absolute left-2 top-1/2 -translate-y-1/2 h-9 w-9 flex items-center justify-center bg-black/40 hover:bg-[var(--red)] text-white backdrop-blur transition-colors opacity-100 md:opacity-0 md:group-hover/carousel:opacity-100 md:focus:opacity-100 cursor-pointer"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Photo suivante"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 flex items-center justify-center bg-black/40 hover:bg-[var(--red)] text-white backdrop-blur transition-colors opacity-100 md:opacity-0 md:group-hover/carousel:opacity-100 md:focus:opacity-100 cursor-pointer"
          >
            <ChevronRight size={18} />
          </button>
        </>
      )}

      {/* points indicateurs */}
      {images.length > 1 && (
        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Photo ${i + 1}`}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                i === index
                  ? "w-5 bg-[var(--red)]"
                  : "w-1.5 bg-white/60 hover:bg-white"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
