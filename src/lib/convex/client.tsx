"use client";

import { ConvexAuthNextjsProvider } from "@convex-dev/auth/nextjs";
import { ConvexReactClient } from "convex/react";
import type { ReactNode } from "react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

// `ConvexReactClient` requires a non-empty URL. When the project hasn't been
// provisioned yet we still want the app to render — pages that call queries /
// mutations will be guarded with `isConvexConfigured()`.
const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

export function ConvexClientProviders({ children }: { children: ReactNode }) {
  if (!convex) {
    // Render children without auth context so the marketing pages still load.
    return <>{children}</>;
  }
  return (
    <ConvexAuthNextjsProvider client={convex}>
      {children}
    </ConvexAuthNextjsProvider>
  );
}

export function isConvexConfigured(): boolean {
  return Boolean(convexUrl);
}
