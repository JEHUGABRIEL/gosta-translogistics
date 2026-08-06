"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import ContactModal from "./ContactModal";

type QuoteModalContextValue = {
  openQuote: () => void;
};

const QuoteModalContext = createContext<QuoteModalContextValue>({
  openQuote: () => {},
});

export function useQuoteModal() {
  return useContext(QuoteModalContext);
}

export function QuoteModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const openQuote = useCallback(() => setOpen(true), []);
  const closeQuote = useCallback(() => setOpen(false), []);

  return (
    <QuoteModalContext.Provider value={{ openQuote }}>
      {children}
      <ContactModal open={open} onClose={closeQuote} />
    </QuoteModalContext.Provider>
  );
}
