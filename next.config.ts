import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Admin image uploads go through server actions, whose request body is
    // capped at 1MB by default. Keep this above lib/storage.ts' 15MB limit
    // plus multipart overhead.
    serverActions: { bodySizeLimit: "20mb" },
    // Deliberately not using `globalNotFound` for 404s: on Next 16.2 it hangs
    // Turbopack's dev server. app/(site)/[...missing] handles unknown URLs.
  },
  images: {
    // Uploads land in Vercel Blob when BLOB_READ_WRITE_TOKEN is set.
    remotePatterns: [
      { protocol: "https", hostname: "**.public.blob.vercel-storage.com", pathname: "/uploads/**" },
    ],
  },
};

export default nextConfig;
