/**
 * Re-export of the Convex API surface used by client components.
 *
 * After `npx convex dev` has run for the first time, the typed API lives at
 * `convex/_generated/api`. Until then we fall back to the untyped `anyApi`
 * helper so the rest of the app still type-checks and builds.
 *
 * Once your `convex/_generated/` directory exists, you can swap this file to:
 *
 *   export { api } from "../../../convex/_generated/api";
 *
 * to get full end-to-end type safety on every query/mutation call.
 */
import { anyApi } from "convex/server";

// `anyApi` lets you reference functions by string path without compile-time
// type checking. Functions are still validated at runtime by Convex.
export const api = anyApi;
