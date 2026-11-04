import OpenAI from "openai";
import { MAX_SUBJECT_LENGTH } from "./concern-search";

export const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const DATA_URL = /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/]+=*$/;
const DEFAULT_MODEL = "gpt-4.1-mini";
export const UNKNOWN = "UNKNOWN";

export const IDENTIFY_PROMPT = `The image relates to a celebrity, band, or TV show. Reply with only the name to search for, as it is commonly written. Use any visible text, logo, poster, title card, or caption. Do not guess from a face alone. If you cannot determine the name, reply with exactly ${UNKNOWN}.`;

/** Validates a base64 data URL for a JPEG, PNG, or WebP image under the size limit. */
export function normalizeImage(input: unknown): string {
  if (typeof input !== "string" || !DATA_URL.test(input)) {
    throw new Error("Image must be a JPEG, PNG, or WebP data URL");
  }
  if (input.length > MAX_IMAGE_BYTES * 4 / 3) {
    throw new Error("Image must be under 4 MB");
  }
  return input;
}

/** Turns the model's reply into a subject, or null when it could not read one. */
export function subjectFromReply(reply: string): string | null {
  const text = reply.trim().replace(/^["']|["']$/g, "");
  if (!text || text.toUpperCase() === UNKNOWN || text.length > MAX_SUBJECT_LENGTH) return null;
  return text;
}

/** Resolves to the subject, or null when no name could be read. */
export type Identifier = (imageDataUrl: string) => Promise<string | null>;

export const openaiIdentify: Identifier = async (imageDataUrl) => {
  if (!process.env.OPENAI_API_KEY) throw new Error("Missing required environment variable OPENAI_API_KEY");
  const client = new OpenAI();
  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL ?? DEFAULT_MODEL,
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: IDENTIFY_PROMPT },
          { type: "image_url", image_url: { url: imageDataUrl, detail: "low" } },
        ],
      },
    ],
  });
  return subjectFromReply(completion.choices[0]?.message?.content ?? "");
};
