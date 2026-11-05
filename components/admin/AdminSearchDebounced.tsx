"use client";

import { useEffect, useState } from "react";
import { AdminSearch } from "./ui";

/**
 * Champ de recherche qui n'appelle `onChange` qu'après une pause de frappe.
 *
 * L'état vit ici et se réinitialise via `key` côté parent (par exemple
 * `key={query}`) quand le serveur renvoie une nouvelle valeur : pas de
 * synchronisation prop → state dans un effet.
 */
export default function AdminSearchDebounced({
  initialValue,
  onChange,
  placeholder,
  delay = 350,
}: {
  initialValue: string;
  onChange: (value: string) => void;
  placeholder?: string;
  delay?: number;
}) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (value === initialValue) return;
    const timer = setTimeout(() => onChange(value), delay);
    return () => clearTimeout(timer);
  }, [value, initialValue, delay, onChange]);

  return (
    <AdminSearch value={value} onChange={setValue} placeholder={placeholder} />
  );
}
