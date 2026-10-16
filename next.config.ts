import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // page cross-fades via React's <ViewTransition> (src/app/template.tsx)
    viewTransition: true,
  },
  images: {
    // Post media in the feed (sample data uses Unsplash)
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' }],
  },
};

export default nextConfig;
