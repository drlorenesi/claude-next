import withSerwist from "@serwist/next"

const withSerwistConfig = withSerwist({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["192.168.4.*"],
}

export default withSerwistConfig(nextConfig)
