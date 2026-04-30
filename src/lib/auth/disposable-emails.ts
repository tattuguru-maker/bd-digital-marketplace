/**
 * Hard-blocked disposable / temporary email providers. Kept intentionally
 * short — we want to block obvious throwaways without playing whack-a-mole.
 *
 * Add new domains as we observe them in the abuse logs.
 */
const DISPOSABLE_DOMAINS = new Set<string>([
  "mailinator.com",
  "10minutemail.com",
  "guerrillamail.com",
  "yopmail.com",
  "tempmail.com",
  "temp-mail.org",
  "trashmail.com",
  "fakeinbox.com",
  "throwawaymail.com",
  "getnada.com",
  "maildrop.cc",
  "dispostable.com",
  "sharklasers.com",
  "mailnesia.com",
  "spambox.us",
  "mintemail.com",
  "moakt.com",
  "tempr.email",
  "emailondeck.com",
]);

export function isDisposableEmail(email: string): boolean {
  const lower = email.trim().toLowerCase();
  const at = lower.lastIndexOf("@");
  if (at < 0) return false;
  const domain = lower.slice(at + 1);
  return DISPOSABLE_DOMAINS.has(domain);
}
