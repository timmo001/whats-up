import { type MetadataRoute } from "next";

import { metadata as mainMetadata } from "~/app/layout";

export default function manifest(): MetadataRoute.Manifest {
  const icons = [
    {
      src: "/icon",
      sizes: "256x256",
      type: "image/png",
    },
  ];

  const manifest: MetadataRoute.Manifest = {
    name: mainMetadata.title as string,
    short_name: mainMetadata.title as string,
    description: mainMetadata.description!,
    start_url: "/dashboard",
    display: "standalone",
    background_color: "rgb(2, 8, 23)",
    theme_color: "#5b21b6",
    categories: mainMetadata.keywords as Array<string>,
    lang: "en",
    icons,
    screenshots: [
      {
        src: "/api/og",
        sizes: "1200x630",
        type: "image/png",
      },
    ],
    shortcuts: [],
  };

  // Return the manifest
  return manifest;
}
