"use client";

import type { ReactNode } from "react";
import { useQuoteModal } from "./QuoteModalProvider";

export default function QuoteButton({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { openQuote } = useQuoteModal();

  return (
    <button type="button" onClick={openQuote} className={className}>
      {children}
    </button>
  );
}
