"use client";

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { apiVersion, dataset, projectId, STUDIO_BASE_PATH } from "./lib/sanity/env";
import { schemaTypes } from "./sanity/schemaTypes";

/**
 * The Studio, mounted inside this app at /studio.
 *
 * It is one route and one lazily-loaded chunk: nothing here reaches the
 * marketing or documentation pages, which stay the small static site they
 * were. The trade is worth it — an editor gets a URL on the same domain and
 * there is no second deployment to keep in step with this schema.
 *
 * Vision is included because a GROQ query is how you actually debug content,
 * and the Studio is already behind Sanity's own login.
 */
export default defineConfig({
  name: "uptimecairn",
  title: "Uptime Cairn",
  basePath: STUDIO_BASE_PATH,
  projectId,
  dataset,
  schema: { types: schemaTypes },
  plugins: [structureTool(), visionTool({ defaultApiVersion: apiVersion })],
});
