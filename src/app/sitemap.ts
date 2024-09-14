import { MetadataRoute } from "next";

import { baseUrl } from "~/app/layout";

export default function sitemap(): MetadataRoute.Sitemap {
  const result: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
  ];

  return result;
}
