import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FoodSense",
    short_name: "FoodSense",
    description: "Gestioná tu inventario de alimentos y priorizá lo que vence antes.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#fafaf7",
    theme_color: "#fafaf7",
    icons: [
      {
        src: "/foodsense-icon.jpg",
        sizes: "640x640",
        type: "image/jpeg",
        purpose: "any",
      },
      {
        src: "/foodsense-icon.jpg",
        sizes: "640x640",
        type: "image/jpeg",
        purpose: "maskable",
      },
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
