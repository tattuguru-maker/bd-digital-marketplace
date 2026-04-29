/**
 * Auth providers for Digibazar.
 *
 * `Password` is the email + password provider built into Convex Auth.
 * It supports flows: signUp, signIn, reset, reset-verification,
 * email-verification.
 *
 * We extend it with a `profile` callback that captures `fullName`, normalises
 * the email and assigns the default role `buyer` so every new account starts
 * with sensible app data.
 */
import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";
import type { DataModel } from "./_generated/dataModel";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password<DataModel>({
      profile(params) {
        const email = String(params.email ?? "").trim().toLowerCase();
        const fullName = String(params.fullName ?? "").trim();
        return {
          email,
          fullName: fullName || undefined,
          name: fullName || undefined,
          role: "buyer" as const,
          createdAt: Date.now(),
        };
      },
    }),
  ],
});
