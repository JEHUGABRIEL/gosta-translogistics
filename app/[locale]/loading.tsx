"use client";

import { useTranslations } from "next-intl";
import TopProgressBar from "@/components/TopProgressBar";

const keyframes = `
  @keyframes spin-pulse-outer {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.3); opacity: 0.5; }
  }
  @keyframes spin-pulse-inner {
    0%, 100% { transform: scale(1.3); opacity: 0.5; }
    50% { transform: scale(1); opacity: 1; }
  }
  @keyframes spin-pulse-dot {
    0%, 100% { transform: scale(0.7); opacity: 0.6; }
    50% { transform: scale(1.3); opacity: 1; }
  }
`;

export default function Loading() {
  const t = useTranslations("loading");

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: keyframes }} />
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[var(--sand)]">
        {/* Progress bar */}
        <TopProgressBar />

        {/* Pulsating spinner */}
        <div className="relative h-20 w-20">
          {/* Outer ring */}
          <div
            className="absolute inset-0 rounded-full border-[3px] border-[var(--red)]"
            style={{ animation: "spin-pulse-outer 1s ease-in-out infinite" }}
          />
          {/* Inner ring */}
          <div
            className="absolute inset-3 rounded-full border-[3px] border-[var(--amber)]"
            style={{ animation: "spin-pulse-inner 1s ease-in-out infinite" }}
          />
          {/* Center dot */}
          <div
            className="absolute inset-0 m-auto h-3 w-3 rounded-full bg-[var(--red)]"
            style={{ animation: "spin-pulse-dot 1s ease-in-out infinite" }}
          />
        </div>

        {/* Brand text + libellé de ce qui charge */}
        <p className="mt-8 font-display text-lg font-bold tracking-wide text-[var(--navy-deep)]">
          GOSTA TRANS
        </p>
        <p
          role="status"
          className="mt-2 font-mono text-[12.5px] uppercase tracking-[0.2em] text-[var(--steel)]"
        >
          {t("page")}
        </p>
      </div>
    </>
  );
}
