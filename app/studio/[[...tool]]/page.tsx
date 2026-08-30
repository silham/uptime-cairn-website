import { NextStudio } from "next-sanity/studio";

import config from "@/sanity.config";
import { isSanityConfigured } from "@/lib/sanity/env";

/**
 * `force-static` is what keeps this route ○ in the build output alongside
 * everything else. The Studio is a single-page app: the server has nothing to
 * render per request, and Sanity handles authentication in the browser against
 * its own API. This is the shape next-sanity documents.
 */
export const dynamic = "force-static";

export { viewport } from "next-sanity/studio";

export const metadata = {
  title: "Studio",
  // A CMS has no business in a search index, and robots.ts disallows /studio
  // as well — belt and braces, because one of the two is easy to forget.
  robots: { index: false, follow: false },
};

export default function StudioPage() {
  if (!isSanityConfigured) return <NotConfigured />;
  return <NextStudio config={config} />;
}

/**
 * Without this the Studio boots with an empty projectId and fails with a
 * Sanity stack trace, which reads like the app is broken rather than like the
 * two environment variables are missing.
 */
function NotConfigured() {
  return (
    <main style={{ padding: "4rem 1.5rem", maxWidth: "38rem", margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.4rem", fontWeight: 600 }}>Studio is not configured</h1>
      <p style={{ marginTop: "1rem", lineHeight: 1.6 }}>
        Set <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> and{" "}
        <code>NEXT_PUBLIC_SANITY_DATASET</code> in <code>.env.local</code>, then
        restart the dev server. See the Blog section of the README.
      </p>
    </main>
  );
}
