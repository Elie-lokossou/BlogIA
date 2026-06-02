import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/feed.xml",
        destination: "/rss.xml",
        permanent: true,
      },
    ];
  },
  images: {
    // L'optimiseur serveur télécharge les images source depuis Unsplash ; sur ce
    // réseau lent, le fetch upstream dépasse le timeout (7 s) et renvoie 500.
    // On sert donc les URLs Unsplash directement au navigateur (déjà dimensionnées
    // via ?w=&q=), ce qui évite le goulot de /_next/image.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
