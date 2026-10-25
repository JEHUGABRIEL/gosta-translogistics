"use client";

import { useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/**
 * Fournit un QueryClient par arbre React (jamais un singleton module : il
 * fuirait entre requêtes côté serveur). Les données sont stables et mises en
 * cache longuement ; le refetch au focus est désactivé pour ne pas recharger
 * un catalogue statique à chaque retour d'onglet.
 */
export default function QueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            gcTime: 30 * 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
