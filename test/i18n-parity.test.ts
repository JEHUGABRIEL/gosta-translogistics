import { describe, expect, it } from "vitest";
import fr from "@/messages/fr.json";
import en from "@/messages/en.json";
import { getServices } from "@/lib/services";

/**
 * Le site est bilingue : les deux arbres de messages et les deux catalogues de
 * prestations sont maintenus à la main. Ces tests sont le garde-fou — une clé
 * ou un slug oublié d'un côté passerait sinon inaperçu jusqu'à l'exécution.
 */

function keyPaths(value: unknown, prefix = ""): string[] {
  if (value === null || typeof value !== "object") return [prefix];
  if (Array.isArray(value)) {
    // Un tableau de messages (FAQ, témoignages…) doit avoir la même longueur :
    // on expose l'index dans le chemin.
    return value.flatMap((item, i) => keyPaths(item, `${prefix}[${i}]`));
  }
  return Object.entries(value as Record<string, unknown>).flatMap(([key, child]) =>
    keyPaths(child, prefix ? `${prefix}.${key}` : key)
  );
}

describe("parité des messages FR / EN", () => {
  it("expose exactement les mêmes clés dans les deux langues", () => {
    const frKeys = keyPaths(fr).sort();
    const enKeys = keyPaths(en).sort();

    expect(enKeys.filter((key) => !frKeys.includes(key))).toEqual([]);
    expect(frKeys.filter((key) => !enKeys.includes(key))).toEqual([]);
  });

  it("n'a aucun message vide", () => {
    const empty = (value: unknown, prefix = ""): string[] => {
      if (typeof value === "string") return value.trim() === "" ? [prefix] : [];
      if (value === null || typeof value !== "object") return [];
      if (Array.isArray(value)) return value.flatMap((item, i) => empty(item, `${prefix}[${i}]`));
      return Object.entries(value as Record<string, unknown>).flatMap(([key, child]) =>
        empty(child, prefix ? `${prefix}.${key}` : key)
      );
    };

    expect(empty(fr)).toEqual([]);
    expect(empty(en)).toEqual([]);
  });
});

describe("parité du catalogue de prestations FR / EN", () => {
  const frCatalog = getServices("fr");
  const enCatalog = getServices("en");

  it("expose les mêmes pôles, dans le même ordre", () => {
    expect(enCatalog.poles.map((pole) => pole.id)).toEqual(
      frCatalog.poles.map((pole) => pole.id)
    );
  });

  it("expose les mêmes slugs de prestations, répartis dans les mêmes pôles", () => {
    const shape = (poles: typeof frCatalog.poles, byPole: typeof frCatalog.byPole) =>
      poles.map((pole) => ({
        pole: pole.id,
        slugs: byPole[pole.id].map((service) => service.slug),
      }));

    expect(shape(enCatalog.poles, enCatalog.byPole)).toEqual(
      shape(frCatalog.poles, frCatalog.byPole)
    );
  });

  it("garde un slug unique dans tout le catalogue", () => {
    expect(frCatalog.all.length).toBe(new Set(frCatalog.all.map((s) => s.slug)).size);
  });
});
