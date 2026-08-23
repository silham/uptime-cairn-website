import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Shiki resolves grammars by dynamic import at build time. Keeping it
  // external stops the bundler from statically walking ~200 grammar files.
  serverExternalPackages: ["shiki"],

  async headers() {
    return [
      {
        // The OpenAPI spec is published as a stable, fetchable artefact so
        // client generators can point straight at it.
        source: "/openapi.yaml",
        headers: [
          { key: "Content-Type", value: "application/yaml; charset=utf-8" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Cache-Control", value: "public, max-age=0, s-maxage=86400" },
        ],
      },
    ];
  },
};

export default nextConfig;
