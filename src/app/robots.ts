import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/app/", "/admin/"],
    },
    sitemap: "https://pollio.se/sitemap.xml",
  };
}
