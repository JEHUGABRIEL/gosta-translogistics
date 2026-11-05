"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Dernière ligne d'un titre animée « machine à écrire » : les lettres
 * apparaissent une par une, puis repartent une par une en boucle.
 *
 * Le texte complet reste présent, invisible, sous la ligne animée : la hauteur
 * et les retours à la ligne du titre ne bougent donc pas pendant la frappe.
 * `prefers-reduced-motion` : le texte s'affiche d'un bloc, sans curseur.
 */
export default function TypewriterLine({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  // On garde le texte associé au compteur : si le texte change sans
  // remontage, l'affichage repart de zéro sans setState dans l'effet.
  const [typed, setTyped] = useState({ text, value: "" });
  const visible = typed.text === text ? typed.value : "";

  useEffect(() => {
    if (reduceMotion) return;

    const TYPE_MS = 55; // frappe
    const DELETE_MS = 30; // effacement
    const HOLD_MS = 1500; // ligne complète affichée
    const RESTART_MS = 400; // ligne vide avant de retaper

    let count = 0;
    let deleting = false;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      if (cancelled) return;

      if (!deleting) {
        count += 1;
        setTyped({ text, value: text.slice(0, count) });
        if (count >= text.length) {
          deleting = true;
          timer = setTimeout(tick, HOLD_MS);
        } else {
          timer = setTimeout(tick, TYPE_MS);
        }
        return;
      }

      count -= 1;
      setTyped({ text, value: text.slice(0, Math.max(count, 0)) });
      if (count <= 0) {
        deleting = false;
        timer = setTimeout(tick, RESTART_MS);
      } else {
        timer = setTimeout(tick, DELETE_MS);
      }
    };

    timer = setTimeout(tick, TYPE_MS);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [text, reduceMotion]);

  if (reduceMotion) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={`relative inline-block ${className}`}>
      {/* Réserve la place du texte complet : aucune ligne ne bouge */}
      <span aria-hidden="true" className="invisible">
        {text}
      </span>
      <span aria-hidden="true" className="absolute inset-0">
        {visible}
        <span className="ml-1 inline-block h-[0.72em] w-[3px] translate-y-[0.02em] animate-pulse bg-[var(--amber)]" />
      </span>
      {/* Le texte complet reste lisible par les lecteurs d'écran */}
      <span className="sr-only">{text}</span>
    </span>
  );
}
