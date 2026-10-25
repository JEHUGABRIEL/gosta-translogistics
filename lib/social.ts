const MAPS_QUERY = "Gr%C3%A9+Vapend%C3%A9+PK16+Route+de+Boali+Bangui+RCA";

export const SOCIAL_LINKS = {
  facebook:
    "https://www.facebook.com/search/top?q=Gosta%20Trans%20%26%20Logistique%20et%20BTP",
  instagram: "https://www.instagram.com/Gosta_trans_Logistique_et_BTP",
  whatsapp: "https://wa.me/23675200313",
  // Adresse de l'entreprise (flyer) — utilisée comme lien Maps par défaut.
  googleMaps: `https://www.google.com/maps/search/?api=1&query=${MAPS_QUERY}`,
} as const;

// Un seul site depuis l'alignement sur le flyer : quartier Gré-Vapendé, PK16
// route de Boali. Le libellé et l'adresse affichés viennent des messages i18n
// (footer.sites.*, contact.sites.*) ; ce tableau ne porte que l'identifiant et
// le lien Maps.
export const SITES = [
  {
    id: "vapende",
    mapsUrl: `https://www.google.com/maps/search/?api=1&query=${MAPS_QUERY}`,
  },
] as const;
