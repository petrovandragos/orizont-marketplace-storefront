const checkEnvVariables = require("./check-env-variables")

checkEnvVariables()

/**
 * Medusa Cloud-related environment variables
 */
const S3_HOSTNAME = process.env.MEDUSA_CLOUD_S3_HOSTNAME
const S3_PATHNAME = process.env.MEDUSA_CLOUD_S3_PATHNAME
const BACKEND_HOSTNAME = process.env.MEDUSA_BACKEND_HOSTNAME

function hostFrom(url) {
  if (!url) return null
  try {
    const parsed = new URL(url)
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null
    return { protocol: parsed.protocol.replace(":", ""), hostname: parsed.hostname }
  } catch {
    return null
  }
}

// Hero banners are served from the Medusa static host (admin.orizont-srl.ro/static/…).
// next/image refuses remote URLs that are not listed here.
const imageHosts = [
  hostFrom(process.env.MEDUSA_BACKEND_URL),
  BACKEND_HOSTNAME ? { protocol: "https", hostname: BACKEND_HOSTNAME } : null,
  { protocol: "https", hostname: "admin.orizont-srl.ro" },
].filter(Boolean)

const uniqueImageHosts = []
for (const host of imageHosts) {
  if (
    !uniqueImageHosts.some(
      (existing) =>
        existing.protocol === host.protocol && existing.hostname === host.hostname
    )
  ) {
    uniqueImageHosts.push(host)
  }
}

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      ...uniqueImageHosts,
      {
        protocol: "https",
        hostname: "medusa-public-images.s3.eu-west-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "medusa-server-testing.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "medusa-server-testing.s3.us-east-1.amazonaws.com",
      },
      ...(S3_HOSTNAME && S3_PATHNAME
        ? [
          {
            protocol: "https",
            hostname: S3_HOSTNAME,
            pathname: S3_PATHNAME,
          },
        ]
        : []),
    ],
  },
}

module.exports = nextConfig
