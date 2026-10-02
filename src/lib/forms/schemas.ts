import { z } from "zod";

/** Trim/lowercase BEFORE validating, so pasted addresses with stray spaces are accepted. */
const emailField = z
  .string()
  .trim()
  .toLowerCase()
  .max(254, "Email address is too long.")
  .pipe(z.email("Please enter a valid email address."));

/** Anti-spam fields shared by every public form. */
export const spamGuardSchema = z.object({
  /** Honeypot — hidden from humans, bots tend to fill it. Must be empty. */
  company: z.string().max(0, "Spam detected").optional().default(""),
  /** Epoch ms when the form became interactive (set client-side). */
  startedAt: z.coerce.number().int().nonnegative().optional(),
});

export const newsletterSchema = spamGuardSchema.extend({
  email: emailField,
  consent: z.literal("on", { error: "Please confirm you'd like to receive the newsletter." }),
});

export const contactTopics = ["general", "feedback", "correction", "advertising", "partnership"] as const;

export const contactSchema = spamGuardSchema.extend({
  name: z.string().trim().min(2, "Please enter your name.").max(80, "Name is too long."),
  email: emailField,
  topic: z.enum(contactTopics, { error: "Please choose a topic." }),
  message: z
    .string()
    .trim()
    .min(20, "Please write at least 20 characters.")
    .max(5000, "Please keep your message under 5,000 characters.")
    .refine((m) => (m.match(/https?:\/\//gi) ?? []).length <= 3, "Please include no more than three links."),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;
export type ContactInput = z.infer<typeof contactSchema>;

/** Minimum time a human plausibly needs to fill a form. */
export const MIN_FILL_MS = 2500;
const MAX_FILL_MS = 24 * 60 * 60 * 1000;

export function isSuspiciousTiming(startedAt: number | undefined, now = Date.now()): boolean {
  if (!startedAt) return true;
  const elapsed = now - startedAt;
  return elapsed < MIN_FILL_MS || elapsed > MAX_FILL_MS;
}
