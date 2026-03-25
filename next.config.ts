import type { NextConfig } from "next";

const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [];

if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
  try {
    const supabaseUrl = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL);
    remotePatterns.push({
      protocol: supabaseUrl.protocol.replace(":", "") as "http" | "https",
      hostname: supabaseUrl.hostname,
      pathname: "/**",
    });
  } catch {
    // Ignore invalid env values and fall back to local/static assets only.
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
  },
};

export default nextConfig;
