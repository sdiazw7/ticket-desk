/**
 * Business limits for ticket fields.
 * The form enforces them in the browser; a real back end should enforce the same values.
 */
export const TICKET_LIMITS = {
  titleMaxLength: 120,
  customerNameMaxLength: 100,
  descriptionMaxLength: 2000,
} as const;
