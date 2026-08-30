import { defineCliConfig } from "sanity/cli";

import { dataset, projectId } from "./lib/sanity/env";

/**
 * For the `sanity` CLI only — `sanity schema deploy`, `sanity dataset export`,
 * and friends. The Studio itself is served by Next from app/studio, so there
 * is deliberately no `sanity deploy` target here.
 */
export default defineCliConfig({
  api: { projectId, dataset },
  autoUpdates: false,
});
