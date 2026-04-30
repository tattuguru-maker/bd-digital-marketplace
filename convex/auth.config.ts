/**
 * Convex Auth configuration. The `applicationID` and `domain` here must
 * match the JWT issuer that Convex Auth uses to mint session tokens.
 *
 * `process.env.CONVEX_SITE_URL` is set automatically by `npx convex dev`.
 */
const authConfig = {
  providers: [
    {
      domain: process.env.CONVEX_SITE_URL,
      applicationID: "convex",
    },
  ],
};

export default authConfig;
