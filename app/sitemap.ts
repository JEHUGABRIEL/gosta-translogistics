import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getServices } from "@/lib/services";
import { localizedPath, SITE_URL } from "@/lib/seo";

const STATIC_PATHS = [
  { path: "/", priority: 1, changeFrequency: "weekly" as const },
  { path: "/services", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/a-propos", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/contact", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/faq", priority: 0.5, changeFrequency: "monthly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const { poles, byPole } = getServices("fr");

  const polePaths = poles.map((pole) => ({
    path: `/services/${pole.id}`,
    priority: 0.8,
    changeFrequency: "monthly" as const,
  }));

  const servicePaths = poles.flatMap((pole) =>
    byPole[pole.id].map((service) => ({
      path: `/services/${pole.id}/${service.slug}`,
      priority: 0.7,
      changeFrequency: "monthly" as const,
    }))
  );

  return [...STATIC_PATHS, ...polePaths, ...servicePaths].map(
    ({ path, priority, changeFrequency }) => ({
      url: `${SITE_URL}${localizedPath(path, routing.defaultLocale)}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, `${SITE_URL}${localizedPath(path, l)}`])
        ),
      },
    })
  );
}
