// Shared limits for the Connect form — used by the API route for validation
// and by the form for maxLength, so the two can't drift apart. Keep in sync
// with the CHECK constraints in sql/002_contact_hardening.sql.
export const CONTACT_LIMITS = {
  name: 200,
  email: 320,
  message: 5000,
} as const;

// Max submissions per client per window before /api/connect returns 429.
export const RATE_LIMIT = { max: 5, windowMinutes: 60 } as const;
