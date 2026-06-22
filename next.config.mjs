import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development", // avoid SW noise in dev
  workboxOptions: {
    // Cache the app shell + Supabase REST reads for offline browsing.
    // NOTE: writes are NOT cached here — they go through the offline outbox
    // (src/lib/outbox.js) so field assessments survive a dropped connection.
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/.*\.supabase\.co\/rest\/v1\/.*$/,
        method: "GET",
        handler: "NetworkFirst",
        options: {
          cacheName: "supabase-reads",
          networkTimeoutSeconds: 5,
          expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 },
        },
      },
      {
        urlPattern: /\.(?:png|jpg|jpeg|svg|webp|woff2)$/,
        handler: "CacheFirst",
        options: {
          cacheName: "static-assets",
          expiration: { maxEntries: 120, maxAgeSeconds: 60 * 60 * 24 * 30 },
        },
      },
    ],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Supabase Storage public bucket for portfolio/achievement images
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co" }],
  },
};

export default withPWA(nextConfig);
