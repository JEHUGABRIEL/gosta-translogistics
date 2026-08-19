export const SOCIAL_LINKS = {
  facebook:
    "https://www.facebook.com/search/top?q=Gosta%20Trans%20%26%20Logistique%20et%20BTP",
  instagram: "https://www.instagram.com/Gosta_trans_Logistique_et_BTP",
  whatsapp: "https://wa.me/23675200313",
  // Siège social (SICA II) — utilisé comme lien Maps par défaut.
  googleMaps:
    "https://www.google.com/maps/search/?api=1&query=SICA+II+2e+Arrondissement+Bangui+RCA",
} as const;

// Les 3 sites de l'entreprise à Bangui : le siège social (SICA II) et 2 sites
// d'exploitation (PK14, PK20, route de Boali). Le libellé/adresse affichés
// viennent des messages i18n (footer.sites.*, contact.sites.*) ; ce tableau
// ne porte que l'identifiant et le lien Maps propres à chaque site.
export const SITES = [
  {
    id: "sica",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=SICA+II+2e+Arrondissement+Bangui+RCA",
  },
  {
    id: "pk14",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=PK14+Route+de+Boali+Bangui+RCA",
  },
  {
    id: "pk20",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=PK20+Route+de+Boali+Bangui+RCA",
  },
] as const;
