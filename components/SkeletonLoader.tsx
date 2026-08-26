"use client";

import { motion } from "framer-motion";

interface SkeletonLoaderProps {
  variant?: "text" | "heading" | "image" | "card";
  count?: number;
  className?: string;
}

function ShimmerBlock({ className }: { className: string }) {
  return (
    <div className={`relative overflow-hidden rounded bg-[var(--sand-deep)] ${className}`}>
      <motion.div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent"
        animate={{ x: ["-100%", "100%"] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
      />
    </div>
  );
}

export default function SkeletonLoader({
  variant = "text",
  count = 1,
  className = "",
}: SkeletonLoaderProps) {
  const variants = {
    text: <ShimmerBlock className="h-4 w-full" />,
    heading: <ShimmerBlock className="h-8 w-2/3" />,
    image: <ShimmerBlock className="h-48 w-full" />,
    card: (
      <div className="space-y-3">
        <ShimmerBlock className="h-48 w-full" />
        <ShimmerBlock className="h-4 w-full" />
        <ShimmerBlock className="h-4 w-3/4" />
      </div>
    ),
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>{variants[variant]}</div>
      ))}
    </div>
  );
}
